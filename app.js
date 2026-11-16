import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAR75PzOY6H4wTVPTSOMQLDn06Jv9DDa4",
  authDomain: "calendario-vacaciones-2027.firebaseapp.com",
  projectId: "calendario-vacaciones-2027",
  storageBucket: "calendario-vacaciones-2027.firebasestorage.app",
  messagingSenderId: "1062144277486",
  appId: "1:1062144277486:web:4a09a11e0ebbfbb749acff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("resultado").innerHTML =
    "Firestore conectado";

  document.getElementById("btnTest")
    .addEventListener("click", guardarPrueba);

});

async function guardarPrueba(){

  await setDoc(
    doc(db, "vacaciones2027", "equipo"),
    {
      mensaje: "Hola Firebase",
      fecha: new Date().toISOString()
    }
  );

  document.getElementById("resultado").innerHTML =
    "Dato guardado en Firestore";

}
