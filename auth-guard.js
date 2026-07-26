'use strict';

const authGuard = firebase.auth();
const limite = window.setTimeout(() => {
  window.location.replace('./login.html');
}, 12000);

authGuard.onAuthStateChanged(
  (user) => {
    window.clearTimeout(limite);
    if (!user) {
      window.location.replace('./login.html');
      return;
    }

    document.documentElement.classList.add('usuario-autenticado');
    const email = document.getElementById('usuarioEmail');
    if (email) email.textContent = user.email || 'Aluno';
  },
  (erro) => {
    window.clearTimeout(limite);
    console.error('Erro ao verificar autenticação:', erro);
    window.location.replace('./login.html');
  }
);
