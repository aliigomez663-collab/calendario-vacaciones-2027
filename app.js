import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAR75PzOY6H4wTVPTSOMQLDn06Jv9DDa4",
  authDomain: "calendario-vacaciones-2027.firebaseapp.com",
  projectId: "calendario-vacaciones-2027",
  storageBucket: "calendario-vacaciones-2027.firebasestorage.app",
  messagingSenderId: "1062144277486",
  appId: "1:1062144277486:web:4a09a11e0ebbfbb749acff"
};

initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("resultado").innerHTML =
      "✅ Firebase inicializado";

});