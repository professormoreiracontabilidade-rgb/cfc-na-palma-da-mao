'use strict';

(async () => {
  const LOGIN_URL = './login.html';
  const limite = setTimeout(() => {
    window.location.replace(LOGIN_URL);
  }, 15000);

  try {
    if (!window.CFC_FIREBASE_CONFIG) {
      throw new Error('Configuração do Firebase não encontrada.');
    }

    const appModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const authModule = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');

    const app = appModule.getApps().length
      ? appModule.getApp()
      : appModule.initializeApp(window.CFC_FIREBASE_CONFIG);

    const auth = authModule.getAuth(app);

    authModule.onAuthStateChanged(auth, (user) => {
      clearTimeout(limite);

      if (!user) {
        window.location.replace(LOGIN_URL);
        return;
      }

      document.documentElement.classList.add('usuario-autenticado');

      const email = document.getElementById('usuarioEmail');
      if (email) {
        email.textContent = user.email || 'Aluno';
      }
    });
  } catch (erro) {
    clearTimeout(limite);
    console.error('Erro ao verificar autenticação:', erro);
    window.location.replace(LOGIN_URL);
  }
})();
