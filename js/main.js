import { getLibros, crearLibro, actualizarLibro, borrarLibro, toggleLeido} from "./api.js";
import { renderLibros, cargarFormulario, limpiarFormulario, mostrarFormularioAgr, ocultarFormulario } from "./ui.js";

let libros = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
    configurarEventos();
    cargarLibros();
}

async function cargarLibros() {
    libros = await getLibros();
    renderLibros(libros);
}

function configurarEventos() {
    const form = document.getElementById("libro-form");
    const buscar = document.getElementById("buscar-titulo");
    const filtroLeido = document.getElementById("filtro-leido");
    const tabla = document.getElementById("tabla-libros");
    const btnAgrLibro = document.getElementById("btn-agregar-libro");
    const btnCerrarForm = document.getElementById("libro-form__icono-cerrar");

    form.addEventListener("submit", manejarSubmit);
    buscar.addEventListener("input", aplicarFiltros);
    filtroLeido.addEventListener("change", aplicarFiltros);
    tabla.addEventListener("click", manejarAccionesTabla);
    btnAgrLibro.addEventListener("click", mostrarFormularioAgr);
    btnCerrarForm.addEventListener("click", ocultarFormulario);
}

async function manejarSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("libro-id").value;

    const data = {
        titulo: document.getElementById("titulo").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        anio: document.getElementById("anio").value,
        leido: document.getElementById("leido").checked
    };

    limpiarErrores();

    if (!titulo.value.trim()) {
        mostrarErrorCampo("titulo", "El título es obligatorio");
        return;
    }

    if (!titulo.value.trim()) {
        mostrarErrorCampo("autor", "El autor es obligatorio");
        return;
    }

    const errores = validarLibro(data);

    if (errores.length > 0) {
        mostrarErrores(errores);
        return;
    }

    try {
        if (id) {
            await actualizarLibro(id, data);
            mostrarMensaje("Libro actualizado correctamente", "ok");
        } else {
            await crearLibro(data);
            mostrarMensaje("Libro guardado correctamente", "ok");
        }

        limpiarFormulario();
        cargarLibros();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

function validarLibro(data) {
    const errores = [];

    if(!data.titulo || data.titulo.length < 2) {
        errores.push("El título debe tener al menos 2 caracteres.");
    }

    if(!data.autor || data.autor.length < 2) {
        errores.push("El autor debe tener al menos 2 caracteres");
    }

    if(data.genero && data.genero.length > 30) {
        errores.push("El género no puede superar los 30 caracteres");
    }

    if(data.anio) {
        const anio = Number(data.anio);
        const anioActual = new Date().getFullYear();

        if (isNaN(anio) || anio < 1000 || anio > anioActual) {
            errores.push(`El Año debe ser entre 1000 y ${anioActual}.`);
        }
    }

    return errores;
}

function mostrarErrores(errores) {
    errores.forEach(mensaje => {
        if (mensaje.includes("título")) {
            document.getElementById("error-titulo").textContent = mensaje;
        }

        if (mensaje.includes("autor")) {
            document.getElementById("error-autor").textContent = mensaje;
        }

        if (mensaje.includes("género")) {
            document.getElementById("error-genero").textContent = mensaje;
        }

        if (mensaje.includes("Año")) {
            document.getElementById("error-anio").textContent = mensaje;
        }
    });
}

function mostrarMensaje(texto, tipo) {
    const div = document.getElementById("mensaje");
    div.textContent = texto;
    div.className = `mensaje ${tipo}`;
}

function limpiarErrores() {
    document.querySelectorAll("small.error").forEach(e => e.textContent = "");
}

function mostrarErrorCampo(id, mensaje) {
    document.getElementById(`error-${id}`).textContent = mensaje;
}

function manejarAccionesTabla(e) {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("btn-editar")) {
        limpiarErrores();
        const libro = libros.find(l => l.id == id);
        cargarFormulario(libro);
    }

    if (e.target.classList.contains("btn-borrar")) {
        borrarLibro(id).then(cargarLibros);
    }

    if (e.target.classList.contains("btn-leido")) {
        toggleLeido(id).then(cargarLibros);
    }
}

function aplicarFiltros() {
    const texto = document.getElementById("buscar-titulo").value.toLowerCase();
    const estado = document.getElementById("filtro-leido").value;

    let filtrados = libros.filter( libro =>
        libro.titulo.toLowerCase().includes(texto)
    );

    if (estado !== "") {
        filtrados = filtrados.filter(libro => libro.leido == estado);
    }

    renderLibros(filtrados);
}

