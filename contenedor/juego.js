import { preguntasPorNivel } from "../data/preguntas.js";

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
  let vidas = 5;
  let respondidas = 0;
  let tiempoRestante = 30;
  let intervaloTiempo;
  let nivelActual = 1;

  const resultadosArray = [];

 const guardarResultadoBackend = async (correctas, incorrectas) => {
  try {
    await fetch("http://localhost:3000/api/resultados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: "Jugador1", // puedes cambiar esto por el nombre real del usuario
        correctas,
        incorrectas,
      }),
    });
  } catch (e) {
    console.error("Error al guardar en backend:", e);
  }
};

const crearElementoHistorial = async () => {
  const contHist = document.createElement("div");
  contHist.className = "historial-partidas";

  const titulo = document.createElement("h3");
  titulo.textContent = "Historial de partidas";
  contHist.appendChild(titulo);

  try {
    const resp = await fetch("http://localhost:3000/api/resultados");
    const historial = await resp.json();

    if (!historial || historial.length === 0) {
      const aviso = document.createElement("p");
      aviso.textContent = "No hay partidas guardadas aún.";
      contHist.appendChild(aviso);
      return contHist;
    }

    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const filaEnc = document.createElement("tr");
    ["Fecha", "Usuario", "Correctas", "Incorrectas"].forEach(texto => {
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
      tdFecha.textContent = new Date(item.fecha).toLocaleString();
      fila.appendChild(tdFecha);

      const tdUsuario = document.createElement("td");
      tdUsuario.textContent = item.usuario;
      fila.appendChild(tdUsuario);

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
  } catch (e) {
    const error = document.createElement("p");
    error.textContent = "Error al obtener el historial desde el servidor.";
    contHist.appendChild(error);
    console.error(e);
  }

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
    temporizadorElem.style.color = tiempoRestante <= 10 ? "red" : "#444";
  };

  const iniciarTemporizador = () => {
    tiempoRestante = 30;
    actualizarTemporizador();

    intervaloTiempo = setInterval(() => {
      tiempoRestante--;
      actualizarTemporizador();

      if (tiempoRestante <= 0) {
        clearInterval(intervaloTiempo);
        verificarRespuesta(null, preguntasPorNivel[indicePregunta].respuestaCorrecta, true);
      }
    }, 1000);
  };

  const verificarRespuesta = (seleccionada, correctaTexto, esTiempoAgotado = false) => {
    clearInterval(intervaloTiempo);
    respondidas++;

    const progresoElem = document.querySelector(".info strong");
    if (progresoElem) progresoElem.textContent = `${respondidas}/50`;

    opcionesElem.querySelectorAll("button.opcion").forEach(b => b.disabled = true);

    const actual = preguntasPorNivel[Math.floor(indicePregunta / 5)][indicePregunta % 5];
    const esCorrecta = seleccionada === correctaTexto;

    resultadosArray.push({
      pregunta: actual.pregunta,
      seleccionada: seleccionada || "⏰ Tiempo agotado",
      correcta: esCorrecta
    });

    resultadoElem.textContent = esCorrecta ? "✅ ¡Correcto!" : (esTiempoAgotado ? "⏰ Tiempo agotado" : "❌ Incorrecto");
    resultadoElem.style.color = esCorrecta ? "green" : "red";

    if (!esCorrecta) {
      vidas--;
      actualizarVidas();
    }

    setTimeout(() => {
      resultadoElem.textContent = "";
      indicePregunta++;
      if (indicePregunta < preguntasPorNivel.flat().length && vidas > 0) {
        mostrarPregunta();
      } else {
        terminarJuego();
      }
    }, 1000);
  };

  const mostrarPregunta = () => {
    const nivelIndex = Math.floor(indicePregunta / 5);
    const preguntaIndex = indicePregunta % 5;

    if (nivelIndex >= preguntasPorNivel.length || preguntaIndex >= preguntasPorNivel[nivelIndex].length) {
      terminarJuego();
      return;
    }

    const actual = preguntasPorNivel[nivelIndex][preguntaIndex];
    preguntaElem.textContent = actual.pregunta;
    opcionesElem.innerHTML = "";

    nivelActual = nivelIndex + 1;
    const nivelElem = document.querySelector(".nivel");
    if (nivelElem) nivelElem.textContent = `Nivel ${nivelActual}`;

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

  const terminarJuego = async () => {
    clearInterval(intervaloTiempo);

    preguntaElem.textContent = vidas > 0 ? "🎉 ¡Juego completado!" : "💀 Juego perdido";
    opcionesElem.innerHTML = "";

    const seccionResultados = document.getElementById("tabla-resultados");
    if (seccionResultados) {
      seccionResultados.classList.remove("tabla-oculta");

      const cuerpoTabla = seccionResultados.querySelector("#cuerpo-tabla");
      if (cuerpoTabla) cuerpoTabla.innerHTML = "";

      const correctas = resultadosArray.filter(r => r.correcta).length;
      const incorrectas = resultadosArray.filter(r => !r.correcta).length;

      await guardarResultadoBackend(correctas, incorrectas);

      let resumenPrevio = seccionResultados.querySelector(".resumen-juego");
      if (resumenPrevio) resumenPrevio.remove();

      const resumenElem = document.createElement("p");
      resumenElem.className = "resumen-juego";
      resumenElem.textContent = `Respuestas correctas: ${correctas}. Respuestas incorrectas: ${incorrectas}.`;

      const tituloH3 = seccionResultados.querySelector("h3");
      if (tituloH3) seccionResultados.insertBefore(resumenElem, tituloH3.nextSibling);
      else seccionResultados.prepend(resumenElem);

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
      const elementoHistorial = await crearElementoHistorial();
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
