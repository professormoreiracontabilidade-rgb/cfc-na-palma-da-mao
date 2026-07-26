'use strict';

document.getElementById('btnSair')?.addEventListener('click', async () => {
  const botao = document.getElementById('btnSair');
  botao.disabled = true;
  botao.textContent = 'Saindo...';

  try {
    await firebase.auth().signOut();
  } catch (erro) {
    console.error('Erro ao sair:', erro);
  } finally {
    window.location.replace('./login.html');
  }
});
