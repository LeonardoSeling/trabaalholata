# trabaalholata
🎯 Visão Geral do que Vamos Fazer
Você vai construir 3 partes:

Backend — um "cérebro" que guarda os dados das turmas (latinhas) e responde pedidos.

Frontend — duas páginas: ranking público (todo mundo vê) e admin (só você edita).

Deploy — colocar tudo online de graça para os alunos acessarem.

Fluxo de dados:

text
Aluno abre o site → Frontend pede dados → Backend responde → Tela mostra ranking
Você entra no admin → Digita senha → Edita latinhas → Backend salva → Ranking atualiza
🧰 PARTE 0 — Preparação (30 min)
0.1 Instalar ferramentas
Instale o Node.js (versão LTS) em nodejs.org. Isso instala também o npm.

Instale o VS Code em code.visualstudio.com.

Crie uma conta no GitHub em github.com (vai servir para o deploy).

0.2 Testar se instalou certo
Abra o terminal (Prompt de Comando ou PowerShell) e digite:

node -v → deve mostrar um número tipo v20.x.x

npm -v → deve mostrar um número tipo 10.x.x

Se aparecer número, está pronto.

0.3 Criar a estrutura de pastas
No seu computador, crie uma pasta chamada competicao-latinhas e, dentro dela, duas subpastas:

text
competicao-latinhas/
├── backend/
└── frontend/
Abra essa pasta no VS Code (File → Open Folder).

🧠 PARTE 1 — Backend (o cérebro)
1.1 Inicializar o projeto Node
No terminal do VS Code, entre na pasta backend: cd backend

Rode npm init -y → cria um arquivo package.json.

Rode npm install express cors better-sqlite3 jsonwebtoken dotenv → instala as bibliotecas que vamos usar.

O que cada biblioteca faz:

express → cria o servidor e as rotas (URLs).

cors → permite que o frontend (em outro domínio) acesse o backend.

better-sqlite3 → banco de dados simples que fica num arquivo .sqlite.

jsonwebtoken → gera um "crachá" para o admin não precisar logar a cada clique.

dotenv → lê senhas de um arquivo .env sem expor no código.

1.2 Criar o arquivo de banco de dados (db.js)
Você vai criar um arquivo que:

Cria a tabela turmas com 3 colunas: id (número único), nome (ex: "6º A"), latinhas (quantidade).

Insere automaticamente as turmas da sua escola na primeira execução.

Exporta esse banco para o servidor usar.

Pense assim: é como criar uma planilha que se auto-preenche com as turmas.

1.3 Criar o arquivo do servidor (server.js)
Você vai criar rotas (URLs) que o frontend vai chamar:

Rota	O que faz	Quem pode
GET /api/turmas	Lista todas as turmas ordenadas por latinhas	Público
POST /api/login	Recebe a senha e devolve um token	Público
PUT /api/turmas/:id	Salva um valor exato de latinhas	Só admin
POST /api/turmas/:id/adicionar	Soma ou subtrai latinhas (+1, +10, −1)	Só admin
Sobre a segurança: as rotas de admin checam se o token enviado no cabeçalho é válido. Se não for, retornam erro 401.

1.4 Criar o arquivo .env
Na pasta backend, crie um arquivo chamado .env (só isso, sem extensão) com:

ADMIN_PASSWORD → a senha que você vai usar no painel admin.

JWT_SECRET → uma frase longa e aleatória (invente).

PORT → 3000.

Importante: esse arquivo NUNCA vai para o GitHub. Crie também um arquivo .gitignore na pasta backend contendo .env e node_modules.

1.5 Testar o backend localmente
No terminal, dentro da pasta backend, rode: node server.js

Você deve ver no terminal: 🚀 Rodando na porta 3000

Abra o navegador e acesse: http://localhost:3000/api/turmas

Se aparecer um JSON com as turmas, o backend está funcionando. Deixe o terminal aberto enquanto testa o frontend.

🎨 PARTE 2 — Frontend (as telas)
2.1 Criar a página pública (index.html)
Essa é a página que os alunos vão ver. Ela precisa ter:

Um cabeçalho com título "🥫 Competição de Latinhas".

Um pódio (top 3 turmas em destaque, com medalhas).

Uma tabela com todas as turmas em ordem decrescente de latinhas.

Um link pequeno para a página admin (discreto, tipo um botão no canto).

2.2 Criar o estilo (style.css)
Um arquivo único de CSS usado pelas duas páginas. Defina:

Fundo com degradê azul, texto branco.

Pódio com 3 caixas: ouro (1º), prata (2º), bronze (3º). O 1º fica maior e no centro.

Tabela com linhas alternadas e cabeçalho destacado.

Layout responsivo (funcionar bem no celular).

2.3 Criar a lógica pública (script.js)
O que esse arquivo faz:

Chama GET /api/turmas ao abrir a página.

Pega as 3 primeiras e monta o pódio (2º à esquerda, 1º no meio maior, 3º à direita).

Monta a tabela com todas as turmas.

Atualiza automaticamente a cada 30 segundos (para o ranking ficar vivo durante o recreio).

Atenção: no topo do arquivo, tem uma constante API. Localmente você coloca http://localhost:3000. Depois do deploy, troca pela URL do Render.

2.4 Criar a página admin (admin.html)
Essa página tem dois estados:

Tela de login — input de senha + botão "Entrar".

Painel — tabela com todas as turmas e, para cada uma:

Um campo para digitar o número exato.

Botões −1, +1, +10 para ajustes rápidos.

Botão "Salvar" para confirmar o valor digitado.

