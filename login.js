'use strict';

(async () => {
  const form = document.getElementById('formLogin');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const btnEntrar = document.getElementById('btnEntrar');
  const btnRecuperar = document.getElementById('btnRecuperar');
  const mensagem = document.getElementById('mensagem');

  const mostrarMensagem = (texto, tipo = 'erro') => {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  };

  const limparMensagem = () => {
    mensagem.textContent = '';
    mensagem.className = 'mensagem';
  };

  const traduzirErro = (codigo) => {
    const mensagens = {
      'auth/invalid-email': 'Digite um endereço de e-mail válido.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/wrong-password': 'E-mail ou senha incorretos.',
      'auth/user-not-found': 'E-mail ou senha incorretos.',
      'auth/user-disabled': 'Este acesso está bloqueado. Entre em contato com o Professor Moreira.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
      'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
      'auth/operation-not-allowed': 'Ative o método E-mail/Senha no Firebase Authentication.',
      'auth/invalid-api-key': 'A chave do Firebase não foi aceita.',
      'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'A chave do Firebase não foi aceita.'
    };
    return mensagens[codigo] || `Não foi possível entrar. Código: ${codigo || 'desconhecido'}.`;
  };

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
    await authModule.setPersistence(auth, authModule.browserLocalPersistence);

    let primeiraVerificacao = true;
    authModule.onAuthStateChanged(auth, (user) => {
      if (primeiraVerificacao) {
        primeiraVerificacao = false;
        if (user) {
          window.location.replace('./index.html');
        }
      }
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
        await authModule.signInWithEmailAndPassword(auth, email, senha);
        window.location.replace('./index.html');
      } catch (erro) {
        console.error('Erro no login:', erro);
        mostrarMensagem(traduzirErro(erro.code));
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
        await authModule.sendPasswordResetEmail(auth, email);
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
    console.error('Falha ao iniciar o Firebase:', erro);
    mostrarMensagem(`Falha ao iniciar o Firebase: ${erro.message || erro}`);
    btnEntrar.disabled = true;
    btnRecuperar.disabled = true;
  }
})();
