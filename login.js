'use strict';

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

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'mensagem';
}

function traduzirErro(codigo) {
  const erros = {
    'auth/invalid-api-key': 'A configuração do aplicativo está inválida. Atualize os arquivos do Firebase.',
    'auth/invalid-email': 'Digite um endereço de e-mail válido.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/user-disabled': 'Este acesso está bloqueado. Entre em contato com o Professor Moreira.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/missing-password': 'Digite sua senha.',
    'auth/missing-email': 'Digite seu e-mail.',
    'auth/operation-not-allowed': 'O login por e-mail e senha ainda não está habilitado no Firebase.'
  };
  return erros[codigo] || `Não foi possível entrar. Código: ${codigo || 'desconhecido'}.`;
}

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((erro) => {
  console.error('Falha ao definir persistência:', erro);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.replace('./index.html');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  limparMensagem();

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email) {
    mostrarMensagem('Digite seu e-mail.');
    emailInput.focus();
    return;
  }
  if (!senha) {
    mostrarMensagem('Digite sua senha.');
    senhaInput.focus();
    return;
  }

  btnEntrar.disabled = true;
  btnEntrar.textContent = 'Verificando...';

  try {
    await auth.signInWithEmailAndPassword(email, senha);
    window.location.replace('./index.html');
  } catch (erro) {
    console.error('Erro no login:', erro.code, erro.message);
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Entrar no aplicativo';
  }
});

btnRecuperar.addEventListener('click', async () => {
  limparMensagem();
  const email = emailInput.value.trim();

  if (!email) {
    mostrarMensagem('Digite seu e-mail acima para receber a recuperação de senha.');
    emailInput.focus();
    return;
  }

  btnRecuperar.disabled = true;
  btnRecuperar.textContent = 'Enviando...';

  try {
    await auth.sendPasswordResetEmail(email);
    mostrarMensagem('E-mail de recuperação enviado. Verifique também a caixa de spam.', 'sucesso');
  } catch (erro) {
    console.error('Erro na recuperação:', erro.code, erro.message);
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnRecuperar.disabled = false;
    btnRecuperar.textContent = 'Esqueci minha senha';
  }
});
