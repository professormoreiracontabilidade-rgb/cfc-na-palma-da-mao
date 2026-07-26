'use strict';

const firebaseConfig = {
  apiKey: 'AIzaSyA-wspl20od5LstQ8oPHVwddw7_W2mjHn8',
  authDomain: 'cfc-na-palma-da-mao.firebaseapp.com',
  projectId: 'cfc-na-palma-da-mao',
  storageBucket: 'cfc-na-palma-da-mao.firebasestorage.app',
  messagingSenderId: '45671139736',
  appId: '1:45671139736:web:c2d04ce67aa1425ff43ed',
  measurementId: 'G-J9TJBQTZEC'
};

if (typeof firebase === 'undefined') {
  throw new Error('A biblioteca do Firebase não foi carregada.');
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
