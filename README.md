# Dashboard JIFS 2026 — Campus Sapucaia

Dashboard web interativo para gestão da agenda de jogos, resolução de conflitos de horários e escala de professores da delegação do **Campus Sapucaia** nos **Jogos Intercampus (JIFS 2026 - Fase Metropolitana)**.

---

## 🚀 Como Hospedar na Vercel

### Opção 1: Via Vercel CLI (Linha de Comando)
1. Certifique-se de ter o Node.js instalado.
2. Abra o terminal nesta pasta e execute:
   ```bash
   npx vercel
   ```
3. Siga as instruções no terminal (pressione `Enter` para aceitar os padrões).
4. O link público do seu dashboard hospedado será gerado instantaneamente!

---

### Opção 2: Via GitHub + Vercel Web
1. Crie um repositório no seu GitHub.
2. Envie os arquivos desta pasta para o repositório (`git push`).
3. Acesse o painel da [Vercel](https://vercel.com).
4. Clique em **"Add New"** > **"Project"** e selecione o repositório do GitHub.
5. Clique em **"Deploy"**. A Vercel publicará o site automaticamente!

---

## 📂 Arquivos da Aplicação
- `index.html`: Interface visual principal.
- `styles.css`: Estilização e design system (Dark/Light mode, impressão).
- `app.js`: Lógica de conflitos, CRUD de professores e matrículas.
- `data.js`: Tabela oficial de jogos das 12 modalidades.
- `vercel.json`: Arquivo de configuração de rotas e hospedagem da Vercel.
- `package.json`: Configurações do projeto Node.js.
