'use strict';

(async () => {
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
      'auth/invalid-api-key': 'A chave Web do Firebase foi recusada. Gere uma nova chave no Firebase/Google Cloud e atualize firebase-config.js.',
      'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'A chave Web do Firebase foi recusada. Gere uma nova chave no Firebase/Google Cloud e atualize firebase-config.js.',
      'auth/invalid-email': 'Digite um endereço de e-mail válido.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/wrong-password': 'E-mail ou senha incorretos.',
      'auth/user-not-found': 'E-mail ou senha incorretos.',
      'auth/user-disabled': 'Este acesso está bloqueado. Entre em contato com o Professor Moreira.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
      'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
      'auth/operation-not-allowed': 'Ative o método E-mail/Senha no Firebase Authentication.'
    };
    return erros[codigo] || `Não foi possível entrar. Código: ${codigo || 'desconhecido'}.`;
  }

  try {
    const [{ initializeApp }, authModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js')
    ]);

    const {
      getAuth,
      setPersistence,
      browserLocalPersistence,
      onAuthStateChanged,
      signInWithEmailAndPassword,
      sendPasswordResetEmail
    } = authModule;

    const app = initializeApp(window.CFC_FIREBASE_CONFIG);
    const auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, (user) => {
      if (user) window.location.replace('./index.html');
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      limparMensagem();
      const email = emailInput.value.trim();
      const senha = senhaInput.value;
      if (!email || !senha) {
        mostrarMensagem('Digite o e-mail e a senha.');
        return;
      }
      btnEntrar.disabled = true;
      btnEntrar.textContent = 'Verificando...';
      try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.replace('./index.html');
      } catch (erro) {
        console.error('Erro no login:', erro);
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
        await sendPasswordResetEmail(auth, email);
        mostrarMensagem('E-mail de recuperação enviado. Verifique também a caixa de spam.', 'sucesso');
      } catch (erro) {
        console.error('Erro na recuperação:', erro);
        mostrarMensagem(traduzirErro(erro.code));
      } finally {
        btnRecuperar.disabled = false;
        btnRecuperar.textContent = 'Esqueci minha senha';
      }
    });
  } catch (erro) {
    console.error('Falha ao carregar o Firebase:', erro);
    mostrarMensagem('Não foi possível carregar o Firebase. Verifique a conexão e atualize a página.');
    btnEntrar.disabled = true;
    btnRecuperar.disabled = true;
  }
})();
