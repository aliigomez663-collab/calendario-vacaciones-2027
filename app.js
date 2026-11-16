import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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

  document.getElementById("btnTest")
    .addEventListener("click", guardarPrueba);

  cargarSolicitudes();

});

async function guardarPrueba(){

  const persona =
    document.getElementById("persona").value;

  const desde =
    document.getElementById("desde").value;

  const hasta =
    document.getElementById("hasta").value;
  const diasSolicitados =
  calcularDiasLaborables(desde, hasta);

  if(!desde || !hasta){

    document.getElementById("resultado").innerHTML =
      "Selecciona las fechas";

    return;

  }

  const snapshot = await getDocs(
  collection(db, "solicitudes")
);

let diasConsumidos = 0;

snapshot.forEach((registro) => {

  const s = registro.data();

  if(
    s.persona === persona &&
    s.estado !== "Rechazada"
  ){

    diasConsumidos +=
      calcularDiasLaborables(
        s.desde,
        s.hasta
      );

  }

});

const diasDisponibles =
  23 - diasConsumidos;

if(diasSolicitados > diasDisponibles){

  document.getElementById("resultado").innerHTML =
    "No dispone de días suficientes";

  return;

}
  await addDoc(
    collection(db, "solicitudes"),
    {
      persona: persona,
      desde: desde,
      hasta: hasta,
      estado: "Pendiente",
      fechaRegistro: new Date().toISOString()
    }
  );

  document.getElementById("resultado").innerHTML =
    "Vacaciones guardadas correctamente";

  await cargarSolicitudes();

}

function calcularDiasLaborables(desde, hasta){

  let inicio = new Date(desde);
  let fin = new Date(hasta);

  let dias = 0;

  while(inicio <= fin){

    const diaSemana = inicio.getDay();

    if(diaSemana !== 0 && diaSemana !== 6){
      dias++;
    }

    inicio.setDate(inicio.getDate() + 1);

  }

  return dias;

}

async function cargarSolicitudes(){

  const snapshot = await getDocs(
    collection(db, "solicitudes")
  );

  let html = "";

  let pendientes = 0;
let aprobadas = 0;
let rechazadas = 0;
  let saldos = {
    "Miembro 1": 23,
    "Miembro 2": 23,
    "Miembro 3": 23,
    "Miembro 4": 23,
    "Miembro 5": 23,
    "Miembro 6": 23,
    "Miembro 7": 23,
    "Miembro 8": 23
  };

  snapshot.forEach((registro) => {

  const s = registro.data();

  if(s.estado === "Pendiente"){
    pendientes++;
  }

  if(s.estado === "Aprobada"){
    aprobadas++;
  }

  if(s.estado === "Rechazada"){
    rechazadas++;
  }

  const dias = calcularDiasLaborables(
    s.desde,
    s.hasta
  );
    const id = registro.id


    if(saldos[s.persona] !== undefined){
      saldos[s.persona] -= dias;
    }

    html +=
      "<div style='margin-bottom:10px;padding:10px;border:1px solid #ddd;border-radius:8px;'>" +
      "<strong>" + s.persona + "</strong><br>" +
     "Desde: " + s.desde + "<br>" +
"Hasta: " + s.hasta + "<br>" +
"Días laborables: " + dias + "<br>" +
      "Estado: <strong style='color:" +

(s.estado === "Aprobada"
 ? "green"
 : s.estado === "Rechazada"
 ? "red"
 : "orange")

+ ";'>" +

s.estado +

"</strong><br><br>" +
"<button onclick='aprobarSolicitud(\"" + id + "\")'>Aprobar</button> " +
"<button onclick='rechazarSolicitud(\"" + id + "\")'>Rechazar</button> " +
"<button onclick='eliminarSolicitud(\"" + id + "\")'>Eliminar</button>" +
"</div>";

  });

  let htmlSaldos = "";

  for(const persona in saldos){

    htmlSaldos +=
      "<div>" +
      persona +
      " → " +
      saldos[persona] +
      " días restantes</div>";

  }
document.getElementById("resumen").innerHTML =
  "Pendientes: " + pendientes +
  "<br>Aprobadas: " + aprobadas +
  "<br>Rechazadas: " + rechazadas;

  document.getElementById("saldos").innerHTML =
    htmlSaldos;

  document.getElementById("listaSolicitudes").innerHTML =
    html || "No hay solicitudes";

}
window.eliminarSolicitud = async function(id){

  await deleteDoc(
    doc(db, "solicitudes", id)
  );

  await cargarSolicitudes();

};
window.aprobarSolicitud = async function(id){

  await updateDoc(
    doc(db, "solicitudes", id),
    {
      estado: "Aprobada"
    }
  );

  await cargarSolicitudes();

};
window.rechazarSolicitud = async function(id){

  await updateDoc(
    doc(db, "solicitudes", id),
    {
      estado: "Rechazada"
    }
  );

  await cargarSolicitudes();

};
