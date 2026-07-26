'use strict';

document.getElementById('btnSair')?.addEventListener('click', async () => {
  const botao = document.getElementById('btnSair');
  botao.disabled = true;
  botao.textContent = 'Saindo...';
  try {
    const [{ getApp }, { getAuth, signOut }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js')
    ]);
    await signOut(getAuth(getApp()));
  } catch (erro) {
    console.error('Erro ao sair:', erro);
  } finally {
    window.location.replace('./login.html');
  }
});
