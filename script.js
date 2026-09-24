/* =========================================================
   script.js - Script principal del proyecto
   Aplica a: index.html, tags.html, profile.html y formulario.html
   ========================================================= */

/* ---------------------------------------------------------
   1) LOGIN (index.html)
   Credenciales de ejemplo (tema Kamen Rider OOO):
     Usuario: eiji
     Contraseña: ooo
   --------------------------------------------------------- */

// "Base de datos" simple de usuarios válidos
const usuariosValidos = [
    { usuario: "eiji", contrasena: "ooo" },
    { usuario: "ankh", contrasena: "greeed" }
];

function validarLogin(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    const usuarioInput = document.getElementById("username");
    const contrasenaInput = document.getElementById("password");
    const mensaje = document.getElementById("login-message");

    const usuario = usuarioInput.value.trim().toLowerCase();
    const contrasena = contrasenaInput.value.trim().toLowerCase();

    // Validación básica de campos vacíos
    if (usuario === "" || contrasena === "") {
        mostrarMensajeLogin("Por favor completa ambos campos.", false);
        return;
    }

    // Buscamos si existe un usuario que coincida (uso de array + método .some/.find)
    const usuarioEncontrado = usuariosValidos.find(function (u) {
        return u.usuario === usuario && u.contrasena === contrasena;
    });

    if (usuarioEncontrado) {
        mostrarMensajeLogin("¡Bienvenido, " + usuario + "! Redirigiendo...", true);
        // Pequeño retraso antes de redirigir para que se alcance a leer el mensaje
        setTimeout(function () {
            window.location.href = "profile.html";
        }, 1200);
    } else {
        mostrarMensajeLogin("Usuario o contraseña incorrectos.", false);
    }
}

function mostrarMensajeLogin(texto, esExito) {
    const mensaje = document.getElementById("login-message");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.style.display = "block";
    mensaje.style.color = esExito ? "#16a085" : "#c0392b";
}

/* ---------------------------------------------------------
   2) BOTONES DE DEMOSTRACIÓN (tags.html)
   --------------------------------------------------------- */

// Contador simple (variable + operador ++)
let contador = 0;
function incrementarContador() {
    contador++;
    const salida = document.getElementById("contador-salida");
    if (salida) {
        salida.textContent = "Contador: " + contador;
    }
}

// Fecha y hora actual (objeto Date)
function mostrarFechaHora() {
    const salida = document.getElementById("fecha-salida");
    if (!salida) return;

    const ahora = new Date();
    const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    salida.textContent = ahora.toLocaleDateString("es-ES", opciones);
}

// Elegir un Kamen Rider aleatorio de un array (Math.random + arrays)
const kamenRiders = [
    "Kamen Rider OOO",
    "Kamen Rider Build",
    "Kamen Rider Zero-One",
    "Kamen Rider W",
    "Kamen Rider Drive",
    "Kamen Rider Geats"
];

function elegirRiderAleatorio() {
    const salida = document.getElementById("rider-salida");
    if (!salida) return;

    const indiceAleatorio = Math.floor(Math.random() * kamenRiders.length);
    salida.textContent = "Rider elegido: " + kamenRiders[indiceAleatorio];
}

// Cambiar el color de fondo del cuerpo (manipulación de estilos)
const coloresFondo = ["#f4f6f8", "#dff5e1", "#fef3cd", "#fde2e2", "#e2e8fd"];
let colorIndice = 0;
function cambiarColorFondo() {
    colorIndice = (colorIndice + 1) % coloresFondo.length;
    document.body.style.backgroundColor = coloresFondo[colorIndice];
}

/* ---------------------------------------------------------
   3) MOSTRAR/OCULTAR SECCIÓN (profile.html)
   --------------------------------------------------------- */
function toggleSobreMi() {
    const seccion = document.getElementById("sobre-mi-extra");
    const boton = document.getElementById("btn-toggle-sobre-mi");
    if (!seccion || !boton) return;

    const oculto = seccion.style.display === "none" || seccion.style.display === "";
    seccion.style.display = oculto ? "block" : "none";
    boton.textContent = oculto ? "Ocultar información extra" : "Mostrar información extra";
}

/* ---------------------------------------------------------
   4) FORMULARIO (formulario.html)
   --------------------------------------------------------- */

// 4.1 Radio buttons: al elegir una opción se muestra contenido oculto
function manejarSeleccionRadio() {
    const radios = document.getElementsByName("tipo-cuenta");
    const contenidoFree = document.getElementById("contenido-free");
    const contenidoPremium = document.getElementById("contenido-premium");
    const botonContinuar = document.getElementById("btn-continuar");

    let seleccionado = null;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            seleccionado = radios[i].value;
            break;
        }
    }

    if (contenidoFree) contenidoFree.style.display = seleccionado === "free" ? "block" : "none";
    if (contenidoPremium) contenidoPremium.style.display = seleccionado === "premium" ? "block" : "none";
    if (botonContinuar) botonContinuar.disabled = seleccionado === null;
}

