const usuario = localStorage.getItem("usuario")

if(!usuario) {
    window.location.href = "../html/login.html"
}

const fecha = document.getElementById("fecha")
const formularioIndex = document.getElementById("formularioIndex")
const verListado = document.getElementById("verListado")
const verProgreso = document.getElementById("verProgreso")
const botonInforme = document.getElementById("generarInforme")

document.getElementById("nombreMostrado").textContent = usuario
document.getElementById("fechaMostrada").textContent = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })

fecha.value = new Date().toISOString().split("T")[0]

formularioIndex.addEventListener("submit", function(event) {
    event.preventDefault()
    const valorFecha = fecha.value

    fetch("/entrenamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: usuario, fecha: valorFecha })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("fecha", valorFecha)
        localStorage.setItem("idEntrenamiento", data.idEntrenamiento)
        window.location.href = "../html/entrenamiento.html"
    })
})

botonInforme.addEventListener("click", function() {
    window.location.href = "/informe/" + usuario
})

verListado.addEventListener("click", function() {
    window.location.href = "../html/listado.html"
})

verProgreso.addEventListener("click", function() {
    window.location.href = "../html/progreso.html"
})