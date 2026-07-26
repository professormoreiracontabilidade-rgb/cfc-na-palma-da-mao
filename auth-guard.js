'use strict';

const authGuard = firebase.auth();
let verificacaoConcluida = false;

const tempoLimite = window.setTimeout(() => {
  if (!verificacaoConcluida) {
    window.location.replace('./login.html');
  }
}, 12000);

authGuard.onAuthStateChanged(
  user => {
    verificacaoConcluida = true;
    window.clearTimeout(tempoLimite);

    if (!user) {
      window.location.replace('./login.html');
      return;
    }

    document.documentElement.classList.add('usuario-autenticado');

    const emailElemento = document.getElementById('usuarioEmail');
    if (emailElemento) {
      emailElemento.textContent = user.email || 'Aluno';
    }
  },
  erro => {
    console.error('Erro ao verificar a autenticação:', erro);
    verificacaoConcluida = true;
    window.clearTimeout(tempoLimite);
    window.location.replace('./login.html');
  }
);
