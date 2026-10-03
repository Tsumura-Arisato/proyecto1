/* =========================================================
   api.js - Cliente de la REST-API (backend Node + Express)
   Cambia API_URL si el backend corre en otro host/puerto.
   ========================================================= */
const API_URL = "http://localhost:3000";

// Petición genérica: devuelve el JSON o lanza Error con el mensaje del servidor
async function apiFetch(ruta, opciones = {}) {
    let respuesta;
    try {
        respuesta = await fetch(API_URL + ruta, {
            headers: { "Content-Type": "application/json" },
            ...opciones
        });
    } catch (e) {
        throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
    }
    let datos = null;
    try { datos = await respuesta.json(); } catch (e) { /* respuesta sin cuerpo */ }
    if (!respuesta.ok) {
        throw new Error((datos && datos.message) || "Error " + respuesta.status);
    }
    return datos;
}

const api = {
    login: (username, password) =>
        apiFetch("/login", { method: "POST", body: JSON.stringify({ username, password }) }),

    // Usuarios
    crearUsuario: (u) => apiFetch("/users", { method: "POST", body: JSON.stringify(u) }),
    obtenerUsuario: (id) => apiFetch("/users/" + id),

    // Productos
    listarProductos: () => apiFetch("/products"),
    crearProducto: (p) => apiFetch("/products", { method: "POST", body: JSON.stringify(p) }),
    actualizarProducto: (id, p) => apiFetch("/products/" + id, { method: "PUT", body: JSON.stringify(p) }),
    eliminarProducto: (id) => apiFetch("/products/" + id, { method: "DELETE" })
};

// Sesión simple guardada en localStorage
const sesion = {
    guardar: (usuario) => localStorage.setItem("usuario", JSON.stringify(usuario)),
    obtener: () => {
        try { return JSON.parse(localStorage.getItem("usuario")); } catch (e) { return null; }
    },
    cerrar: () => localStorage.removeItem("usuario")
};
