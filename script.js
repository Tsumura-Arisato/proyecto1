/* =========================================================
   script.js - Script principal del proyecto
   Aplica a: index.html, tags.html, profile.html y formulario.html
   ========================================================= */

/* ---------------------------------------------------------
   1) LOGIN (index.html)
   Credenciales de ejemplo (tema Kamen Rider OOO):
     Las credenciales se validan contra la REST-API (POST /login).
     Primero hay que registrarse en formulario.html.
   --------------------------------------------------------- */

async function validarLogin(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const contrasena = document.getElementById("password").value;

    // Validación básica de campos vacíos
    if (usuario === "" || contrasena === "") {
        mostrarMensajeLogin("Por favor completa ambos campos.", false);
        return;
    }

    try {
        // POST /login en la REST-API
        const respuesta = await api.login(usuario, contrasena);
        sesion.guardar(respuesta.user);
        mostrarMensajeLogin("¡Bienvenido, " + respuesta.user.username + "! Redirigiendo...", true);
        setTimeout(function () {
            window.location.href = "profile.html";
        }, 1200);
    } catch (error) {
        mostrarMensajeLogin(error.message, false);
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

async function enviarFormulario(evento) {
    evento.preventDefault();
    const resultado = document.getElementById("formulario-resultado");

    const tipo = document.querySelector('input[name="tipo-cuenta"]:checked');
    const selectPais = document.getElementById("select-pais");
    const selectRegion = document.getElementById("select-region");

    const datos = {
        username: document.getElementById("reg-username").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        password: document.getElementById("reg-password").value,
        tipo_cuenta: tipo ? tipo.value : "free",
        pais: selectPais.value ? selectPais.options[selectPais.selectedIndex].textContent : null,
        region: selectRegion.value ? selectRegion.options[selectRegion.selectedIndex].textContent : null
    };

    resultado.style.display = "block";
    if (!datos.username || !datos.email || !datos.password) {
        resultado.textContent = "Usuario, correo y contraseña son obligatorios.";
        return;
    }

    try {
        // POST /users en la REST-API
        await api.crearUsuario(datos);
        resultado.textContent = "¡Registro exitoso! Redirigiendo al login...";
        setTimeout(function () { window.location.href = "index.html"; }, 1500);
    } catch (error) {
        resultado.textContent = error.message;
    }
}

/* ---------------------------------------------------------
   4.4) PERFIL (profile.html): datos del usuario desde la API
   --------------------------------------------------------- */
async function cargarPerfil() {
    const contenedor = document.getElementById("perfil-datos");
    if (!contenedor) return;

    const actual = sesion.obtener();
    if (!actual) {
        contenedor.innerHTML = '<p class="highlight">No has iniciado sesión. <a href="index.html">Ir al login</a></p>';
        return;
    }
    try {
        // GET /users/:id
        const u = await api.obtenerUsuario(actual.id);
        document.getElementById("perfil-nombre").textContent = u.username;
        document.getElementById("perfil-correo").textContent = u.email;
        document.getElementById("perfil-cuenta").textContent = u.tipo_cuenta || "free";
        document.getElementById("perfil-ubicacion").textContent =
            [u.region, u.pais].filter(Boolean).join(", ") || "No especificada";
        document.getElementById("perfil-fecha").textContent =
            new Date(u.created_at).toLocaleDateString("es-ES");
    } catch (error) {
        sesion.cerrar();
        contenedor.innerHTML = '<p class="highlight">' + error.message + ' <a href="index.html">Ir al login</a></p>';
    }
}

function cerrarSesion() {
    sesion.cerrar();
    window.location.href = "index.html";
}

/* ---------------------------------------------------------
   4.5) PRODUCTOS (productos.html): CRUD contra la API
   --------------------------------------------------------- */
function mostrarMensajeProducto(texto, esExito) {
    const m = document.getElementById("producto-mensaje");
    if (!m) return;
    m.textContent = texto;
    m.style.display = "block";
    m.style.color = esExito ? "#16a085" : "#c0392b";
}

function escapar(texto) {
    const d = document.createElement("div");
    d.textContent = texto == null ? "" : texto;
    return d.innerHTML;
}

async function cargarProductos() {
    const cuerpo = document.getElementById("tabla-productos");
    if (!cuerpo) return;
    try {
        const productos = await api.listarProductos();
        cuerpo.innerHTML = "";
        if (productos.length === 0) {
            cuerpo.innerHTML = '<tr><td colspan="5" class="text-center">No hay productos.</td></tr>';
            return;
        }
        productos.forEach(function (p) {
            const fila = document.createElement("tr");
            fila.innerHTML =
                "<td>" + escapar(p.name) + "</td>" +
                "<td>" + escapar(p.description) + "</td>" +
                "<td>" + p.quantity + "</td>" +
                "<td>$" + Number(p.price).toFixed(2) + "</td>" +
                '<td><button class="btn btn-sm btn-outline-primary me-1 btn-editar">Editar</button>' +
                '<button class="btn btn-sm btn-outline-danger btn-borrar">Eliminar</button></td>';
            fila.querySelector(".btn-editar").addEventListener("click", function () { editarProducto(p); });
            fila.querySelector(".btn-borrar").addEventListener("click", function () { borrarProducto(p.id); });
            cuerpo.appendChild(fila);
        });
    } catch (error) {
        mostrarMensajeProducto(error.message, false);
    }
}

function editarProducto(p) {
    document.getElementById("producto-id").value = p.id;
    document.getElementById("producto-nombre").value = p.name;
    document.getElementById("producto-descripcion").value = p.description || "";
    document.getElementById("producto-cantidad").value = p.quantity;
    document.getElementById("producto-precio").value = p.price;
    document.getElementById("btn-guardar-producto").textContent = "Actualizar producto";
    document.getElementById("btn-cancelar-edicion").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormularioProducto() {
    document.getElementById("form-producto").reset();
    document.getElementById("producto-id").value = "";
    document.getElementById("btn-guardar-producto").textContent = "Agregar producto";
    document.getElementById("btn-cancelar-edicion").style.display = "none";
}

async function guardarProducto(evento) {
    evento.preventDefault();
    const id = document.getElementById("producto-id").value;
    const producto = {
        name: document.getElementById("producto-nombre").value.trim(),
        description: document.getElementById("producto-descripcion").value.trim(),
        quantity: parseInt(document.getElementById("producto-cantidad").value, 10) || 0,
        price: parseFloat(document.getElementById("producto-precio").value)
    };
    if (!producto.name || isNaN(producto.price)) {
        mostrarMensajeProducto("Nombre y precio son obligatorios.", false);
        return;
    }
    try {
        if (id) {
            await api.actualizarProducto(id, producto);   // PUT /products/:id
            mostrarMensajeProducto("Producto actualizado.", true);
        } else {
            await api.crearProducto(producto);            // POST /products
            mostrarMensajeProducto("Producto agregado.", true);
        }
        limpiarFormularioProducto();
        cargarProductos();
    } catch (error) {
        mostrarMensajeProducto(error.message, false);
    }
}

async function borrarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
        await api.eliminarProducto(id);                   // DELETE /products/:id
        mostrarMensajeProducto("Producto eliminado.", true);
        cargarProductos();
    } catch (error) {
        mostrarMensajeProducto(error.message, false);
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

    // profile.html - datos desde la API
    cargarPerfil();
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) btnLogout.addEventListener("click", cerrarSesion);

    // productos.html - CRUD
    const formProducto = document.getElementById("form-producto");
    if (formProducto) {
        formProducto.addEventListener("submit", guardarProducto);
        document.getElementById("btn-cancelar-edicion").addEventListener("click", limpiarFormularioProducto);
        cargarProductos();
    }

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
