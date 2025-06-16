// contenedor/contenedor.js
export function crearEncabezado(usuario) {
  const encabezado = document.createElement("section");
  encabezado.className = "encabezado";

  const info = document.createElement("div");
  info.className = "info";

  const titulo = document.createElement("h2");
  titulo.textContent = usuario ? `Hola, ${usuario}` : "Preguntas";

  const textoProgreso = document.createElement("p");
  textoProgreso.textContent = "Preguntas respondidas: ";

  const progreso = document.createElement("strong");
  progreso.textContent = "0/10";

  textoProgreso.appendChild(progreso);
  info.appendChild(titulo);
  info.appendChild(textoProgreso);

  const estado = document.createElement("div");
  estado.className = "estado";

  const vidas = document.createElement("div");
  vidas.className = "vidas";
  vidas.textContent = "❤️ ❤️ ❤️ ❤️";

  const nivel = document.createElement("div");
  nivel.className = "nivel";
  nivel.textContent = "Nivel 1";

  estado.appendChild(vidas);
  estado.appendChild(nivel);

  encabezado.appendChild(info);
  encabezado.appendChild(estado);

  return encabezado;
}
