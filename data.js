/**
 * Base de Dados Oficial dos Jogos Intercampus (JIFS 2026) - Fase Metropolitana
 * Extraído das tabelas das 12 modalidades.
 */

const JIFS_DATA = {
  torneio: "JIFS 2026 - Fase Metropolitana",
  campusAlvo: "Sapucaia",
  datas: ["2026-08-25", "2026-08-26"],
  
  paletaCoresProfessores: [
    "#10b981", // Esmeralda
    "#0284c7", // Azul Céu
    "#8b5cf6", // Roxo
    "#ec4899", // Rosa
    "#f59e0b", // Âmbar
    "#06b6d4", // Ciano
    "#84cc16", // Verde Lima
    "#e11d48", // Carmim
    "#6366f1", // Índigo
    "#d97706"  // Dourado
  ],



  locais: [
    { id: "Q1", nome: "Quadra Q1", tipo: "Quadra Poliesportiva" },
    { id: "Q2", nome: "Quadra Q2", tipo: "Quadra Poliesportiva" },
    { id: "Q3", nome: "Quadra Q3", tipo: "Quadra Poliesportiva" },
    { id: "Cavasotto", nome: "Ginásio Cavasotto", tipo: "Ginásio Externo" },
    { id: "Unisinos", nome: "Campo Unisinos", tipo: "Campo de Futebol" },
    { id: "Q1_Praia", nome: "Quadra 1 (Praia)", tipo: "Quadra de Areia" }
  ],

  modalidades: [
    "Basquete Feminino",
    "Basquete Masculino",
    "Futsal Feminino",
    "Futsal Masculino",
    "Futebol de Campo Masculino",
    "Handebol Masculino",
    "Punhobol Feminino",
    "Punhobol Masculino",
    "Voleibol Feminino",
    "Voleibol Masculino",
    "Vôlei de Praia Feminino",
    "Vôlei de Praia Masculino"
  ],

  jogos: [
    // --- 1. BASQUETE FEMININO (Pag 1) ---
    { id: "BF_1", modalidade: "Basquete Feminino", categoria: "Feminino", data: "2026-08-25", horario: "17:30", chave: "Única", quadra: "Q2", equipe1: "Novo Hamburgo", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },

    // --- 2. BASQUETE MASCULINO (Pag 2) ---
    { id: "BM_1", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-25", horario: "12:30", chave: "Única", quadra: "Q2", equipe1: "Novo Hamburgo", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_2", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-25", horario: "13:30", chave: "Única", quadra: "Q2", equipe1: "Charqueadas", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_3", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-25", horario: "14:30", chave: "Única", quadra: "Q2", equipe1: "Passo Fundo", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_4", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-25", horario: "15:30", chave: "Única", quadra: "Q2", equipe1: "Charqueadas", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_5", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-25", horario: "16:30", chave: "Única", quadra: "Q2", equipe1: "Sapucaia", equipe2: "Venâncio Aires", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_6", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-26", horario: "08:00", chave: "Única", quadra: "Q2", equipe1: "Passo Fundo", equipe2: "Charqueadas", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_7", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-26", horario: "09:00", chave: "Única", quadra: "Q2", equipe1: "Novo Hamburgo", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_8", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-26", horario: "10:00", chave: "Única", quadra: "Q2", equipe1: "Charqueadas", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_9", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:00", chave: "Única", quadra: "Q2", equipe1: "Venâncio Aires", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "BM_10", modalidade: "Basquete Masculino", categoria: "Masculino", data: "2026-08-26", horario: "12:00", chave: "Única", quadra: "Q2", equipe1: "Sapucaia", equipe2: "Novo Hamburgo", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },

    // --- 3. FUTSAL FEMININO (Pag 3) ---
    { id: "FF_1", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-25", horario: "09:30", chave: "Única", quadra: "Q1", equipe1: "Venâncio Aires", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_2", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-25", horario: "10:30", chave: "Única", quadra: "Q1", equipe1: "Lajeado", equipe2: "Sapiranga", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_3", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-25", horario: "16:30", chave: "Única", quadra: "Q1", equipe1: "Passo Fundo", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_4", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-25", horario: "17:30", chave: "Única", quadra: "Q1", equipe1: "Lajeado", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_5", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-25", horario: "18:30", chave: "Única", quadra: "Q1", equipe1: "Sapucaia", equipe2: "Sapiranga", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_6", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-26", horario: "08:00", chave: "Única", quadra: "Q1", equipe1: "Venâncio Aires", equipe2: "Sapiranga", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_7", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-26", horario: "09:00", chave: "Única", quadra: "Q1", equipe1: "Passo Fundo", equipe2: "Lajeado", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_8", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-26", horario: "10:00", chave: "Única", quadra: "Q1", equipe1: "Sapucaia", equipe2: "Venâncio Aires", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_9", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-26", horario: "14:00", chave: "Única", quadra: "Q1", equipe1: "Sapiranga", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FF_10", modalidade: "Futsal Feminino", categoria: "Feminino", data: "2026-08-26", horario: "15:00", chave: "Única", quadra: "Q1", equipe1: "Lajeado", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },

    // --- 4. FUTSAL MASCULINO (Pag 4) ---
    { id: "FM_1", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "10:00", chave: "A", quadra: "Cavasotto", equipe1: "Sapiranga", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_2", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "11:00", chave: "A", quadra: "Cavasotto", equipe1: "Gravataí", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_3", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "12:00", chave: "B", quadra: "Cavasotto", equipe1: "Lajeado", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_4", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "13:00", chave: "B", quadra: "Cavasotto", equipe1: "Sapucaia", equipe2: "Charqueadas", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_5", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "15:00", chave: "A", quadra: "Cavasotto", equipe1: "Venâncio Aires", equipe2: "Sapiranga", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_6", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "16:00", chave: "A", quadra: "Cavasotto", equipe1: "Gravataí", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_7", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "17:00", chave: "B", quadra: "Cavasotto", equipe1: "Charqueadas", equipe2: "Lajeado", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_8", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-25", horario: "18:00", chave: "B", quadra: "Cavasotto", equipe1: "Sapucaia", equipe2: "Novo Hamburgo", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_9", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "08:00", chave: "B", quadra: "Cavasotto", equipe1: "Charqueadas", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_10", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "09:00", chave: "B", quadra: "Cavasotto", equipe1: "Lajeado", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_11", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "10:00", chave: "A", quadra: "Cavasotto", equipe1: "Sapiranga", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_12", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:00", chave: "A", quadra: "Cavasotto", equipe1: "Venâncio Aires", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "FM_13", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "13:30", chave: "Semifinal", quadra: "Cavasotto", equipe1: "1º A", equipe2: "2º B", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 2º colocado da Chave B" },
    { id: "FM_14", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "14:30", chave: "Semifinal", quadra: "Cavasotto", equipe1: "1º B", equipe2: "2º A", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 1º colocado da Chave B" },
    { id: "FM_15", modalidade: "Futsal Masculino", categoria: "Masculino", data: "2026-08-26", horario: "16:00", chave: "Final", quadra: "Cavasotto", equipe1: "Vencedor J13", equipe2: "Vencedor J14", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia avançar para a final" },

    // --- 5. FUTEBOL DE CAMPO MASCULINO (Pag 5) ---
    { id: "FUT_1", modalidade: "Futebol de Campo Masculino", categoria: "Masculino", data: "2026-08-25", horario: "09:00", chave: "Única", quadra: "Unisinos", equipe1: "Sapucaia", equipe2: "Lajeado", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "FUT_2", modalidade: "Futebol de Campo Masculino", categoria: "Masculino", data: "2026-08-25", horario: "14:30", chave: "Única", quadra: "Unisinos", equipe1: "Novo Hamburgo", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder o Jogo 1 (Sapucaia joga às 14:30)" },
    { id: "FUT_3", modalidade: "Futebol de Campo Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:00", chave: "Única", quadra: "Unisinos", equipe1: "Vencedor Jogo 1", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer o Jogo 1 (Sapucaia joga dia 26 às 11:00)" },

    // --- 6. HANDEBOL MASCULINO (Pag 6) ---
    { id: "HM_1", modalidade: "Handebol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "11:30", chave: "Única", quadra: "Q1", equipe1: "Sapucaia", equipe2: "Sapiranga", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "HM_2", modalidade: "Handebol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "19:30", chave: "Única", quadra: "Q1", equipe1: "Charqueadas", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J1 (jogará dia 25 às 19:30)" },
    { id: "HM_3", modalidade: "Handebol Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:00", chave: "Única", quadra: "Q1", equipe1: "Vencedor Jogo 1", equipe2: "Charqueadas", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J1 (jogará dia 26 às 11:00)" },

    // --- 7. PUNHOBOL FEMININO (Pag 7) ---
    { id: "PF_1", modalidade: "Punhobol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "13:30", chave: "Única", quadra: "Q1", equipe1: "Sapucaia", equipe2: "Venâncio Aires", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "PF_2", modalidade: "Punhobol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "15:30", chave: "Única", quadra: "Q1", equipe1: "Novo Hamburgo", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J1 (jogará dia 25 às 15:30)" },
    { id: "PF_3", modalidade: "Punhobol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "12:00", chave: "Única", quadra: "Q1", equipe1: "Vencedor Jogo 1", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J1 (jogará dia 26 às 12:00)" },

    // --- 8. PUNHOBOL MASCULINO (Pag 8) ---
    { id: "PM_1", modalidade: "Punhobol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "12:30", chave: "Única", quadra: "Q1", equipe1: "Novo Hamburgo", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "PM_2", modalidade: "Punhobol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "14:30", chave: "Única", quadra: "Q1", equipe1: "Venâncio Aires", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J1 (jogará dia 25 às 14:30)" },
    { id: "PM_3", modalidade: "Punhobol Masculino", categoria: "Masculino", data: "2026-08-26", horario: "13:00", chave: "Única", quadra: "Q1", equipe1: "Vencedor Jogo 1", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J1 (jogará dia 26 às 13:00)" },

    // --- 9. VOLEIBOL FEMININO (Pag 9) ---
    { id: "VF_1", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "09:30", chave: "B", quadra: "Q2", equipe1: "Sapucaia", equipe2: "Lajeado", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_2", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "10:30", chave: "A", quadra: "Q2", equipe1: "Novo Hamburgo", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_3", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "11:30", chave: "A", quadra: "Q2", equipe1: "Gravataí", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_4", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "18:30", chave: "B", quadra: "Q2", equipe1: "Sapiranga", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J1 (jogará às 18:30)" },
    { id: "VF_5", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "19:30", chave: "A", quadra: "Q2", equipe1: "Novo Hamburgo", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_6", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-25", horario: "20:30", chave: "A", quadra: "Q2", equipe1: "Venâncio Aires", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_7", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "08:00", chave: "A", quadra: "Q3", equipe1: "Gravataí", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_8", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "09:00", chave: "A", quadra: "Q3", equipe1: "Venâncio Aires", equipe2: "Passo Fundo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VF_9", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "10:00", chave: "B", quadra: "Q3", equipe1: "Vencedor Jogo 1", equipe2: "Sapiranga", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J1 (jogará dia 26 às 10:00)" },
    { id: "VF_10", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "13:00", chave: "Semifinal", quadra: "Q3", equipe1: "1º A", equipe2: "2º B", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 2º da Chave B" },
    { id: "VF_11", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "14:00", chave: "Semifinal", quadra: "Q3", equipe1: "1º B", equipe2: "2º A", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 1º da Chave B" },
    { id: "VF_12", modalidade: "Voleibol Feminino", categoria: "Feminino", data: "2026-08-26", horario: "15:30", chave: "Final", quadra: "Q3", equipe1: "Vencedor J10", equipe2: "Vencedor J11", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia avançar para a final" },

    // --- 10. VOLEIBOL MASCULINO (Pag 10) ---
    { id: "VM_1", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "09:30", chave: "A", quadra: "Q3", equipe1: "Sapucaia", equipe2: "Venâncio Aires", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_2", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "10:30", chave: "A", quadra: "Q3", equipe1: "Passo Fundo", equipe2: "Lajeado", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_3", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "11:30", chave: "B", quadra: "Q3", equipe1: "Sapiranga", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_4", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "12:30", chave: "B", quadra: "Q3", equipe1: "Charqueadas", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_5", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "13:30", chave: "A", quadra: "Q3", equipe1: "Lajeado", equipe2: "Sapucaia", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_6", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "14:30", chave: "A", quadra: "Q3", equipe1: "Passo Fundo", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_7", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "15:30", chave: "B", quadra: "Q3", equipe1: "Novo Hamburgo", equipe2: "Sapiranga", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_8", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "16:30", chave: "B", quadra: "Q3", equipe1: "Charqueadas", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_9", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "17:30", chave: "A", quadra: "Q3", equipe1: "Lajeado", equipe2: "Venâncio Aires", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_10", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "18:30", chave: "A", quadra: "Q3", equipe1: "Sapucaia", equipe2: "Passo Fundo", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_11", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "19:30", chave: "B", quadra: "Q3", equipe1: "Sapiranga", equipe2: "Charqueadas", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_12", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-25", horario: "20:30", chave: "B", quadra: "Q3", equipe1: "Novo Hamburgo", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VM_13", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-26", horario: "14:00", chave: "Semifinal", quadra: "Q2", equipe1: "1º A", equipe2: "2º B", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 1º da Chave A" },
    { id: "VM_14", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-26", horario: "15:00", chave: "Semifinal", quadra: "Q2", equipe1: "1º B", equipe2: "2º A", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 2º da Chave A" },
    { id: "VM_15", modalidade: "Voleibol Masculino", categoria: "Masculino", data: "2026-08-26", horario: "16:00", chave: "Final", quadra: "Q2", equipe1: "Vencedor J13", equipe2: "Vencedor J14", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for para a final" },

    // --- 11. VÔLEI DE PRAIA FEMININO (Pag 11) ---
    { id: "VPF_1", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "13:00", chave: "A", quadra: "Q1_Praia", equipe1: "Venâncio Aires", equipe2: "Lajeado", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPF_2", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "13:30", chave: "B", quadra: "Q1_Praia", equipe1: "Sapucaia", equipe2: "Charqueadas", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VPF_3", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "14:00", chave: "A", quadra: "Q1_Praia", equipe1: "Gravataí", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPF_4", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "14:30", chave: "B", quadra: "Q1_Praia", equipe1: "Novo Hamburgo", equipe2: "Perdedor Jogo 2", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J2 (jogará às 14:30)" },
    { id: "VPF_5", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "15:00", chave: "A", quadra: "Q1_Praia", equipe1: "Vencedor Jogo 1", equipe2: "Gravataí", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPF_6", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "15:30", chave: "B", quadra: "Q1_Praia", equipe1: "Vencedor Jogo 2", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J2 (jogará às 15:30)" },
    { id: "VPF_7", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "16:00", chave: "Semifinal", quadra: "Q1_Praia", equipe1: "1º A", equipe2: "2º B", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 2º B" },
    { id: "VPF_8", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "16:30", chave: "Semifinal", quadra: "Q1_Praia", equipe1: "1º B", equipe2: "2º A", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 1º B" },
    { id: "VPF_9", modalidade: "Vôlei de Praia Feminino", categoria: "Feminino", data: "2026-08-25", horario: "17:00", chave: "Final", quadra: "Q1_Praia", equipe1: "Vencedor J7", equipe2: "Vencedor J8", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for para a final" },

    // --- 12. VÔLEI DE PRAIA MASCULINO (Pag 12) ---
    { id: "VPM_1", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "08:00", chave: "B", quadra: "Q1_Praia", equipe1: "Sapucaia", equipe2: "Venâncio Aires", isSapucaia: true, tipo: "Grupo", status: "Confirmado" },
    { id: "VPM_2", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "08:30", chave: "A", quadra: "Q1_Praia", equipe1: "Gravataí", equipe2: "Lajeado", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPM_3", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "09:00", chave: "B", quadra: "Q1_Praia", equipe1: "Novo Hamburgo", equipe2: "Perdedor Jogo 1", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia perder J1 (jogará dia 26 às 09:00)" },
    { id: "VPM_4", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "09:30", chave: "A", quadra: "Q1_Praia", equipe1: "Charqueadas", equipe2: "Perdedor Jogo 2", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPM_5", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "10:00", chave: "B", quadra: "Q1_Praia", equipe1: "Vencedor Jogo 1", equipe2: "Novo Hamburgo", isSapucaia: false, tipo: "Grupo", status: "Condicional", notaCondicional: "Se Sapucaia vencer J1 (jogará dia 26 às 10:00)" },
    { id: "VPM_6", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "10:30", chave: "A", quadra: "Q1_Praia", equipe1: "Vencedor J2", equipe2: "Charqueadas", isSapucaia: false, tipo: "Grupo", status: "Confirmado" },
    { id: "VPM_7", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:00", chave: "Semifinal", quadra: "Q1_Praia", equipe1: "1º A", equipe2: "2º B", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 2º B" },
    { id: "VPM_8", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "11:30", chave: "Semifinal", quadra: "Q1_Praia", equipe1: "1º B", equipe2: "2º A", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for 1º B" },
    { id: "VPM_9", modalidade: "Vôlei de Praia Masculino", categoria: "Masculino", data: "2026-08-26", horario: "12:00", chave: "Final", quadra: "Q1_Praia", equipe1: "Vencedor J7", equipe2: "Vencedor J8", isSapucaia: false, tipo: "Mata-Mata", status: "Condicional", notaCondicional: "Se Sapucaia for para a final" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JIFS_DATA;
}
