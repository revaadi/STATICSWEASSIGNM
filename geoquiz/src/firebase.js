import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCQYeBNMeGYFnlnk6oaq_sxhlVHCD6KkQs",
    authDomain: "geoquiz-416cc.firebaseapp.com",
    projectId: "geoquiz-416cc",
    storageBucket: "geoquiz-416cc.appspot.com",
    messagingSenderId: "293399053542",
    appId: "1:293399053542:web:241f74007f81b31a4aa727",
    measurementId: "G-HZD1BXC01G"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };