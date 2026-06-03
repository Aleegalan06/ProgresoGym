const express = require("express")
const path = require("path")
const fs = require("fs")
const initSqlJs = require("sql.js")

const app = express()
const PORT = 3000
const DB_PATH = path.join(__dirname, "progresogym.db")

app.use(express.static("."))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"))
})

async function iniciarServidor() {
    const SQL = await initSqlJs()

    let db
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH)
        db = new SQL.Database(fileBuffer)
    } else {
        db = new SQL.Database()
    }

    function guardarDB() {
        const data = db.export()
        fs.writeFileSync(DB_PATH, Buffer.from(data))
    }

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS entrenamientos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        );
        CREATE TABLE IF NOT EXISTS ejercicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            peso TEXT,
            series INTEGER,
            repeticiones INTEGER,
            id_entrenamiento INTEGER NOT NULL,
            FOREIGN KEY (id_entrenamiento) REFERENCES entrenamientos(id)
        );
    `)

    guardarDB()
    
    app.post("/usuario", (req, res) => {
        const nombre = req.body.nombre.replace(/\s+/g, "")

        try {
            db.run("INSERT OR IGNORE INTO usuarios (nombre) VALUES (?)", [nombre])
            guardarDB()
            res.json({ mensaje: "Usuario guardado" })
        } catch (error) {
            res.json({ error: "Error al guardar el usuario" })
        }
    })
    app.post("/entrenamiento", (req, res) => {
        const { nombre, fecha } = req.body
        const resultado = db.exec("SELECT id FROM usuarios WHERE nombre = ?", [nombre])
        const idUsuario = resultado[0].values[0][0]
        db.run("INSERT INTO entrenamientos (fecha, id_usuario) VALUES (?, ?)", [fecha, idUsuario])
        guardarDB()

        const idEntrenamiento = db.exec("SELECT last_insert_rowid()")[0].values[0][0]
        res.json({ idEntrenamiento: idEntrenamiento})
    })
    app.listen(PORT, () => {
        console.log("Servidor corriendo en http://localhost:3000")
    })
}

iniciarServidor()