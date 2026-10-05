const Database = require('better-sqlite3');
const path = require('path');

// Cria ou abre o arquivo do banco de dados na pasta backend
const db = new Database(path.join(__dirname, 'dados.sqlite'));

// Cria a tabela de turmas se ela ainda não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS turmas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    latinhas INTEGER DEFAULT 0
  );
`);

// Verifica se o banco está vazio para colocar as turmas iniciais
const checarTurmas = db.prepare('SELECT COUNT(*) as total FROM turmas').get();

if (checarTurmas.total === 0) {
  const inserir = db.prepare('INSERT INTO turmas (nome, latinhas) VALUES (?, ?)');
  
  // Lista de turmas exemplo (Você pode mudar os nomes das turmas aqui se quiser!)
  const turmasIniciais = [
    '6º ano', '7º ano', '8º ano', '9º ano'
  ];
  
  // Insere cada turma com 0 latinhas no início
  for (const nomeTurma of turmasIniciais) {
    inserir.run(nomeTurma, 0);
  }
  
  console.log('🎉 Banco de dados inicializado com as turmas da escola!');
}

// Exporta o banco para o resto do servidor usar
module.exports = db;
