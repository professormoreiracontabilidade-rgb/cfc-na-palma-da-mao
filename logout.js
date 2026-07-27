'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('btnSair');
  if (!botao) return;

  botao.addEventListener('click', async () => {
    botao.disabled = true;
    botao.textContent = 'Saindo...';

    try {
      if (!window.CFC_FIREBASE_CONFIG) {
        throw new Error('Configuração do Firebase não encontrada.');
      }

      const appModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
      const authModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');

      const app = appModule.getApps().length
        ? appModule.getApp()
        : appModule.initializeApp(window.CFC_FIREBASE_CONFIG);

      await authModule.signOut(authModule.getAuth(app));
    } catch (erro) {
      console.error('Erro ao sair:', erro);
    } finally {
      window.location.replace('./login.html');
    }
  });
});
