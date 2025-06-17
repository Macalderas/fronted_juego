// contenedor/contenedor.js

export function crearEncabezado(usuario = "", nivel = 1, totalPreguntas = 10) {
  const encabezado = document.createElement("section");
  encabezado.className = "encabezado";

  const info = document.createElement("div");
  info.className = "info";

  const titulo = document.createElement("h2");
  titulo.textContent = usuario ? `Hola, ${usuario}` : "Preguntas";

  const textoProgreso = document.createElement("p");
  textoProgreso.textContent = "Preguntas respondidas: ";

  const progreso = document.createElement("strong");
  progreso.textContent = `0/${totalPreguntas}`;
  progreso.className = "progreso";

  textoProgreso.appendChild(progreso);
  info.appendChild(titulo);
  info.appendChild(textoProgreso);

  const estado = document.createElement("div");
  estado.className = "estado";

  const vidas = document.createElement("div");
  vidas.className = "vidas";
  vidas.textContent = "❤️ ❤️ ❤️ ❤️ ❤️";

  const nivelElem = document.createElement("div");
  nivelElem.className = "nivel";
  nivelElem.textContent = `Nivel ${nivel}`;

  estado.appendChild(vidas);
  estado.appendChild(nivelElem);

  encabezado.appendChild(info);
  encabezado.appendChild(estado);

  return encabezado;
}
