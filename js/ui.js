export function renderLibros(libros) {
    const tbody = document.getElementById("tabla-libros");
    tbody.innerHTML = "";

    libros.forEach(libro => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.genero || "-"}</td>
            <td>${libro.anio || "-"}</td>
            <td>${libro.leido ? "Leído" : "No leído"}</td>
            <td>
                <div  class="list_celdas-acciones">
                    <button class="btn-editar" data-id="${libro.id}">Editar</button>
                    <button class="btn-borrar" data-id="${libro.id}">Eliminar</button>
                    <button class="btn-leido" data-id="${libro.id}">
                        ${libro.leido ? "Marcar no leído" : "Marcar leído"}
                    </button>
                </div>
                
            </td>
        `;

        tbody.appendChild(tr);
    });
}

export function mostrarFormularioAgr() {
    document.getElementById('form-libro_contenedor').classList.remove('oculto');
    document.getElementById("titulo-formulario").textContent = "Agregar libro";
}

export function ocultarFormulario() {
    document.getElementById('form-libro_contenedor').classList.add('oculto');
}

export function cargarFormulario(libro) {
    document.getElementById('form-libro_contenedor').classList.remove('oculto');
    document.getElementById("titulo-formulario").textContent = "Editar libro";
    document.getElementById("libro-id").value = libro.id;
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("genero").value = libro.genero || "";
    document.getElementById("anio").value = libro.anio || "";
    document.getElementById("leido").checked = libro.leido;
}

export function limpiarFormulario() {
    document.getElementById("libro-id").value = "";
    document.getElementById("libro-form").reset();
}