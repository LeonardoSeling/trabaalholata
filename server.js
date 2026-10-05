require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para checar se o Admin está autenticado (o "crachá" JWT)
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });

  try {
    const verificado = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// 1. Rota Pública: Listar todas as turmas ordenadas por quem tem mais latinhas
app.get('/api/turmas', (req, res) => {
  try {
    const turmas = db.prepare('SELECT * FROM turmas ORDER BY latinhas DESC').all();
    res.json(turmas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar turmas no banco.' });
  }
});

// 2. Rota Pública: Fazer login do administrador e receber o Token ("crachá")
app.post('/api/login', (req, res) => {
  const { senha } = req.body;
  if (senha === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ erro: 'Senha incorreta!' });
});

// 3. Rota Protegida: Salvar um valor exato de latinhas para uma turma
app.put('/api/turmas/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { latinhas } = req.body;
  try {
    const atualizar = db.prepare('UPDATE turmas SET latinhas = ? WHERE id = ?');
    const resultado = atualizar.run(latinhas, id);
    if (resultado.changes === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    res.json({ mensagem: 'Quantidade de latinhas atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar banco.' });
  }
});

// 4. Rota Protegida: Somar ou subtrair latinhas (+1, +10, -1, etc)
app.post('/api/turmas/:id/adicionar', verificarToken, (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body; // pode ser positivo ou negativo
  try {
    const adicionar = db.prepare('UPDATE turmas SET latinhas = latinhas + ? WHERE id = ?');
    const resultado = adicionar.run(quantidade, id);
    if (resultado.changes === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    res.json({ mensagem: 'Pontuação alterada com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao alterar pontuação.' });
  }
});

// Inicia o servidor na porta configurada
app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
