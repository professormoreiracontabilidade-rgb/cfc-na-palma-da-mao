const auth = firebase.auth();
const form = document.getElementById('formLogin');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnEntrar = document.getElementById('btnEntrar');
const btnRecuperar = document.getElementById('btnRecuperar');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = 'erro') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function traduzirErro(codigo) {
  const erros = {
    'auth/invalid-email': 'Digite um endereço de e-mail válido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-disabled': 'Este acesso está bloqueado. Entre em contato com o Professor Moreira.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/missing-password': 'Digite sua senha.'
  };
  return erros[codigo] || 'Não foi possível entrar. Confira os dados e tente novamente.';
}

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

auth.onAuthStateChanged(user => {
  if (user) window.location.replace('./app.html');
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  mensagem.className = 'mensagem';
  btnEntrar.disabled = true;
  btnEntrar.textContent = 'Verificando...';
  try {
    await auth.signInWithEmailAndPassword(emailInput.value.trim(), senhaInput.value);
    window.location.replace('./app.html');
  } catch (erro) {
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Entrar no aplicativo';
  }
});

btnRecuperar.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  if (!email) {
    mostrarMensagem('Digite seu e-mail acima para receber a recuperação de senha.');
    emailInput.focus();
    return;
  }
  btnRecuperar.disabled = true;
  try {
    await auth.sendPasswordResetEmail(email);
    mostrarMensagem('E-mail de recuperação enviado. Verifique também a caixa de spam.', 'sucesso');
 } catch (erro) {
  console.log("Código do erro:", erro.code);
  console.log("Mensagem:", erro.message);
  mostrarMensagem(traduzirErro(erro.code));
}
  } finally {
    btnRecuperar.disabled = false;
  }
});
