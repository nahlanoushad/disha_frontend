importScripts(
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyANYH0IUumT1B4TXUj3jU0V8qikDAOhD88",
    authDomain: "disha-c42ce.firebaseapp.com",
    projectId: "disha-c42ce",
    storageBucket: "disha-c42ce.firebasestorage.app",
    messagingSenderId: "561651613430",
    appId: "1:561651613430:web:dca2cfa5b80f69fa1436d7",
    measurementId: "G-5N5NZ2PYP9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'New DISHA Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/vite.svg', // Assuming vite.svg exists in public/
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});