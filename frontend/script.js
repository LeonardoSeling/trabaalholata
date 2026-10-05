// Localmente usamos o endereço do nosso servidor local. 
// Depois do deploy, mudaremos essa URL para o link da internet.
const API_URL = 'http://localhost:3000/api/turmas';

// Função que busca os dados no backend e atualiza a tela
async function atualizarRanking() {
  try {
    const resposta = await fetch(API_URL);
    const turmas = await resposta.json();

    // 1. Limpa os dados antigos do Pódio
    document.getElementById('nome-1').innerText = '--';
    document.getElementById('latinhas-1').innerText = '0';
    document.getElementById('nome-2').innerText = '--';
    document.getElementById('latinhas-2').innerText = '0';
    document.getElementById('nome-3').innerText = '--';
    document.getElementById('latinhas-3').innerText = '0';

    // 2. Preenche o Pódio com os dados reais (se houver turmas suficientes)
    if (turmas[0]) {
      document.getElementById('nome-1').innerText = turmas[0].nome;
      document.getElementById('latinhas-1').innerText = turmas[0].latinhas;
    }
    if (turmas[1]) {
      document.getElementById('nome-2').innerText = turmas[1].nome;
      document.getElementById('latinhas-2').innerText = turmas[1].latinhas;
    }
    if (turmas[2]) {
      document.getElementById('nome-3').innerText = turmas[2].nome;
      document.getElementById('latinhas-3').innerText = turmas[2].latinhas;
    }

    // 3. Preenche a Tabela Geral com todas as turmas
    const tabelaCorpo = document.getElementById('tabela-corpo');
    tabelaCorpo.innerHTML = ''; // Limpa a tabela antes de desenhar a nova

    turmas.forEach((turma, index) => {
      const linha = document.createElement('tr');
      
      // Define a medalha ou a posição em número
      let posicaoTexto = index + 1;
      if (index === 0) posicaoTexto = '🥇';
      if (index === 1) posicaoTexto = '🥈';
      if (index === 2) posicaoTexto = '🥉';

      linha.innerHTML = `
        <td><strong>${posicaoTexto}</strong></td>
        <td>${turma.nome}</td>
        <td>${turma.latinhas} latinhas</td>
      `;
      tabelaCorpo.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao buscar os dados do servidor:', erro);
  }
}

// Executa a função assim que a página abre
atualizarRanking();

// Atualiza o ranking automaticamente a cada 30 segundos
setInterval(atualizarRanking, 30000);
