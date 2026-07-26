'use strict';

(async () => {
  const limite = setTimeout(() => window.location.replace('./login.html'), 15000);
  try {
    const [{ initializeApp, getApps, getApp }, { getAuth, onAuthStateChanged }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js')
    ]);
    const app = getApps().length ? getApp() : initializeApp(window.CFC_FIREBASE_CONFIG);
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      clearTimeout(limite);
      if (!user) {
        window.location.replace('./login.html');
        return;
      }
      document.documentElement.classList.add('usuario-autenticado');
      const email = document.getElementById('usuarioEmail');
      if (email) email.textContent = user.email || 'Aluno';
    });
  } catch (erro) {
    clearTimeout(limite);
    console.error('Erro ao verificar autenticação:', erro);
    window.location.replace('./login.html');
  }
})();
