const API_URL = "http://localhost:3000/libros";

export async function getLibros() {
    const res = await fetch(API_URL);
    return res.json();
}

console.log(API_URL);
export async function crearLibro(data) {
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export async function actualizarLibro(id, data) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export async function borrarLibro(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function toggleLeido(id) {
    await fetch(`${API_URL}/${id}/leido`, { method: "PATCH" });
}
