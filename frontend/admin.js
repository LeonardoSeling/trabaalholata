const API_BASE = 'http://localhost:3000/api';

// Elementos da tela
const telaLogin = document.getElementById('tela-login');
const painelControle = document.getElementById('painel-controle');
const campoSenha = document.getElementById('campo-senha');
const btnEntrar = document.getElementById('btn-entrar');
const btnSair = document.getElementById('btn-sair');
const erroLogin = document.getElementById('erro-login');
const tabelaAdminCorpo = document.getElementById('tabela-admin-corpo');

// Ao carregar a página, verifica se já existe um token salvo
window.addEventListener('load', () => {
  const token = localStorage.getItem('token_admin');
  if (token) {
    mostrarPainel();
  }
});

// Evento do botão de entrar
btnEntrar.addEventListener('click', fazerLogin);
campoSenha.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fazerLogin();
});

// Evento do botão de sair
btnSair.addEventListener('click', () => {
  localStorage.removeItem('token_admin');
  location.reload();
});

// Função para fazer login no backend
async function fazerLogin() {
  const senha = campoSenha.value;
  try {
    const resposta = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('token_admin', dados.token);
      erroLogin.innerText = '';
      mostrarPainel();
    } else {
      erroLogin.innerText = dados.erro || 'Senha incorreta!';
    }
  } catch (err) {
    erroLogin.innerText = 'Erro ao conectar com o servidor.';
  }
}

// Mostra o painel de controle e esconde o login
function mostrarPainel() {
  telaLogin.classList.add('oculto');
  painelControle.classList.remove('oculto');
  carregarTurmasAdmin();
}

// Carrega as turmas na tela do administrador
async function carregarTurmasAdmin() {
  try {
    const resposta = await fetch(`${API_BASE}/turmas`);
    const turmas = await resposta.json();

    tabelaAdminCorpo.innerHTML = '';

    turmas.forEach(turma => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td><strong>${turma.nome}</strong></td>
        <td>
          <div class="controles-placar">
            <button class="btn-ajuste btn-menos" onclick="alterarPontos(${turma.id}, -1)">-1</button>
            <button class="btn-ajuste btn-menos" onclick="alterarPontos(${turma.id}, -10)">-10</button>
            <input type="number" id="input-${turma.id}" class="input-qtd" value="${turma.latinhas}">
            <button class="btn-ajuste btn-mais" onclick="alterarPontos(${turma.id}, 1)">+1</button>
            <button class="btn-ajuste btn-mais" onclick="alterarPontos(${turma.id}, 10)">+10</button>
            <button class="btn-acao" style="padding: 5px 10px; font-size: 0.9rem;" onclick="salvarValorExato(${turma.id})">Salvar</button>
          </div>
        </td>
      `;
      tabelaAdminCorpo.appendChild(linha);
    });
  } catch (err) {
    console.error('Erro ao carregar turmas no painel admin:', err);
  }
}

// Função para os botões de +1, +10, -1, -10
async function alterarPontos(id, quantidade) {
  const token = localStorage.getItem('token_admin');
  try {
    const resposta = await fetch(`${API_BASE}/turmas/${id}/adicionar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantidade })
    });

    if (resposta.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      btnSair.click();
      return;
    }

    carregarTurmasAdmin();
  } catch (err) {
    alert('Erro ao alterar pontuação.');
  }
}

// Função para salvar o valor digitado direto na caixinha
async function salvarValorExato(id) {
  const token = localStorage.getItem('token_admin');
  const valorInput = document.getElementById(`input-${id}`).value;
  const latinhas = parseInt(valorInput) || 0;

  try {
    const resposta = await fetch(`${API_BASE}/turmas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ latinhas })
    });

    if (resposta.status === 401) {
      alert('Sessão expirada. Faça login novamente.');
      btnSair.click();
      return;
    }

    if (resposta.ok) {
      alert('Quantidade atualizada com sucesso!');
      carregarTurmasAdmin();
    }
  } catch (err) {
    alert('Erro ao salvar valor.');
  }
}
