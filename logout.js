'use strict';

/*
  Firebase removido.
  Caso exista um botão com id="btnSair", ele fica oculto.
*/
document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('btnSair');
  if (!botao) return;

  botao.style.display = 'none';
  botao.setAttribute('aria-hidden', 'true');
});
