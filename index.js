import { crearLogin } from "./login/login.js";
import { crearEncabezado } from "./contenedor/contenedor.js";
import { crearJuego } from "./contenedor/juego.js";
import { crearTablaResultados } from "./contenedor/resultado.js";

function cargarJuego(usuario) {
  document.getElementById("login-root").style.display = "none";
  const root = document.getElementById("root");
  root.style.display = "block";
  root.innerHTML = ""; // 👈 Limpia antes de agregar el nuevo contenido

  const encabezadoElem = crearEncabezado(usuario); // ✅ Aquí recibes el nombre
  const juegoElem = crearJuego(); // ✅ Aquí inicias el juego
  const resultadosElem = crearTablaResultados(); // ✅ Tabla al final

  const main = document.createElement("main");
  main.className = "contenedor";
  main.appendChild(encabezadoElem);
  main.appendChild(juegoElem);
  main.appendChild(resultadosElem);

  root.appendChild(main);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-root").appendChild(crearLogin(cargarJuego));
});
