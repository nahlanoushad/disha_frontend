import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyANYH0IUumT1B4TXUj3jU0V8qikDAOhD88",
    authDomain: "disha-c42ce.firebaseapp.com",
    projectId: "disha-c42ce",
    storageBucket: "disha-c42ce.firebasestorage.app",
    messagingSenderId: "561651613430",
    appId: "1:561651613430:web:dca2cfa5b80f69fa1436d7",
    measurementId: "G-5N5NZ2PYP9"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);