// 4.2 Dropdowns dependientes de país / región usando countryRegionData (ver country-region-data.js)
function poblarPaises() {
    const selectPais = document.getElementById("select-pais");
    if (!selectPais || typeof countryRegionData === "undefined") return;

    // Opción por defecto
    const opcionDefecto = document.createElement("option");
    opcionDefecto.value = "";
    opcionDefecto.textContent = "-- Selecciona un país --";
    selectPais.appendChild(opcionDefecto);

    countryRegionData.forEach(function (pais) {
        const opcion = document.createElement("option");
        opcion.value = pais.countryShortCode;
        opcion.textContent = pais.countryName;
        selectPais.appendChild(opcion);
    });
}

function actualizarRegiones() {
    const selectPais = document.getElementById("select-pais");
    const selectRegion = document.getElementById("select-region");
    if (!selectPais || !selectRegion) return;

    // Limpiamos las opciones actuales del select de regiones
    selectRegion.innerHTML = "";

    const codigoPais = selectPais.value;
    const paisEncontrado = countryRegionData.find(function (p) {
        return p.countryShortCode === codigoPais;
    });

    if (!paisEncontrado || !paisEncontrado.regions || paisEncontrado.regions.length === 0) {
        const opcionVacia = document.createElement("option");
        opcionVacia.value = "";
        opcionVacia.textContent = "-- Sin regiones disponibles --";
        selectRegion.appendChild(opcionVacia);
        return;
    }

    const opcionDefecto = document.createElement("option");
    opcionDefecto.value = "";
    opcionDefecto.textContent = "-- Selecciona una región --";
    selectRegion.appendChild(opcionDefecto);

    paisEncontrado.regions.forEach(function (region) {
        const opcion = document.createElement("option");
        opcion.value = region.shortCode;
        opcion.textContent = region.name;
        selectRegion.appendChild(opcion);
    });
}

// 4.3 Dos checkboxes que activan un botón
function verificarCheckboxes() {
    const check1 = document.getElementById("check-terminos");
    const check2 = document.getElementById("check-mayor-edad");
    const boton = document.getElementById("btn-enviar-formulario");
    if (!check1 || !check2 || !boton) return;

    boton.disabled = !(check1.checked && check2.checked);
}

function enviarFormulario(evento) {
    evento.preventDefault();
    const resultado = document.getElementById("formulario-resultado");
    if (resultado) {
        resultado.textContent = "¡Formulario enviado correctamente!";
        resultado.style.display = "block";
    }
}

/* ---------------------------------------------------------
   5) INICIALIZACIÓN: conecta cada función con su elemento
      SOLO si ese elemento existe en la página actual
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {

    // index.html - login
    const formLogin = document.getElementById("loginForm");
    if (formLogin) {
        formLogin.addEventListener("submit", validarLogin);
    }

    // tags.html - botones de demostración
    const btnContador = document.getElementById("btn-contador");
    if (btnContador) btnContador.addEventListener("click", incrementarContador);

    const btnFecha = document.getElementById("btn-fecha");
    if (btnFecha) btnFecha.addEventListener("click", mostrarFechaHora);

    const btnRider = document.getElementById("btn-rider");
    if (btnRider) btnRider.addEventListener("click", elegirRiderAleatorio);

    const btnColor = document.getElementById("btn-color");
    if (btnColor) btnColor.addEventListener("click", cambiarColorFondo);

    // profile.html - mostrar/ocultar
    const btnToggleSobreMi = document.getElementById("btn-toggle-sobre-mi");
    if (btnToggleSobreMi) btnToggleSobreMi.addEventListener("click", toggleSobreMi);

    // formulario.html
    const radiosTipoCuenta = document.getElementsByName("tipo-cuenta");
    if (radiosTipoCuenta.length > 0) {
        radiosTipoCuenta.forEach(function (radio) {
            radio.addEventListener("change", manejarSeleccionRadio);
        });
    }

    const selectPais = document.getElementById("select-pais");
    if (selectPais) {
        poblarPaises();
        selectPais.addEventListener("change", actualizarRegiones);
    }

    const check1 = document.getElementById("check-terminos");
    const check2 = document.getElementById("check-mayor-edad");
    if (check1 && check2) {
        check1.addEventListener("change", verificarCheckboxes);
        check2.addEventListener("change", verificarCheckboxes);
    }

    const formularioRegistro = document.getElementById("formulario-registro");
    if (formularioRegistro) {
        formularioRegistro.addEventListener("submit", enviarFormulario);
    }
});
