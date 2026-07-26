'use strict';

const btnSair = document.getElementById('btnSair');

if (btnSair) {
  btnSair.addEventListener('click', async () => {
    btnSair.disabled = true;
    btnSair.textContent = 'Saindo...';

    try {
      await firebase.auth().signOut();
    } catch (erro) {
      console.error('Erro ao sair:', erro);
    } finally {
      window.location.replace('./login.html');
    }
  });
}
