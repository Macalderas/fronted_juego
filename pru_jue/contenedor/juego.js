import {preguntas} from "../data/preguntas.js"
export function crearJuego() {
  const juego = document.createElement("section");
  juego.className = "juego";

  const preguntaElem = document.createElement("div");
  preguntaElem.className = "pregunta";

  const resultadoElem = document.createElement("div");
  resultadoElem.className = "resultado";
  resultadoElem.id = "resultado";

  const opcionesElem = document.createElement("div");
  opcionesElem.className = "opciones";

  const temporizadorElem = document.createElement("div");
  temporizadorElem.className = "temporizador";
  temporizadorElem.textContent = `⏳ Tiempo: 30s`;

  let indicePregunta = 0;
  let vidas = 4;
  let respondidas = 0;
  let tiempoRestante = 30;
  let intervaloTiempo;

  const resultadosArray = [];

  const CLAVE_HISTORIAL = "historialPartidas";

  const obtenerHistorial = () => {
    try {
      const raw = localStorage.getItem(CLAVE_HISTORIAL);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error parseando historial de localStorage:", e);
    }
    return [];
  };

  const guardarResultadoLocal = (correctas, incorrectas) => {
    const historial = obtenerHistorial();
    const ahora = new Date();
    const fechaStr = ahora.toLocaleString();
    historial.push({ fecha: fechaStr, correctas, incorrectas });
    try {
      localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    } catch (e) {
      console.error("No se pudo guardar en localStorage:", e);
    }
  };

  const crearElementoHistorial = () => {
    const historial = obtenerHistorial();
    const contHist = document.createElement("div");
    contHist.className = "historial-partidas";

    const titulo = document.createElement("h3");
    titulo.textContent = "Historial de partidas";
    contHist.appendChild(titulo);

    if (historial.length === 0) {
      const aviso = document.createElement("p");
      aviso.textContent = "No hay partidas guardadas aún.";
      contHist.appendChild(aviso);
      return contHist;
    }

    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const filaEnc = document.createElement("tr");
    ["Fecha", "Correctas", "Incorrectas"].forEach(texto => {
      const th = document.createElement("th");
      th.textContent = texto;
      filaEnc.appendChild(th);
    });
    thead.appendChild(filaEnc);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    historial.forEach(item => {
      const fila = document.createElement("tr");

      const tdFecha = document.createElement("td");
      tdFecha.textContent = item.fecha;
      fila.appendChild(tdFecha);

      const tdCor = document.createElement("td");
      tdCor.textContent = String(item.correctas);
      fila.appendChild(tdCor);

      const tdIncor = document.createElement("td");
      tdIncor.textContent = String(item.incorrectas);
      fila.appendChild(tdIncor);

      tbody.appendChild(fila);
    });
    tabla.appendChild(tbody);
    contHist.appendChild(tabla);
    return contHist;
  };

  const actualizarVidas = () => {
    const vidasElem = document.querySelector(".vidas");
    if (vidasElem) {
      vidasElem.textContent = vidas > 0 ? "❤️ ".repeat(vidas).trim() : "";
    }
  };

  const actualizarTemporizador = () => {
    temporizadorElem.textContent = `⏳ Tiempo: ${tiempoRestante}s`;
    if (tiempoRestante <= 10) {
      temporizadorElem.style.color = "red";
    } else {
      temporizadorElem.style.color = "#444";
    }
  };

  const iniciarTemporizador = () => {
    tiempoRestante = 30;
    actualizarTemporizador();

    intervaloTiempo = setInterval(() => {
      tiempoRestante--;
      actualizarTemporizador();

      if (tiempoRestante <= 0) {
        clearInterval(intervaloTiempo);
        verificarRespuesta(null, preguntas[indicePregunta].respuestaCorrecta, true);
      }
    }, 1000);
  };

  const verificarRespuesta = (seleccionada, correctaTexto, esTiempoAgotado = false) => {
    clearInterval(intervaloTiempo);

    respondidas++;
    const progresoElem = document.querySelector(".info strong");
    if (progresoElem) {
      progresoElem.textContent = `${respondidas}/${preguntas.length}`;
    }

    opcionesElem.querySelectorAll("button.opcion").forEach(b => b.disabled = true);

    const esCorrecta = seleccionada === correctaTexto;
    resultadosArray.push({
      pregunta: preguntas[indicePregunta].pregunta,
      seleccionada: seleccionada || "⏰ Tiempo agotado",
      correcta: esCorrecta
    });

    if (esCorrecta) {
      resultadoElem.textContent = "✅ ¡Correcto!";
      resultadoElem.style.color = "green";
    } else {
      resultadoElem.textContent = esTiempoAgotado ? "⏰ Tiempo agotado" : "❌ Incorrecto";
      resultadoElem.style.color = "red";
      vidas--;
      actualizarVidas();
    }

    setTimeout(() => {
      resultadoElem.textContent = "";
      indicePregunta++;
      if (indicePregunta < preguntas.length && vidas > 0) {
        mostrarPregunta();
      } else {
        terminarJuego();
      }
    }, 1000);
  };

  const mostrarPregunta = () => {
    const actual = preguntas[indicePregunta];
    preguntaElem.textContent = actual.pregunta;
    opcionesElem.innerHTML = "";

    actual.opciones.forEach(opcionTexto => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = opcionTexto;
      boton.disabled = false;
      boton.addEventListener("click", () => verificarRespuesta(opcionTexto, actual.respuestaCorrecta));
      opcionesElem.appendChild(boton);
    });

    iniciarTemporizador();
  };

  const terminarJuego = () => {
    clearInterval(intervaloTiempo);

    if (vidas > 1) {
      preguntaElem.textContent = "🎉 ¡Juego completado!";
    } else {
      preguntaElem.textContent = "💀 Juego perdido";
    }
    opcionesElem.innerHTML = "";

    const seccionResultados = document.getElementById("tabla-resultados");
    if (seccionResultados) {
      seccionResultados.classList.remove("tabla-oculta");

      const cuerpoTabla = seccionResultados.querySelector("#cuerpo-tabla");
      if (cuerpoTabla) cuerpoTabla.innerHTML = "";

      const correctas = resultadosArray.filter(r => r.correcta).length;
      const incorrectas = resultadosArray.filter(r => !r.correcta).length;

      guardarResultadoLocal(correctas, incorrectas);

      let resumenPrevio = seccionResultados.querySelector(".resumen-juego");
      if (resumenPrevio) resumenPrevio.remove();

      const resumenElem = document.createElement("p");
      resumenElem.className = "resumen-juego";
      resumenElem.textContent = `Respuestas correctas: ${correctas}. Respuestas incorrectas: ${incorrectas}.`;

      const tituloH3 = seccionResultados.querySelector("h3");
      if (tituloH3) {
        seccionResultados.insertBefore(resumenElem, tituloH3.nextSibling);
      } else {
        seccionResultados.prepend(resumenElem);
      }

      resultadosArray.forEach((res, index) => {
        const fila = document.createElement("tr");

        const tdIndex = document.createElement("td");
        tdIndex.textContent = String(index + 1);
        fila.appendChild(tdIndex);

        const tdPregunta = document.createElement("td");
        tdPregunta.textContent = res.pregunta;
        fila.appendChild(tdPregunta);

        const tdSeleccion = document.createElement("td");
        tdSeleccion.textContent = res.seleccionada;
        fila.appendChild(tdSeleccion);

        const tdResultado = document.createElement("td");
        tdResultado.textContent = res.correcta ? "Correcto" : "Incorrecto";
        tdResultado.style.color = res.correcta ? "green" : "red";
        fila.appendChild(tdResultado);

        cuerpoTabla.appendChild(fila);
      });

      const existenteHist = seccionResultados.querySelector(".historial-partidas");
      if (existenteHist) existenteHist.remove();
      const elementoHistorial = crearElementoHistorial();
      seccionResultados.appendChild(elementoHistorial);
    }
  };

  juego.appendChild(temporizadorElem);
  juego.appendChild(preguntaElem);
  juego.appendChild(resultadoElem);
  juego.appendChild(opcionesElem);

  actualizarVidas();
  mostrarPregunta();

  return juego;
}
