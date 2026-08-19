# Dashboard JIFS 2026 — Campus Sapucaia

Dashboard web interativo para gestão da agenda de jogos, resolução de conflitos de horários e escala de professores da delegação do **Campus Sapucaia** nos **Jogos Intercampus (JIFS 2026 - Fase Metropolitana)**.

---

## ⚡ Conectando ao Supabase (PostgreSQL na Nuvem)

O código já possui **suporte nativo e automático ao Supabase**!

### Passo 1: Executar o `schema.sql` no Supabase
1. Acesse o painel do seu projeto no [Supabase](https://supabase.com).
2. Vá no menu **SQL Editor** no painel esquerdo.
3. Cole o conteúdo do arquivo [`schema.sql`](file:///c:/Users/Lenovo/Downloads/Controle%20de%20Hor%C3%A1rios%20Simult%C3%A2neos%20JIFS/schema.sql) e clique em **Run**.
4. As tabelas (`professores`, `locais`, `jogos`, `atribuicoes_professores`) e visões de conflito serão criadas instantaneamente!

### Passo 2: Ativar no `db.js`
Abra o arquivo [`db.js`](file:///c:/Users/Lenovo/Downloads/Controle%20de%20Hor%C3%A1rios%20Simult%C3%A2neos%20JIFS/db.js) e preencha as duas variáveis no topo:
```javascript
const SUPABASE_CONFIG = {
  url: "https://SEU-PROJETO.supabase.co",
  anonKey: "SUA-CHAVE-ANONIMA-AQUI"
};
```
PRONTO! O dashboard agora sincronizará automaticamente todas as alterações com o Supabase PostgreSQL na nuvem em tempo real!

---

## 📂 Arquivos da Aplicação
- `schema.sql`: Script SQL do banco de dados PostgreSQL / Supabase.
- `db.js`: Módulo de conexão com o banco de dados (IndexedDB local + Supabase).
- `index.html`: Interface visual principal.
- `styles.css`: Estilização e design system (Dark/Light mode, impressão).
- `app.js`: Lógica de conflitos, CRUD de professores e matrículas.
- `data.js`: Tabela oficial de jogos das 12 modalidades.
- `vercel.json`: Arquivo de configuração de rotas e hospedagem da Vercel.
- `package.json`: Configurações do projeto Node.js.
