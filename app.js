/**
 * Lógica do Dashboard de Controle de Horários & Conflitos JIFS 2026
 * Campus Sapucaia - Com Persistência Tripla (Supabase + IndexedDB + LocalStorage)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // --- ESTADO DA APLICAÇÃO ---
  const state = {
    jogos: [...JIFS_DATA.jogos],
    professores: [],
    atribuicoes: {},
    escalaDia: { "2026-08-25": "", "2026-08-26": "" },
    profSelecionadoMatriz: null,
    filtros: {
      data: 'todas',
      modalidade: 'todas',
      quadra: 'todas',
      categoria: 'todas',
      apenasSapucaia: true,
      busca: ''
    },
    tabAtiva: 'cards',
    tema: localStorage.getItem('jifs_theme') || 'dark'
  };

  // --- INICIALIZAÇÃO DA PERSISTÊNCIA ---
  await initDatabaseAndLoadState();
  initTheme();
  populateFilterDropdowns();
  bindEvents();
  render();

  // --- CARREGAMENTO E SINCRONIZAÇÃO DE DADOS ---
  async function initDatabaseAndLoadState() {
    try {
      await DBService.init();
      const profsDB = await DBService.getProfessores();
      const atribDB = await DBService.getAtribuicoes();
      const escalaDB = await DBService.getEscalaDia();

      // Carrega do banco de dados do Supabase
      if (profsDB && profsDB.length > 0) {
        state.professores = profsDB;
      } else {
        // Se o banco estiver vazio, usa o fallback do localStorage/vazio
        state.professores = loadProfessoresFallback();
      }

      state.atribuicoes = Object.keys(atribDB).length > 0 ? atribDB : loadAtribuicoesFallback();
      state.escalaDia = escalaDB || loadEscalaDiaFallback();

      saveAllStorageBackup();
      console.log("⚡ [App] Estado sincronizado e persistido com sucesso.");
    } catch (e) {
      console.warn("⚠️ Utilizando dados do localStorage como backup por erro de conexão:", e);
      state.professores = loadProfessoresFallback();
      state.atribuicoes = loadAtribuicoesFallback();
      state.escalaDia = loadEscalaDiaFallback();
    }
  }

  function setupRealtimeListeners() {
    if (!DBService.supabaseClient) return;

    // Escuta alterações na tabela de professores
    DBService.supabaseClient
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'professores' },
        async () => {
          console.log("🔄 Alteração detectada nos professores! Recarregando...");
          state.professores = await DBService.getProfessores();
          // Adicione aqui a sua função que redesenha a tela/interface:
          if (typeof renderApp === 'function') renderApp();
        }
      )
      .subscribe();
  }

  function loadProfessoresFallback() {
    const saved = localStorage.getItem('jifs_professores');

    // Tenta ler do localStorage se existir
    let profs = [];
    if (saved) {
      try {
        profs = JSON.parse(saved);
      } catch (e) {
        console.error("⚠️ Erro ao ler professores do localStorage:", e);
        profs = [];
      }
    }

    // Paleta de cores com fallback seguro
    const paleta = Array.isArray(window.JIFS_DATA?.paletaCoresProfessores)
      ? window.JIFS_DATA.paletaCoresProfessores
      : ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return profs.map((p, index) => {
      if (!p.cor) {
        p.cor = paleta[index % paleta.length];
      }
      return p;
    });
  }

  function loadAtribuicoesFallback() {
    const saved = localStorage.getItem('jifs_atribuicoes');
    return saved ? JSON.parse(saved) : {};
  }

  function loadEscalaDiaFallback() {
    const saved = localStorage.getItem('jifs_escala_dia');
    return saved ? JSON.parse(saved) : { "2026-08-25": "", "2026-08-26": "" };
  }

  function saveAllStorageBackup() {
    localStorage.setItem('jifs_professores', JSON.stringify(state.professores));
    localStorage.setItem('jifs_atribuicoes', JSON.stringify(state.atribuicoes));
    localStorage.setItem('jifs_escala_dia', JSON.stringify(state.escalaDia));
  }

  // --- GERENCIAMENTO DE TEMA ---
  function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (state.tema === 'light') {
      document.body.classList.add('light-theme');
      if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.body.classList.remove('light-theme');
      if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }

  function toggleTheme() {
    state.tema = state.tema === 'dark' ? 'light' : 'dark';
    localStorage.setItem('jifs_theme', state.tema);
    initTheme();
  }

  // --- VERIFICAÇÃO SE O JOGO É DE SAPUCAIA ---
  function isJogoSapucaia(j) {
    if (!j) return false;
    if (j.isSapucaia) return true;
    const e1 = (j.equipe1 || '').toLowerCase();
    const e2 = (j.equipe2 || '').toLowerCase();
    const nota = (j.notaCondicional || '').toLowerCase();
    return e1.includes('sapucaia') || e2.includes('sapucaia') || nota.includes('sapucaia');
  }

  // --- MOTOR REFINADO DE DETECÇÃO DE CONFLITOS ---
  function getConflitos() {
    const jogosSapucaia = state.jogos.filter(isJogoSapucaia);

    const mapaHorariosCampus = {};
    jogosSapucaia.forEach(jogo => {
      const key = `${jogo.data}_${jogo.horario}`;
      if (!mapaHorariosCampus[key]) mapaHorariosCampus[key] = [];
      mapaHorariosCampus[key].push(jogo);
    });

    const conflitosCampus = [];

    Object.keys(mapaHorariosCampus).forEach(key => {
      const jogosNoSlot = mapaHorariosCampus[key];
      if (jogosNoSlot.length > 1) {
        const profsEscalados = jogosNoSlot.map(j => state.atribuicoes[j.id] || '');

        const temJogoSemProf = profsEscalados.some(pId => pId === '');
        const profsValidos = profsEscalados.filter(pId => pId !== '');
        const temProfDuplicado = new Set(profsValidos).size < profsValidos.length;

        if (temJogoSemProf || temProfDuplicado) {
          const [data, horario] = key.split('_');

          let motivo = '';
          if (temJogoSemProf && temProfDuplicado) {
            motivo = 'Existem jogos sem professor E o mesmo professor foi escalado em quadras diferentes!';
          } else if (temJogoSemProf) {
            motivo = 'Jogo simultâneo sem professor responsável escalado!';
          } else if (temProfDuplicado) {
            motivo = 'O mesmo professor foi escalado para 2 ou mais jogos no mesmo horário!';
          }

          conflitosCampus.push({
            tipo: 'CAMPUS_SIMULTANEO',
            data,
            horario,
            motivo,
            temJogoSemProf,
            temProfDuplicado,
            jogos: jogosNoSlot
          });
        }
      }
    });

    return {
      campus: conflitosCampus,
      total: conflitosCampus.length
    };
  }

  // --- FILTRAGEM DE JOGOS ---
  function getJogosFiltrados() {
    return state.jogos.filter(j => {
      if (state.filtros.apenasSapucaia && !isJogoSapucaia(j)) return false;
      if (state.filtros.data !== 'todas' && j.data !== state.filtros.data) return false;
      if (state.filtros.modalidade !== 'todas' && j.modalidade !== state.filtros.modalidade) return false;
      if (state.filtros.quadra !== 'todas' && j.quadra !== state.filtros.quadra) return false;
      if (state.filtros.categoria !== 'todas' && j.categoria !== state.filtros.categoria) return false;

      if (state.filtros.busca.trim() !== '') {
        const query = state.filtros.busca.toLowerCase();
        const profId = state.atribuicoes[j.id];
        const prof = state.professores.find(p => p.id === profId);
        const profNome = prof ? prof.nome.toLowerCase() : '';

        const matchText = `${j.modalidade} ${j.equipe1} ${j.equipe2} ${j.quadra} ${j.horario} ${profNome} ${j.notaCondicional || ''}`.toLowerCase();
        if (!matchText.includes(query)) return false;
      }

      return true;
    });
  }

  // --- RENDERIZADORES PRINCIPAIS ---
  function render() {
    const conflitos = getConflitos();
    renderKPIs(conflitos);
    renderConflictBanner(conflitos);

    if (state.tabAtiva === 'cards') renderMatchCards(conflitos);
    if (state.tabAtiva === 'timeline') renderTimelineMatrix(conflitos);
    if (state.tabAtiva === 'conflitos') renderConflictCenter(conflitos);
    if (state.tabAtiva === 'professores') renderTeachersManagement(conflitos);
  }

  function renderKPIs(conflitos) {
    const jogosSapucaiaTotal = state.jogos.filter(isJogoSapucaia).length;
    const confirmadosSapucaia = state.jogos.filter(j => isJogoSapucaia(j) && j.status === 'Confirmado').length;
    const atribuidosCount = Object.keys(state.atribuicoes).filter(id => state.atribuicoes[id] !== '').length;

    const elTotal = document.getElementById('kpiTotalSapucaia');
    const elConf = document.getElementById('kpiConfirmados');
    const elConfl = document.getElementById('kpiConflitos');
    const elProfs = document.getElementById('kpiProfessores');
    const elBadge = document.getElementById('badgeConflitosTab');

    if (elTotal) elTotal.textContent = jogosSapucaiaTotal;
    if (elConf) elConf.textContent = confirmadosSapucaia;
    if (elConfl) elConfl.textContent = conflitos.campus.length;
    if (elProfs) elProfs.textContent = atribuidosCount;
    if (elBadge) elBadge.textContent = conflitos.campus.length;
  }

  function renderConflictBanner(conflitos) {
    const banner = document.getElementById('conflictAlertBanner');
    if (!banner) return;

    if (conflitos.campus.length > 0) {
      banner.style.display = 'flex';
      const elTitle = document.getElementById('bannerTextTitle');
      const elDesc = document.getElementById('bannerTextDesc');
      if (elTitle) elTitle.textContent = `${conflitos.campus.length} Conflito(s) de Escala Pendente(s)!`;
      if (elDesc) elDesc.textContent = `Existem jogos simultâneos sem professor responsável escalado ou com professor duplicado.`;
    } else {
      banner.style.display = 'none';
    }
  }

  // Render da Visão em Cards
  function renderMatchCards(conflitos) {
    const container = document.getElementById('matchCardsGrid');
    if (!container) return;

    const jogos = getJogosFiltrados();

    if (jogos.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); color: var(--text-muted);">
          <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-dim);"></i>
          <h3>Nenhum jogo encontrado com os filtros selecionados.</h3>
        </div>
      `;
      return;
    }

    container.innerHTML = jogos.map(j => {
      const isSap = isJogoSapucaia(j);
      const temConflito = conflitos.campus.some(c => c.data === j.data && c.horario === j.horario && c.jogos.some(g => g.id === j.id));
      const profAtribuidoId = state.atribuicoes[j.id] || '';
      const profObj = state.professores.find(p => p.id === profAtribuidoId);

      const dataFormatada = j.data === '2026-08-25' ? '25/08 (Terça-feira)' : '26/08 (Quarta-feira)';

      return `
        <div class="match-card ${isSap ? 'is-sapucaia' : ''} ${temConflito ? 'has-conflict' : ''}" id="card_${j.id}">
          <div class="card-header-top">
            <div class="sport-tag">
              <i class="${getSportIcon(j.modalidade)}"></i>
              ${j.modalidade}
            </div>
            <div class="court-badge">
              <i class="fa-solid fa-location-dot"></i> ${j.quadra}
            </div>
          </div>

          <div class="match-time-slot">
            <i class="fa-solid fa-clock"></i> ${dataFormatada} às ${j.horario}
          </div>

          <div class="teams-matchup">
            <div class="team-box ${j.equipe1.toLowerCase().includes('sapucaia') ? 'sapucaia' : ''}">
              ${j.equipe1}
            </div>
            <div class="versus">VS</div>
            <div class="team-box ${j.equipe2.toLowerCase().includes('sapucaia') ? 'sapucaia' : ''}">
              ${j.equipe2}
            </div>
          </div>

          <div class="card-badges">
            <span class="badge-tag ${j.status.toLowerCase()}">${j.status}</span>
            <span class="badge-tag" style="background: rgba(255,255,255,0.06); color: var(--text-muted);">${j.chave}</span>
            ${temConflito ? '<span class="badge-tag conflito"><i class="fa-solid fa-triangle-exclamation"></i> Conflito de Escala</span>' : (profAtribuidoId ? `<span class="badge-tag confirmado" style="background: rgba(0, 200, 150, 0.15); color: ${profObj ? profObj.cor : 'var(--ifsul-green-light)'}; border-color: ${profObj ? profObj.cor : 'var(--ifsul-green)'};"><i class="fa-solid fa-check"></i> Escala Coberta</span>` : '')}
          </div>

          ${j.notaCondicional ? `<p style="font-size: 0.75rem; color: var(--accent-amber); font-style: italic;"><i class="fa-solid fa-circle-info"></i> ${j.notaCondicional}</p>` : ''}

          <div class="teacher-assign-box">
            <span class="teacher-assign-label">
              <i class="fa-solid fa-user-tie" style="color: ${profObj ? profObj.cor : 'inherit'};"></i> Responsável:
            </span>
            <select class="select-teacher ${profAtribuidoId ? 'assigned' : ''}" style="${profObj ? `border-color: ${profObj.cor}; color: ${profObj.cor}; font-weight: 600;` : ''}" data-match-id="${j.id}" onchange="window.assignTeacher('${j.id}', this.value)">
              <option value="">-- Escalar Prof. --</option>
              ${state.professores.map(p => `
                <option value="${p.id}" ${profAtribuidoId === p.id ? 'selected' : ''}>${p.nome}</option>
              `).join('')}
            </select>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render da Matriz / Linha do Tempo
  function renderTimelineMatrix(conflitos) {
    const container = document.getElementById('timelineViewContainer');
    if (!container) return;

    const dataSelecionada = state.filtros.data !== 'todas' ? state.filtros.data : '2026-08-25';

    const horarios = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:30", "20:30"];
    const locais = JIFS_DATA.locais;

    let html = `
      <div style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main);">
            Matriz de Quadras, Horários e Professores (${dataSelecionada === '2026-08-25' ? '25/08/2026' : '26/08/2026'})
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">
            🎨 Cada professor possui uma <strong style="color: var(--ifsul-green-light);">cor exclusiva</strong> para fácil identificação visual. Clique no jogo para escalar ou alterar.
          </p>
        </div>

        <div class="date-pills">
          <button class="date-pill-btn ${dataSelecionada === '2026-08-25' ? 'active' : ''}" onclick="window.setTimelineDate('2026-08-25')">25 de Agosto</button>
          <button class="date-pill-btn ${dataSelecionada === '2026-08-26' ? 'active' : ''}" onclick="window.setTimelineDate('2026-08-26')">26 de Agosto</button>
        </div>
      </div>

      <div class="timeline-container">
        <table class="timeline-table">
          <thead>
            <tr>
              <th class="time-column-header">Horário</th>
              ${locais.map(l => `<th>${l.nome}<br><span style="font-size: 0.7rem; font-weight: normal; color: var(--text-dim);">${l.tipo}</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    horarios.forEach(hr => {
      html += `<tr>`;
      html += `<td class="time-column-header">${hr}</td>`;

      locais.forEach(loc => {
        let jogosNoSlot = state.jogos.filter(j =>
          j.data === dataSelecionada &&
          j.horario === hr &&
          (j.quadra === loc.id || (loc.id === 'Q1_Praia' && j.quadra.includes('Praia')))
        );

        if (state.filtros.apenasSapucaia) {
          jogosNoSlot = jogosNoSlot.filter(isJogoSapucaia);
        }

        html += `<td>`;
        jogosNoSlot.forEach(j => {
          const isSap = isJogoSapucaia(j);
          const temConflito = conflitos.campus.some(c => c.data === j.data && c.horario === j.horario && c.jogos.some(g => g.id === j.id));

          const profId = state.atribuicoes[j.id];
          const profObj = state.professores.find(p => p.id === profId);

          const borderStyle = profObj ? `border-left: 4px solid ${profObj.cor} !important;` : '';

          html += `
            <div class="timeline-match-block ${isSap ? 'is-sapucaia' : ''} ${temConflito ? 'has-conflict' : ''}" 
                 style="${borderStyle}"
                 onclick="window.openAssignModal('${j.id}')"
                 title="Clique para escalar/remover professor responsável por ${j.modalidade}">
              <strong>${j.modalidade}</strong><br>
              <span style="font-size: 0.7rem;">${j.equipe1} x ${j.equipe2}</span>

              <!-- CRACHÁ DO PROFESSOR COM COR EXCLUSIVA NA MATRIZ -->
              <div class="timeline-teacher-tag ${profObj ? '' : 'unassigned'}" style="${profObj ? `color: ${profObj.cor}; font-weight: 700;` : ''}">
                ${profObj ? `<span class="prof-color-dot" style="background-color: ${profObj.cor};"></span> ${profObj.nome}` : '<i class="fa-solid fa-user-plus"></i> Escalar Prof.'}
              </div>

              ${temConflito ? '<div style="color: #f87171; font-weight: bold; font-size: 0.65rem; margin-top: 2px;">⚠️ PENDENTE DE ESCALA</div>' : ''}
            </div>
          `;
        });
        html += `</td>`;
      });

      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
  }

  // Render da Central de Conflitos
  function renderConflictCenter(conflitos) {
    const container = document.getElementById('conflictCenterContainer');
    if (!container) return;

    if (conflitos.campus.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem; background: var(--bg-card); border-radius: var(--radius-md);">
          <i class="fa-solid fa-circle-check" style="font-size: 3.5rem; color: var(--ifsul-green); margin-bottom: 1rem;"></i>
          <h2 style="font-family: var(--font-heading); color: var(--text-main);">Todas as Escalas Cobertas!</h2>
          <p style="color: var(--text-muted); max-width: 550px; margin: 0.5rem auto 0 auto;">
            Não há conflitos de horário pendentes. Todos os jogos simultâneos do Campus Sapucaia possuem professores responsáveis <strong>diferentes</strong> escalados!
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="conflict-center-grid">
        ${conflitos.campus.map((c, index) => `
          <div class="conflict-group-card">
            <div class="conflict-group-header">
              <div class="conflict-title">
                <i class="fa-solid fa-triangle-exclamation"></i> Conflito #${index + 1}: ${c.data === '2026-08-25' ? '25/08 (Terça-feira)' : '26/08 (Quarta-feira)'} às ${c.horario}
              </div>
              <span class="badge-tag conflito">${c.jogos.length} JOGOS SIMULTÂNEOS</span>
            </div>

            <p style="font-size: 0.875rem; color: #f87171; font-weight: 600; margin-bottom: 1rem;">
              ⚠️ <strong>Motivo do Conflito:</strong> ${c.motivo}
            </p>

            <div class="conflict-matches-list">
              ${c.jogos.map(j => {
      const profId = state.atribuicoes[j.id];

      return `
                  <div class="match-card is-sapucaia has-conflict" style="margin: 0;">
                    <div class="card-header-top">
                      <div class="sport-tag"><i class="${getSportIcon(j.modalidade)}"></i> ${j.modalidade}</div>
                      <div class="court-badge"><i class="fa-solid fa-location-dot"></i> ${j.quadra}</div>
                    </div>
                    <div class="teams-matchup">
                      <div class="team-box ${j.equipe1.includes('Sapucaia') ? 'sapucaia' : ''}">${j.equipe1}</div>
                      <div class="versus">VS</div>
                      <div class="team-box ${j.equipe2.includes('Sapucaia') ? 'sapucaia' : ''}">${j.equipe2}</div>
                    </div>
                    
                    <div class="teacher-assign-box">
                      <span class="teacher-assign-label"><i class="fa-solid fa-user-tie"></i> Escalado:</span>
                      <select class="select-teacher ${profId ? 'assigned' : ''}" onchange="window.assignTeacher('${j.id}', this.value)">
                        <option value="">-- Escalar Prof. --</option>
                        ${state.professores.map(p => `<option value="${p.id}" ${profId === p.id ? 'selected' : ''}>${p.nome}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render da Gestão de Professores
  function renderTeachersManagement(conflitos) {
    const container = document.getElementById('teachersManagementContainer');
    if (!container) return;

    const professoresComContagem = state.professores.map(p => {
      const jogosAssinados = Object.keys(state.atribuicoes).filter(matchId => state.atribuicoes[matchId] === p.id);
      return { ...p, totalJogos: jogosAssinados.length, jogosIds: jogosAssinados };
    });

    const profFiltroId = state.profSelecionadoMatriz;
    const professoresExibidos = profFiltroId
      ? professoresComContagem.filter(p => p.id === profFiltroId)
      : professoresComContagem;

    container.innerHTML = `
      <div class="teachers-view-container">
        <!-- PAINEL LATERAL: Corpo Docente -->
        <div class="teachers-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main);">Corpo Docente</h3>
            <button class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="window.openTeacherModal()">
              <i class="fa-solid fa-user-plus"></i> Novo Professor
            </button>
          </div>

          <!-- Filtro de Professor -->
          <div style="margin-bottom: 1rem;">
            <label class="filter-label">Filtrar Matriz por Professor</label>
            <select class="select-custom" style="width: 100%; margin-top: 0.25rem;" onchange="window.setMatrizProfFilter(this.value)">
              <option value="">-- Todos os Professores --</option>
              ${state.professores.map(p => `
                <option value="${p.id}" ${profFiltroId === p.id ? 'selected' : ''}>${p.nome}</option>
              `).join('')}
            </select>
          </div>

          <div class="teachers-list">
            ${professoresComContagem.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">Nenhum professor cadastrado.</p>
            ` : professoresComContagem.map(p => `
              <div class="teacher-item-card ${profFiltroId === p.id ? 'selected-prof-card' : ''}">
                <div>
                  <div class="teacher-name">
                    <span class="prof-color-dot" style="background-color: ${p.cor};"></span>
                    ${p.nome}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${p.email || p.modalidadePreferencial || 'Geral'}</div>
                </div>

                <div class="teacher-actions-group">
                  <span class="teacher-count-badge" style="background: rgba(255,255,255,0.08); color: ${p.cor}; border: 1px solid ${p.cor};">${p.totalJogos} jogo(s)</span>
                  <button class="btn-action-sm edit" onclick="window.openTeacherModal('${p.id}')" title="Editar Professor">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button class="btn-action-sm delete" onclick="window.deleteTeacher('${p.id}')" title="Excluir Professor">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- PAINEL PRINCIPAL: MATRIZES INDIVIDUAIS DE CADA PROFESSOR -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Escala dos Chefes do Dia -->
          <div class="kpi-card" style="flex-direction: column; align-items: flex-start;">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.35rem;">
              <i class="fa-solid fa-user-shield" style="color: var(--ifsul-green);"></i> Chefia de Delegação por Dia
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; width: 100%; margin-top: 0.5rem;">
              <div style="flex: 1; min-width: 220px;">
                <label class="filter-label">Terça-Feira (25/08/2026)</label>
                <select class="select-custom" style="width: 100%; margin-top: 0.35rem;" onchange="window.setEscalaDia('2026-08-25', this.value)">
                  <option value="">-- Selecione o Chefe do Dia 25 --</option>
                  ${state.professores.map(p => `
                    <option value="${p.id}" ${state.escalaDia["2026-08-25"] === p.id ? 'selected' : ''}>${p.nome}</option>
                  `).join('')}
                </select>
              </div>

              <div style="flex: 1; min-width: 220px;">
                <label class="filter-label">Quarta-Feira (26/08/2026)</label>
                <select class="select-custom" style="width: 100%; margin-top: 0.35rem;" onchange="window.setEscalaDia('2026-08-26', this.value)">
                  <option value="">-- Selecione o Chefe do Dia 26 --</option>
                  ${state.professores.map(p => `
                    <option value="${p.id}" ${state.escalaDia["2026-08-26"] === p.id ? 'selected' : ''}>${p.nome}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- MATRIZ DE HORÁRIOS POR PROFESSOR -->
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-table" style="color: var(--accent-blue);"></i> Agenda e Matriz de Escala por Professor
          </h3>

          ${professoresExibidos.map(p => {
      const jogosDoProf = state.jogos.filter(j => state.atribuicoes[j.id] === p.id);

      const horariosCount = {};
      jogosDoProf.forEach(j => {
        const k = `${j.data}_${j.horario}`;
        horariosCount[k] = (horariosCount[k] || 0) + 1;
      });
      const temSobrecarga = Object.values(horariosCount).some(count => count > 1);

      return `
              <div class="teacher-matrix-card" style="border-top: 4px solid ${p.cor};">
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${p.cor}; box-shadow: 0 0 8px ${p.cor};"></div>
                    <div>
                      <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-main); font-weight: 700;">${p.nome}</h4>
                      <span style="font-size: 0.8rem; color: var(--text-muted);">${p.email || 'Sem e-mail'} • Preferência: <strong>${p.modalidadePreferencial || 'Geral'}</strong></span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${temSobrecarga ? '<span class="badge-tag conflito"><i class="fa-solid fa-triangle-exclamation"></i> SOBREPOSIÇÃO DE HORÁRIO!</span>' : ''}
                    <span class="teacher-count-badge" style="background: rgba(255,255,255,0.06); color: ${p.cor}; border: 1px solid ${p.cor}; font-size: 0.85rem; padding: 0.25rem 0.75rem;">
                      ${jogosDoProf.length} Partida(s) Escalada(s)
                    </span>
                  </div>
                </div>

                ${jogosDoProf.length === 0 ? `
                  <p style="font-size: 0.85rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 1.5rem;">
                    Este professor ainda não possui nenhuma partida atribuída na tabela.
                  </p>
                ` : `
                  <table class="teacher-schedule-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Modalidade</th>
                        <th>Local / Quadra</th>
                        <th>Confronto (Times)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${jogosDoProf.map(j => {
        const dataFmt = j.data === '2026-08-25' ? '25/08 (Terça)' : '26/08 (Quarta)';
        const key = `${j.data}_${j.horario}`;
        const isDuplicado = horariosCount[key] > 1;

        return `
                          <tr style="${isDuplicado ? 'background: rgba(239, 68, 68, 0.15);' : ''}">
                            <td style="font-weight: 600; color: var(--accent-blue);">${dataFmt}</td>
                            <td style="font-weight: 700; color: var(--text-main);">${j.horario}</td>
                            <td><i class="${getSportIcon(j.modalidade)}"></i> <strong>${j.modalidade}</strong> (${j.categoria})</td>
                            <td><i class="fa-solid fa-location-dot"></i> ${j.quadra}</td>
                            <td><strong>${j.equipe1}</strong> vs <strong>${j.equipe2}</strong></td>
                            <td>
                              <span class="badge-tag ${j.status.toLowerCase()}">${j.status}</span>
                              ${isDuplicado ? '<span class="badge-tag conflito" style="font-size:0.65rem;">DUPLICADO</span>' : ''}
                            </td>
                          </tr>
                        `;
      }).join('')}
                    </tbody>
                  </table>
                `}
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  // --- FUNÇÕES UTILITÁRIAS E GLOBAIS ---
  function getSportIcon(modalidade) {
    if (modalidade.includes('Basquete')) return 'fa-solid fa-basketball';
    if (modalidade.includes('Futsal')) return 'fa-solid fa-futbol';
    if (modalidade.includes('Futebol')) return 'fa-solid fa-futbol';
    if (modalidade.includes('Volei') || modalidade.includes('Vôlei')) return 'fa-solid fa-volleyball';
    if (modalidade.includes('Handebol')) return 'fa-solid fa-hand-paper';
    if (modalidade.includes('Punhobol')) return 'fa-solid fa-bullseye';
    return 'fa-solid fa-trophy';
  }

  function populateFilterDropdowns() {
    const selectModalidade = document.getElementById('selectModalidade');
    const selectQuadra = document.getElementById('selectQuadra');

    if (selectModalidade) {
      selectModalidade.innerHTML = '<option value="todas">Todas as Modalidades</option>' +
        JIFS_DATA.modalidades.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    if (selectQuadra) {
      selectQuadra.innerHTML = '<option value="todas">Todas as Quadras/Campos</option>' +
        JIFS_DATA.locais.map(l => `<option value="${l.id}">${l.nome}</option>`).join('');
    }
  }

  function bindEvents() {
    const btnTheme = document.getElementById('themeToggleBtn');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetTab = btn.getAttribute('data-tab');
        btn.classList.add('active');
        const contentEl = document.getElementById(`tab_${targetTab}`);
        if (contentEl) contentEl.classList.add('active');
        state.tabAtiva = targetTab;
        render();
      });
    });

    // Filtros
    const selMod = document.getElementById('selectModalidade');
    if (selMod) {
      selMod.addEventListener('change', (e) => {
        state.filtros.modalidade = e.target.value;
        render();
      });
    }

    const selQuad = document.getElementById('selectQuadra');
    if (selQuad) {
      selQuad.addEventListener('change', (e) => {
        state.filtros.quadra = e.target.value;
        render();
      });
    }

    const selCat = document.getElementById('selectCategoria');
    if (selCat) {
      selCat.addEventListener('change', (e) => {
        state.filtros.categoria = e.target.value;
        render();
      });
    }

    const inpBusca = document.getElementById('inputBusca');
    if (inpBusca) {
      inpBusca.addEventListener('input', (e) => {
        state.filtros.busca = e.target.value;
        render();
      });
    }

    const chkSap = document.getElementById('chkApenasSapucaia');
    if (chkSap) {
      chkSap.addEventListener('change', (e) => {
        state.filtros.apenasSapucaia = e.target.checked;
        render();
      });
    }

    document.querySelectorAll('.date-pill-btn[data-date]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-pill-btn[data-date]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filtros.data = btn.getAttribute('data-date');
        render();
      });
    });
  }

  // --- INTERAÇÕES E MÉTODOS GLOBAIS ---
  window.setMatrizProfFilter = function (profId) {
    state.profSelecionadoMatriz = profId || null;
    render();
  };

  window.assignTeacher = async function (matchId, teacherId) {
    if (teacherId) {
      state.atribuicoes[matchId] = teacherId;
    } else {
      delete state.atribuicoes[matchId];
    }
    saveAllStorageBackup();
    await DBService.setAtribuicao(matchId, teacherId);
    render();
  };

  // MODAL DE ATRIBUIÇÃO AO CLICAR NO JOGO DA MATRIZ
  window.openAssignModal = function (matchId) {
    const jogo = state.jogos.find(j => j.id === matchId);
    if (!jogo) return;

    const modal = document.getElementById('assignTeacherModal');
    const inputMatchId = document.getElementById('assignMatchId');
    const detailsContainer = document.getElementById('assignMatchDetailsInfo');
    const selectProf = document.getElementById('assignSelectProfessor');

    if (inputMatchId) inputMatchId.value = jogo.id;

    const dataFormatada = jogo.data === '2026-08-25' ? '25/08 (Terça-feira)' : '26/08 (Quarta-feira)';

    if (detailsContainer) {
      detailsContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="font-family: var(--font-heading); font-weight: 700; color: var(--ifsul-green); font-size: 1.05rem;">
            <i class="${getSportIcon(jogo.modalidade)}"></i> ${jogo.modalidade}
          </span>
          <span class="court-badge"><i class="fa-solid fa-location-dot"></i> ${jogo.quadra}</span>
        </div>

        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem;">
          ${jogo.equipe1} <span style="color: var(--text-dim); font-size: 0.8rem;">VS</span> ${jogo.equipe2}
        </div>

        <div style="font-size: 0.8rem; color: var(--accent-blue);">
          <i class="fa-solid fa-clock"></i> ${dataFormatada} às ${jogo.horario} • Chave: ${jogo.chave} (${jogo.status})
        </div>
      `;
    }

    const profAtualId = state.atribuicoes[jogo.id] || '';

    if (selectProf) {
      selectProf.innerHTML = `
        <option value="">-- Sem Professor (Nenhum) --</option>
        ${state.professores.map(p => `
          <option value="${p.id}" ${profAtualId === p.id ? 'selected' : ''}>${p.nome} (${p.modalidadePreferencial || 'Geral'})</option>
        `).join('')}
      `;
    }

    if (modal) modal.classList.add('active');
  };

  window.closeAssignModal = function () {
    const modal = document.getElementById('assignTeacherModal');
    if (modal) modal.classList.remove('active');
  };

  window.saveMatchTeacherFromModal = async function () {
    const matchIdInput = document.getElementById('assignMatchId');
    const profSelect = document.getElementById('assignSelectProfessor');

    if (matchIdInput && profSelect) {
      const matchId = matchIdInput.value;
      const profId = profSelect.value;

      if (matchId) {
        if (profId) {
          state.atribuicoes[matchId] = profId;
        } else {
          delete state.atribuicoes[matchId];
        }
        saveAllStorageBackup();
        await DBService.setAtribuicao(matchId, profId);
        window.closeAssignModal();
        render();
      }
    }
  };

  window.removeMatchTeacher = async function () {
    const matchIdInput = document.getElementById('assignMatchId');
    if (matchIdInput) {
      const matchId = matchIdInput.value;
      if (matchId) {
        delete state.atribuicoes[matchId];
        saveAllStorageBackup();
        await DBService.setAtribuicao(matchId, "");
        window.closeAssignModal();
        render();
      }
    }
  };

  window.setTimelineDate = function (data) {
    state.filtros.data = data;
    render();
  };

  window.setEscalaDia = async function (data, profId) {
    state.escalaDia[data] = profId;
    saveAllStorageBackup();
    await DBService.setEscalaDia(data, profId);
    render();
  };

  // MODAL CRUD DE PROFESSORES
  window.openTeacherModal = function (teacherId = null) {
    const modal = document.getElementById('teacherModal');
    const modalTitle = document.getElementById('teacherModalTitle');
    const inputId = document.getElementById('teacherFormId');
    const inputNome = document.getElementById('teacherFormNome');
    const inputEmail = document.getElementById('teacherFormEmail');
    const inputModalidade = document.getElementById('teacherFormModalidade');
    const inputCor = document.getElementById('teacherFormCor');

    if (teacherId) {
      const teacher = state.professores.find(p => p.id === teacherId);
      if (teacher) {
        if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-user-pen"></i> Editar Professor';
        if (inputId) inputId.value = teacher.id;
        if (inputNome) inputNome.value = teacher.nome;
        if (inputEmail) inputEmail.value = teacher.email || '';
        if (inputModalidade) inputModalidade.value = teacher.modalidadePreferencial || '';
        if (inputCor) inputCor.value = teacher.cor || JIFS_DATA.paletaCoresProfessores[0];
      }
    } else {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Novo Professor';
      if (inputId) inputId.value = '';
      if (inputNome) inputNome.value = '';
      if (inputEmail) inputEmail.value = '';
      if (inputModalidade) inputModalidade.value = '';

      const numProfs = state.professores.length;
      if (inputCor) inputCor.value = JIFS_DATA.paletaCoresProfessores[numProfs % JIFS_DATA.paletaCoresProfessores.length];
    }

    if (modal) modal.classList.add('active');
  };

  window.closeTeacherModal = function () {
    const modal = document.getElementById('teacherModal');
    if (modal) modal.classList.remove('active');
  };

  window.handleTeacherSubmit = async function (e) {
    e.preventDefault();
    const id = document.getElementById('teacherFormId').value;
    const nome = document.getElementById('teacherFormNome').value.trim();
    const email = document.getElementById('teacherFormEmail').value.trim();
    const modalidade = document.getElementById('teacherFormModalidade').value.trim();
    const corInput = document.getElementById('teacherFormCor');
    const cor = corInput ? corInput.value : JIFS_DATA.paletaCoresProfessores[0];

    if (!nome) return;

    let targetProf;

    if (id) {
      const index = state.professores.findIndex(p => p.id === id);
      if (index !== -1) {
        state.professores[index] = { ...state.professores[index], nome, email, modalidadePreferencial: modalidade, cor };
        targetProf = state.professores[index];
      }
    } else {
      targetProf = {
        id: 'p_' + Date.now(),
        nome,
        email,
        modalidadePreferencial: modalidade,
        cor: cor || JIFS_DATA.paletaCoresProfessores[state.professores.length % JIFS_DATA.paletaCoresProfessores.length]
      };
      state.professores.push(targetProf);
    }

    saveAllStorageBackup();

    if (targetProf) {
      await DBService.saveProfessor(targetProf);
    }

    window.closeTeacherModal();
    render();
  };

  window.deleteTeacher = async function (teacherId) {
    const prof = state.professores.find(p => p.id === teacherId);
    if (!prof) return;

    if (confirm(`Tem certeza que deseja excluir o(a) ${prof.nome}? As escalas vinculadas a este professor serão desfeitas.`)) {
      state.professores = state.professores.filter(p => p.id !== teacherId);

      Object.keys(state.atribuicoes).forEach(matchId => {
        if (state.atribuicoes[matchId] === teacherId) {
          delete state.atribuicoes[matchId];
        }
      });

      if (state.escalaDia["2026-08-25"] === teacherId) state.escalaDia["2026-08-25"] = "";
      if (state.escalaDia["2026-08-26"] === teacherId) state.escalaDia["2026-08-26"] = "";

      saveAllStorageBackup();
      await DBService.deleteProfessor(teacherId);
      render();
    }
  };

  window.exportSQLScript = async function () {
    const sqlText = await DBService.exportSQLQueries();
    const blob = new Blob([sqlText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Script_Persistencia_JIFS2026.sql';
    link.click();
  };

  window.exportScheduleCSV = function () {
    const jogosSapucaia = state.jogos.filter(isJogoSapucaia);
    let csv = 'Data,Horario,Modalidade,Quadra,Equipe 1,Equipe 2,Chave,Status,Professor Responsavel\n';

    jogosSapucaia.forEach(j => {
      const profId = state.atribuicoes[j.id];
      const prof = state.professores.find(p => p.id === profId);
      const profNome = prof ? prof.nome : 'Nao escalado';

      csv += `"${j.data}","${j.horario}","${j.modalidade}","${j.quadra}","${j.equipe1}","${j.equipe2}","${j.chave}","${j.status}","${profNome}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Agenda_Jogos_Campus_Sapucaia_JIFS2026.csv';
    link.click();
  };

  window.printSchedule = function () {
    window.print();
  };
});
