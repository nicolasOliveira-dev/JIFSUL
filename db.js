/**
 * Módulo de Banco de Dados: DBService (IndexedDB + Suporte Nativo ao Supabase / PostgreSQL)
 * Sistema JIFS 2026 - Campus Sapucaia
 */

// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_CONFIG = {
  url: "https://vjazrxsfehwntchgwbes.supabase.co",
  anonKey: "sb_publishable_AccmJPHWzG75uWJ5Crw0xA_-ga4PuNB"
};

const DBService = {
  dbName: "JIFS_Sapucaia_DB",
  version: 1,
  db: null,
  supabaseClient: null,

  /**
   * Inicializa o Banco de Dados (Supabase na Nuvem se configurado, ou IndexedDB no navegador)
   */
  async init() {
    // 1. Tenta inicializar o Supabase se as chaves e biblioteca window.supabase existirem
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log("☁️ [DBService] Conectado com sucesso ao Supabase PostgreSQL!");
        return true;
      } catch (err) {
        console.warn("⚠️ Falha ao conectar no Supabase. Utilizando banco local IndexedDB:", err);
      }
    }

    // 2. Fallback: Banco de Dados IndexedDB local no navegador
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("professores")) {
          db.createObjectStore("professores", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("atribuicoes")) {
          db.createObjectStore("atribuicoes", { keyPath: "jogo_id" });
        }
        if (!db.objectStoreNames.contains("escala_dia")) {
          db.createObjectStore("escala_dia", { keyPath: "data_escala" });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        console.log("⚡ [DBService] Banco de dados IndexedDB local conectado.");
        this.seedInitialDataIfNeeded().then(() => resolve(true));
      };

      request.onerror = (e) => {
        console.error("❌ [DBService] Erro ao abrir banco de dados local:", e);
        reject(e);
      };
    });
  },

  async seedInitialDataIfNeeded() {
    try {
      const profs = await this.getProfessores();
      if (profs.length === 0 && Array.isArray(window.JIFS_DATA?.professoresPadrao)) {
        for (const p of window.JIFS_DATA.professoresPadrao) {
          await this.saveProfessor(p);
        }
      }
    } catch (err) {
      console.warn("⚠️ Erro ao semear dados iniciais no IndexedDB:", err);
    }
  },

  // ============================================================================
  // OPERAÇÕES: PROFESSORES
  // ============================================================================

  async getProfessores() {
    // Se estiver conectado ao Supabase
    if (this.supabaseClient) {
      const { data, error } = await this.supabaseClient.from('professores').select('*');
      if (!error && Array.isArray(data)) {
        return data.map((p, index) => {
          let corFinal = p.cor_hex;
          // Se não houver cor cadastrada no banco, busca da paleta padrão
          if (!corFinal && Array.isArray(window.JIFS_DATA?.paletaCoresProfessores)) {
            const paleta = window.JIFS_DATA.paletaCoresProfessores;
            corFinal = paleta[index % paleta.length];
          }

          return {
            id: String(p.id),
            nome: p.nome,
            email: p.email,
            modalidadePreferencial: p.modalidade_preferencial,
            cor: corFinal || '#10b981'
          };
        });
      }
    }

    // Fallback IndexedDB
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction("professores", "readonly");
      const store = tx.objectStore("professores");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  async saveProfessor(prof) {
    if (this.supabaseClient) {
      await this.supabaseClient.from('professores').upsert({
        id: prof.id,
        nome: prof.nome,
        email: prof.email,
        modalidade_preferencial: prof.modalidadePreferencial || 'Geral',
        cor_hex: prof.cor || '#10b981'
      });
      return;
    }

    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("professores", "readwrite");
      const store = tx.objectStore("professores");
      const req = store.put(prof);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (err) => reject(err);
    });
  },

  async deleteProfessor(id) {
    if (this.supabaseClient) {
      await this.supabaseClient.from('professores').delete().eq('id', id);
      await this.supabaseClient.from('atribuicoes_professores').delete().eq('professor_id', id);
      return;
    }

    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["professores", "atribuicoes"], "readwrite");
      const profStore = tx.objectStore("professores");
      const atribStore = tx.objectStore("atribuicoes");

      profStore.delete(id);

      const reqAtrib = atribStore.getAll();
      reqAtrib.onsuccess = () => {
        reqAtrib.result.forEach((atrib) => {
          if (atrib.professor_id === id) {
            atribStore.delete(atrib.jogo_id);
          }
        });
      };

      tx.oncomplete = () => resolve(true);
      tx.onerror = (err) => reject(err);
    });
  },

  // ============================================================================
  // OPERAÇÕES: ATRIBUIÇÕES DE JOGOS
  // ============================================================================

  async getAtribuicoes() {
    if (this.supabaseClient) {
      const { data, error } = await this.supabaseClient.from('atribuicoes_professores').select('*');
      if (!error && data) {
        const map = {};
        data.forEach(item => {
          map[item.jogo_id] = String(item.professor_id);
        });
        return map;
      }
    }

    if (!this.db) await this.init();
    return new Promise((resolve) => {
      if (!this.db) return resolve({});
      const tx = this.db.transaction("atribuicoes", "readonly");
      const store = tx.objectStore("atribuicoes");
      const req = store.getAll();
      req.onsuccess = () => {
        const map = {};
        (req.result || []).forEach((item) => {
          map[item.jogo_id] = item.professor_id;
        });
        resolve(map);
      };
      req.onerror = () => resolve({});
    });
  },

  async setAtribuicao(jogoId, professorId) {
    if (this.supabaseClient) {
      if (professorId) {
        await this.supabaseClient.from('atribuicoes_professores').upsert({
          jogo_id: jogoId,
          professor_id: professorId
        });
      } else {
        await this.supabaseClient.from('atribuicoes_professores').delete().eq('jogo_id', jogoId);
      }
      return;
    }

    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("atribuicoes", "readwrite");
      const store = tx.objectStore("atribuicoes");

      if (professorId) {
        store.put({ jogo_id: jogoId, professor_id: professorId, atribuido_em: new Date().toISOString() });
      } else {
        store.delete(jogoId);
      }

      tx.oncomplete = () => resolve(true);
      tx.onerror = (err) => reject(err);
    });
  },

  // ============================================================================
  // OPERAÇÕES: ESCALA DO DIA
  // ============================================================================

  async getEscalaDia() {
    if (this.supabaseClient) {
      const { data, error } = await this.supabaseClient.from('escala_chefia_dia').select('*');
      if (!error && data) {
        const map = { "2026-08-25": "", "2026-08-26": "" };
        data.forEach(item => {
          map[item.data_escala] = String(item.professor_id);
        });
        return map;
      }
    }

    if (!this.db) await this.init();
    return new Promise((resolve) => {
      if (!this.db) return resolve({ "2026-08-25": "", "2026-08-26": "" });
      const tx = this.db.transaction("escala_dia", "readonly");
      const store = tx.objectStore("escala_dia");
      const req = store.getAll();
      req.onsuccess = () => {
        const map = { "2026-08-25": "", "2026-08-26": "" };
        (req.result || []).forEach((item) => {
          map[item.data_escala] = item.professor_id;
        });
        resolve(map);
      };
      req.onerror = () => resolve({ "2026-08-25": "", "2026-08-26": "" });
    });
  },

  async setEscalaDia(dataEscala, professorId) {
    if (this.supabaseClient) {
      if (professorId) {
        await this.supabaseClient.from('escala_chefia_dia').upsert({
          data_escala: dataEscala,
          professor_id: professorId
        });
      } else {
        await this.supabaseClient.from('escala_chefia_dia').delete().eq('data_escala', dataEscala);
      }
      return;
    }

    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("escala_dia", "readwrite");
      const store = tx.objectStore("escala_dia");
      store.put({ data_escala: dataEscala, professor_id: professorId });
      tx.oncomplete = () => resolve(true);
      tx.onerror = (err) => reject(err);
    });
  },

  // ============================================================================
  // GERADOR E EXPORTADOR DE SCRIPTS SQL DINÂMICOS
  // ============================================================================

  async exportSQLQueries() {
    const profs = await this.getProfessores();
    const atribuicoes = await this.getAtribuicoes();
    const escalaDia = await this.getEscalaDia();

    let sql = `-- ==============================================================================\n`;
    let sqlFooter = `-- GERADO AUTOMATICAMENTE PELO DASHBOARD JIFS 2026 - CAMPUS SAPUCAIA\n`;
    let sqlDate = `-- Data de Geração: ${new Date().toLocaleString('pt-BR')}\n`;
    sql += sqlFooter + sqlDate;
    sql += `-- ==============================================================================\n\n`;

    sql += `-- 1. INSERT / UPDATE PROFESSORES\n`;
    profs.forEach((p) => {
      const email = p.email ? `'${p.email.replace(/'/g, "''")}'` : 'NULL';
      const mod = p.modalidadePreferencial ? `'${p.modalidadePreferencial.replace(/'/g, "''")}'` : "'Geral'";
      sql += `INSERT INTO professores (id, nome, email, modalidade_preferencial, cor_hex)\n`;
      sql += `VALUES ('${p.id}', '${p.nome.replace(/'/g, "''")}', ${email}, ${mod}, '${p.cor || '#10b981'}')\n`;
      sql += `ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, email = EXCLUDED.email, cor_hex = EXCLUDED.cor_hex;\n\n`;
    });

    sql += `-- 2. INSERT / UPDATE ATRIBUIÇÕES DE JOGOS\n`;
    Object.keys(atribuicoes).forEach((jogoId) => {
      const profId = atribuicoes[jogoId];
      if (profId) {
        sql += `INSERT INTO atribuicoes_professores (jogo_id, professor_id)\n`;
        sql += `VALUES ('${jogoId}', '${profId}')\n`;
        sql += `ON CONFLICT (jogo_id) DO UPDATE SET professor_id = EXCLUDED.professor_id;\n\n`;
      }
    });

    sql += `-- 3. INSERT / UPDATE ESCALA DE CHEFIA DO DIA\n`;
    Object.keys(escalaDia).forEach((data) => {
      const profId = escalaDia[data];
      if (profId) {
        sql += `INSERT INTO escala_chefia_dia (data_escala, professor_id)\n`;
        sql += `VALUES ('${data}', '${profId}')\n`;
        sql += `ON CONFLICT (data_escala) DO UPDATE SET professor_id = EXCLUDED.professor_id;\n\n`;
      }
    });

    return sql;
  }
};