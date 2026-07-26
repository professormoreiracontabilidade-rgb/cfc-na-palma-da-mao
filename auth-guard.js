const authGuard = firebase.auth();
let autenticacaoConfirmada = false;

const limite = setTimeout(() => {
  if (!autenticacaoConfirmada) window.location.replace('./login.html');
}, 10000);

authGuard.onAuthStateChanged(user => {
  autenticacaoConfirmada = true;
  clearTimeout(limite);
  if (!user) {
    window.location.replace('./login.html');
    return;
  }
  document.documentElement.classList.add('usuario-autenticado');
  const email = document.getElementById('usuarioEmail');
  if (email) email.textContent = user.email || 'Aluno';
}, () => {
  clearTimeout(limite);
  window.location.replace('./login.html');
});
