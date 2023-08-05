import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyAiHSdCF1Yx2tEvcTY0YQNn8abFfSyXjQw",
    authDomain: "whatsapp-52da8.firebaseapp.com",
    projectId: "whatsapp-52da8",
    storageBucket: "whatsapp-52da8.appspot.com",
    messagingSenderId: "961940861669",
    appId: "1:961940861669:web:66fb7312fd098dd6819a0c"
};
  
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app)