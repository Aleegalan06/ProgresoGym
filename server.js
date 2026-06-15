const express = require("express")
const path = require("path")
const fs = require("fs")
const initSqlJs = require("sql.js")
const XLSX = require("xlsx")

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
            estado TEXT DEFAULT 'PENDIENTE',
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS ejercicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            peso TEXT,
            series INTEGER,
            repeticiones INTEGER,
            completado INTEGER DEFAULT 0,
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

        const stmt = db.prepare("INSERT INTO entrenamientos (fecha, id_usuario) VALUES (?, ?)")
        stmt.run([fecha, idUsuario])
        stmt.free()
        guardarDB()

        const resultId = db.exec("SELECT MAX(id) FROM entrenamientos")
        const idEntrenamiento = resultId[0].values[0][0]

        res.json({ idEntrenamiento: idEntrenamiento })
    })
    app.post("/ejercicio", (req, res) => {
        const {nombre, peso, series, repeticiones, idEntrenamiento } = req.body
        db.run("INSERT INTO ejercicios (nombre, peso, series, repeticiones, id_entrenamiento) VALUES (?, ?, ?, ?, ?)",
            [nombre, peso, series, repeticiones, idEntrenamiento])
            guardarDB()
        res.json({ mensaje: "Recibido" })
    })
    app.get("/informe/:nombre", (req, res) => {
        const nombre = req.params.nombre
        
        const entrenamientos = db.exec(
            "SELECT id, fecha FROM entrenamientos WHERE id_usuario = (SELECT id FROM usuarios WHERE nombre = ?)",
            [nombre]
        )
    
        if(!entrenamientos.length || !entrenamientos[0].values.length) {
            return res.json({ error: "No hay entrenamientos" })
        }
    
        const wb = XLSX.utils.book_new()
        const filas = []
    
        entrenamientos[0].values.forEach(entrenamiento => {
            const idEntrenamiento = entrenamiento[0]
            const fecha = entrenamiento[1]
        
            filas.push(["ENTRENAMIENTO : " + fecha, "", "", ""])
            filas.push(["Ejercicio", "Peso", "Series", "Repeticiones"])
        
            const ejercicios = db.exec(
                "SELECT nombre, peso, series, repeticiones FROM ejercicios WHERE id_entrenamiento = ?",
                [idEntrenamiento]
            )
        
            if(ejercicios.length && ejercicios[0].values.length) {
                ejercicios[0].values.forEach(ej => {
                    filas.push([ej[0], ej[1], ej[2], ej[3]])
                })
            }
        
            filas.push(["", "", "", ""])
        })
    
        const ws = XLSX.utils.aoa_to_sheet(filas)
        XLSX.utils.book_append_sheet(wb, ws, "Informe")
    
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    
        res.setHeader("Content-Disposition", "attachment; filename=informe.xlsx")
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.send(buffer)
    })
    app.get("/listado/:nombre", (req, res) => {
        const nombre = req.params.nombre
        const resultado = db.exec(
            "SELECT id, fecha, estado FROM entrenamientos WHERE id_usuario = (SELECT id FROM usuarios WHERE nombre = ?)",
            [nombre]
        )
        if(!resultado.length || !resultado[0].values.length){
            return res.json([])
        }
        const entrenamientos = resultado[0].values.map(e => ({
            id: e[0],
            fecha: e[1],
            estado: e[2]
        }))
        res.json(entrenamientos)
    })
    app.get("/detalle/:id", (req, res) => {
        const id = req.params.id
        
        const resultado = db.exec(
            "SELECT id, nombre, peso, series, repeticiones, completado FROM ejercicios WHERE id_entrenamiento = ?",
            [id]
        )
    
        if(!resultado.length || !resultado[0].values.length) {
            return res.json([])
        }
    
        const ejercicios = resultado[0].values.map(e => ({
            id: e[0],
            nombre: e[1],
            peso: e[2],
            series: e[3],
            repeticiones: e[4],
            completado: e[5]
        }))
    
        res.json(ejercicios)
    })
    app.post("/ejercicio/completado", (req, res) => {
    const { id, completado, idEntrenamiento } = req.body

    db.run("UPDATE ejercicios SET completado = ? WHERE id = ?", [completado, id])
    guardarDB()

    const resultado = db.exec(
        "SELECT COUNT(*) FROM ejercicios WHERE id_entrenamiento = ? AND completado = 0",
        [idEntrenamiento]
    )

    const pendientes = resultado[0].values[0][0]

    if(pendientes === 0) {
        db.run("UPDATE entrenamientos SET estado = 'COMPLETADO' WHERE id = ?", [idEntrenamiento])
        guardarDB()
        res.json({ completado: true })
    } else {
        res.json({ completado: false })
    }
})

    app.listen(PORT, () => {
        console.log("Servidor corriendo en http://localhost:3000")
    })
    
}

iniciarServidor()