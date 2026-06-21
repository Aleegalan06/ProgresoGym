require("dotenv").config()
const mysql = require("mysql2/promise")
const express = require("express")
const path = require("path")
const XLSX = require("xlsx")

const app = express()
const PORT = 3000

app.use(express.static("."))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"))
})

async function iniciarServidor() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    })

    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL UNIQUE
        )
    `)

    await db.query(`
        CREATE TABLE IF NOT EXISTS entrenamientos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fecha VARCHAR(20) NOT NULL,
            estado VARCHAR(20) DEFAULT 'PENDIENTE',
            id_usuario INT NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )
    `)

    await db.query(`
        CREATE TABLE IF NOT EXISTS ejercicios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            peso VARCHAR(50),
            series INT,
            repeticiones INT,
            completado TINYINT DEFAULT 0,
            id_entrenamiento INT NOT NULL,
            FOREIGN KEY (id_entrenamiento) REFERENCES entrenamientos(id)
        )
    `)

    app.post("/usuario", async (req, res) => {
        const nombre = req.body.nombre.replace(/\s+/g, "")
        try {
            await db.query("INSERT IGNORE INTO usuarios (nombre) VALUES (?)", [nombre])
            res.json({ mensaje: "Usuario guardado" })
        } catch (error) {
            res.json({ error: "Error al guardar el usuario" })
        }
    })

    app.post("/entrenamiento", async (req, res) => {
        const { nombre, fecha } = req.body

        const [usuarios] = await db.query("SELECT id FROM usuarios WHERE nombre = ?", [nombre])
        const idUsuario = usuarios[0].id

        const [resultado] = await db.query(
            "INSERT INTO entrenamientos (fecha, id_usuario) VALUES (?, ?)",
            [fecha, idUsuario]
        )

        res.json({ idEntrenamiento: resultado.insertId })
    })

    app.post("/ejercicio", async (req, res) => {
        const { nombre, peso, series, repeticiones, idEntrenamiento } = req.body

        await db.query(
            "INSERT INTO ejercicios (nombre, peso, series, repeticiones, id_entrenamiento) VALUES (?, ?, ?, ?, ?)",
            [nombre, peso, series, repeticiones, idEntrenamiento]
        )

        res.json({ mensaje: "Recibido" })
    })

    app.get("/informe/:nombre", async (req, res) => {
        const nombre = req.params.nombre

        const [entrenamientos] = await db.query(
            "SELECT id, fecha FROM entrenamientos WHERE id_usuario = (SELECT id FROM usuarios WHERE nombre = ?)",
            [nombre]
        )

        if(entrenamientos.length === 0) {
            return res.json({ error: "No hay entrenamientos" })
        }

        const wb = XLSX.utils.book_new()
        const filas = []

        for (const entrenamiento of entrenamientos) {
            filas.push(["ENTRENAMIENTO : " + entrenamiento.fecha, "", "", ""])
            filas.push(["Ejercicio", "Peso", "Series", "Repeticiones"])

            const [ejercicios] = await db.query(
                "SELECT nombre, peso, series, repeticiones FROM ejercicios WHERE id_entrenamiento = ?",
                [entrenamiento.id]
            )

            ejercicios.forEach(ej => {
                filas.push([ej.nombre, ej.peso, ej.series, ej.repeticiones])
            })

            filas.push(["", "", "", ""])
        }

        const ws = XLSX.utils.aoa_to_sheet(filas)
        XLSX.utils.book_append_sheet(wb, ws, "Informe")

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

        res.setHeader("Content-Disposition", "attachment; filename=informe.xlsx")
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.send(buffer)
    })

    app.get("/listado/:nombre", async (req, res) => {
        const nombre = req.params.nombre

        const [entrenamientos] = await db.query(
            "SELECT id, fecha, estado FROM entrenamientos WHERE id_usuario = (SELECT id FROM usuarios WHERE nombre = ?)",
            [nombre]
        )

        res.json(entrenamientos)
    })

    app.get("/detalle/:id", async (req, res) => {
        const id = req.params.id

        const [ejercicios] = await db.query(
            "SELECT id, nombre, peso, series, repeticiones, completado FROM ejercicios WHERE id_entrenamiento = ?",
            [id]
        )

        res.json(ejercicios)
    })

    app.post("/ejercicio/completado", async (req, res) => {
        const { id, completado, idEntrenamiento } = req.body

        await db.query("UPDATE ejercicios SET completado = ? WHERE id = ?", [completado, id])

        const [resultado] = await db.query(
            "SELECT COUNT(*) AS pendientes FROM ejercicios WHERE id_entrenamiento = ? AND completado = 0",
            [idEntrenamiento]
        )

        const pendientes = resultado[0].pendientes

        if(pendientes === 0) {
            await db.query("UPDATE entrenamientos SET estado = 'COMPLETADO' WHERE id = ?", [idEntrenamiento])
            res.json({ completado: true })
        } else {
            res.json({ completado: false })
        }
    })

    app.get("/ejercicios-unicos/:nombre", async (req, res) => {
        const nombre = req.params.nombre

        const [ejercicios] = await db.query(
            `SELECT DISTINCT ej.nombre FROM ejercicios ej
             JOIN entrenamientos e ON ej.id_entrenamiento = e.id
             JOIN usuarios u ON e.id_usuario = u.id
             WHERE u.nombre = ?`,
            [nombre]
        )

        res.json(ejercicios)
    })

app.get("/progreso/:nombre/:ejercicio", async (req, res) => {
    const { nombre, ejercicio } = req.params

    const [historial] = await db.query(
        `SELECT e.fecha, ej.peso, ej.repeticiones FROM ejercicios ej
         JOIN entrenamientos e ON ej.id_entrenamiento = e.id
         JOIN usuarios u ON e.id_usuario = u.id
         WHERE u.nombre = ? AND ej.nombre = ?
         ORDER BY e.fecha ASC`,
        [nombre, ejercicio]
    )

    res.json(historial)
})

    app.listen(PORT, () => {
        console.log("Servidor corriendo en http://localhost:3000")
    })
}

iniciarServidor()