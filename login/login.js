export function crearLogin(onLoginExitoso) {
  const contenedor = document.createElement("div");
  contenedor.className = "login-contenedor";

  const titulo = document.createElement("h2");
  titulo.textContent = "Iniciar sesión o registrarse";

  const usuarioInput = document.createElement("input");
  usuarioInput.placeholder = "Usuario";

  const claveInput = document.createElement("input");
  claveInput.type = "password";
  claveInput.placeholder = "Contraseña";

  const btnLogin = document.createElement("button");
  btnLogin.textContent = "Iniciar sesión";

  const btnRegistro = document.createElement("button");
  btnRegistro.textContent = "Registrarse";

  btnLogin.onclick = () => {
    const usuario = usuarioInput.value;
    const clave = claveInput.value;
    const datos = JSON.parse(localStorage.getItem("usuarios") || "{}");

    if (datos[usuario] && datos[usuario] === clave) {
      onLoginExitoso(usuario);
    } else {
      alert("Usuario o contraseña incorrecta");
    }
  };

  btnRegistro.onclick = () => {
    const usuario = usuarioInput.value;
    const clave = claveInput.value;
    const datos = JSON.parse(localStorage.getItem("usuarios") || "{}");

    if (datos[usuario]) {
      alert("El usuario ya existe");
    } else {
      datos[usuario] = clave;
      localStorage.setItem("usuarios", JSON.stringify(datos));
      alert("Registro exitoso");
    }
  };

  contenedor.appendChild(titulo);
  contenedor.appendChild(usuarioInput);
  contenedor.appendChild(claveInput);
  contenedor.appendChild(btnLogin);
  contenedor.appendChild(btnRegistro);

  return contenedor;
}