2.5 Criar a lógica admin (admin.js)
O que esse arquivo faz:

Ao entrar a senha, chama POST /api/login.

Se a senha estiver certa, guarda o token no localStorage do navegador (para não pedir senha toda hora).

Se estiver errada, mostra "Senha incorreta".

Depois de logado, carrega as turmas e mostra o painel.

Cada botão (+1, −1, +10, Salvar) chama o backend com o token no cabeçalho.

Se o token expirar (8h), o backend devolve 401 e o usuário é deslogado automaticamente.

2.6 Testar tudo localmente
Backend rodando (node server.js no terminal 1).

No terminal 2, dentro da pasta frontend, rode: npx serve .

O terminal vai mostrar um endereço tipo http://localhost:3000 — mas atenção, pode dar conflito com o backend. Se der, o serve usa outra porta automaticamente (tipo 5000). Use o endereço que ele mostrar.

Abra no navegador:

Página pública: http://localhost:5000/index.html → deve mostrar o ranking.

Página admin: http://localhost:5000/admin.html → deve pedir a senha.

Teste: faça login com a senha do .env, clique em +10 numa turma, volte para a página pública e veja se mudou.

☁️ PARTE 3 — Deploy Gratuito
3.1 Subir o projeto no GitHub
No GitHub, clique em New Repository, dê um nome (ex: competicao-latinhas), deixe público, não inicialize com README.

No terminal do VS Code, dentro da pasta competicao-latinhas:

git init

git add .

git commit -m "primeira versão"

git branch -M main

git remote add origin <URL_DO_SEU_REPO>

git push -u origin main

Antes disso: confirme que o .gitignore está excluindo node_modules e .env.

3.2 Deploy do Backend no Render
Crie conta em render.com (login com GitHub).

Clique em New → Web Service.

Conecte o repositório competicao-latinhas.

Preencha:

Name: latinhas-api

Root Directory: backend

Environment: Node

Build Command: npm install

Start Command: node server.js

Em Environment Variables, adicione ADMIN_PASSWORD e JWT_SECRET (mesmos valores do .env local).

Clique em Create Web Service. Aguarde uns 3–5 minutos.

Copie a URL gerada (tipo https://latinhas-api.onrender.com). Teste acessando <URL>/api/turmas no navegador — deve mostrar o JSON.

⚠️ Sobre o plano grátis do Render:

O serviço "hiberna" após 15 min sem uso. Quando alguém acessa, demora ~30s para acordar. Para uma competição, tudo bem — mas avise os alunos ou faça um ping periódico.

O banco SQLite pode ser apagado se você fizer redeploy. Durante a competição, não faça novos deploys ou os dados se perdem.

Alternativa se quiser persistência real grátis: usar Supabase (Postgres grátis) em vez de SQLite. Mais complexo, mas os dados não se perdem.

3.3 Deploy do Frontend na Vercel
Antes de subir, edite script.js e admin.js trocando http://localhost:3000 pela URL do Render.

Faça commit e push dessa mudança.

Crie conta em vercel.com (login com GitHub).

Clique em Add New → Project, selecione o repositório.

Em Root Directory, aponte para frontend.

Framework Preset: Other. Não tem build — é HTML puro.

Clique em Deploy. Em ~1 minuto você recebe uma URL tipo https://latinhas.vercel.app.

Pronto! Essa é a URL que você compartilha com os alunos.

3.4 Testar em produção
Abra <URL_VERCEL>/index.html → deve carregar o ranking (a primeira vez pode demorar 30s se o Render estiver hibernando).

Abra <URL_VERCEL>/admin.html → faça login, mude latinhas, confira na página pública.

Teste no celular também.

🔄 PARTE 4 — Uso no Dia a Dia
Durante a competição
Alunos: acessam a URL da Vercel, só veem o ranking.

Você (admin): acessa <URL>/admin.html, loga com a senha, e a cada vez que uma turma entrega latinhas, clica em +10 ou +1.

A página pública atualiza sozinha a cada 30s.

Dicas operacionais
Anote a senha do admin em algum lugar seguro — se perder, precisa mexer nas variáveis do Render.

Não faça deploy novo no Render durante a competição — o SQLite reseta.

Se o Render hibernar, o primeiro aluno a acessar espera ~30s. Pode avisar no grupo da escola.

Se quiser, crie um "ping" (um serviço grátis tipo UptimeRobot) que acessa a URL do backend a cada 10 min para evitar hibernação.

🛠️ PARTE 5 — Problemas Comuns e Soluções
Problema	Causa provável	Solução
Ranking não carrega	URL da API errada no script.js	Confira se trocou pela URL do Render
"CORS error" no console	Backend sem cors()	Confirme que instalou e usou o cors
Login dá "Senha incorreta" mesmo certa	Variável ADMIN_PASSWORD diferente no Render	Ajuste nas Environment Variables
Dados somem depois de um tempo	Render hibernou ou fez redeploy	Evite redeploys; considere Supabase
Página demora 30s para abrir	Hibernação do Render grátis	Normal; use UptimeRobot para manter acordado
✅ Checklist Final
□ Node.js e VS Code instalados
□ Pasta competicao-latinhas criada com backend e frontend
□ Backend rodando local (node server.js)
□ Turmas populadas no banco
□ Senha admin definida no .env
□ Frontend público mostrando ranking
□ Frontend admin logando e editando
□ .gitignore protegendo .env e node_modules
□ Projeto no GitHub
□ Backend no Render com variáveis de ambiente
□ Frontend na Vercel com URL da API atualizada
□ Testado em produção (desktop + celular)
