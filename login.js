import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js?v=4.1";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("formLogin");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const btnRecuperar = document.getElementById("btnRecuperar");
const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo = "erro") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function traduzirErro(codigo) {
  const erros = {
    "auth/invalid-api-key": "A chave Web do Firebase foi recusada. Confira o firebase-config.js.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "A chave Web do Firebase foi recusada. Confira o firebase-config.js.",
    "auth/invalid-email": "Digite um endereço de e-mail válido.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "E-mail ou senha incorretos.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/user-disabled": "Este acesso está bloqueado. Entre em contato com o Professor Moreira.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
    "auth/missing-password": "Digite sua senha."
  };
  return erros[codigo] || `Não foi possível entrar. ${codigo ? `Erro: ${codigo}` : "Confira os dados e tente novamente."}`;
}

function destravarBotao() {
  btnEntrar.disabled = false;
  btnEntrar.textContent = "Entrar no aplicativo";
}

try {
  await setPersistence(auth, browserLocalPersistence);
} catch (erro) {
  console.warn("Não foi possível definir a persistência da sessão:", erro);
}

onAuthStateChanged(auth, user => {
  if (user) {
    window.location.replace("./app.html");
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  mensagem.className = "mensagem";
  btnEntrar.disabled = true;
  btnEntrar.textContent = "Verificando...";

  const timeout = window.setTimeout(() => {
    destravarBotao();
    mostrarMensagem("A conexão com o Firebase demorou demais. Atualize a página e tente novamente.");
  }, 15000);

  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), senhaInput.value);
    window.location.replace("./index.html");
  } catch (erro) {
    console.error("Falha no login:", erro);
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    window.clearTimeout(timeout);
    destravarBotao();
  }
});

btnRecuperar.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    mostrarMensagem("Digite seu e-mail acima para receber a recuperação de senha.");
    emailInput.focus();
    return;
  }

  btnRecuperar.disabled = true;
  try {
    await sendPasswordResetEmail(auth, email);
    mostrarMensagem("E-mail de recuperação enviado. Verifique também a caixa de spam.", "sucesso");
  } catch (erro) {
    console.error("Falha na recuperação de senha:", erro);
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnRecuperar.disabled = false;
  }
});
