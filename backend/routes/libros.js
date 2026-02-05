import express from "express";
import db from "../db.js";

const router = express.Router();

function esStringValido(valor, min = 1, max = 255) {
    return (
        typeof valor === "string" &&
        valor.trim().length >= min &&
        valor.trim().length <= max
    );
}

function esAnioValido(anio) {
    if (anio === null || anio === undefined || anio === "") return true;
    const num = Number(anio);
    return Number.isInteger(num) && num > 0 && num <= 3000;
}

/* GET todos los libros */
router.get("/", async (req, res) => {

    try {
        const libros = await db.all("SELECT * FROM libros");
        res.json(libros);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los libros"
        });
    }
    
});

/* POST crear libro */

router.post("/", async (req, res) => {

    try {
        const { titulo, autor, genero, anio, leido } = req.body;

        if (!esStringValido(titulo, 2)) {
            return res.status(400).json({
                error: "El título es obligatorio y debe tener al menos 2 caracteres"
            });
        }

        if (!esStringValido(autor, 2)) {
            return res.status(400).json({
                error: "El autor es obligatorio y debe tener al menos 2 caracteres"
            });
        }

        if (!esAnioValido(anio)) {
            return res.status(400).json({
                error: "El año debe ser un número entero válido"
            });
        }

        const result = await db.run(
            `INSERT INTO libros (titulo, autor, genero, anio, leido)
            VALUES (?, ?, ?, ?, ?)`,
            [titulo.trim(),
            autor.trim(), 
            genero || null, 
            anio || null, 
            leido === true ? 1 : 0]
        );

        res.status(201).json({ id: result.lastID });
    } catch(error) {
        res.status(500).json({
            error: "Error al crear el libro"
        });
    }
});

/* PUT editar libro */
router.put("/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const { titulo, autor, genero, anio, leido } = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                error: "ID inválido"
            });
        }

        if (!esStringValido(titulo, 2)) {
            return res.status(400).json({
                error: "El título no es válido"
            });
        }

        if (!esStringValido(autor, 2)) {
            return res.status(400).json({
                error: "El autor no es válido"
            });
        }

        if (!esAnioValido(anio)) {
            return res.status(400).json({
                error: "El año no es válido"
            });
        }

        const result = await db.run(
            `UPDATE libros
            SET titulo=?, autor=?, genero=?, anio=?, leido=?
            WHERE id=?`,
            [titulo.trim(), 
            autor.trim(), 
            genero || null, 
            anio || null, 
            leido === true ? 1 : 0, 
            id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el libro"
        });
    }
});

/* PATCH toggle leído */
router.patch("/:id/leido", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                error: "ID inválido"
            });
        }

        const result = await db.run(
            `UPDATE libros
            SET leido = CASE leido WHEN 1 THEN 0 ELSE 1 END
            WHERE id = ?`,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            error: "Error al cambiar el estado de lectura"
        });
    }
    
});

/* DELETE libro */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                error: "ID inválido"
            });
        }

        const result = await db.run("DELETE FROM libros WHERE id = ?", [id]);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.sendStatus(204);

    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el libro"
        });
    }
});

export default router;