const nombreEjercicio = document.getElementById("nombreEjercicio")
const pesoEjercicio = document.getElementById("pesoEjercicio")
const numeroSeries = document.getElementById("numeroSeries")
const numeroRepes = document.getElementById("numeroRepes")
const contadorEjercicios = document.getElementById("contadorEjercicios")
let contador = 0
const añadirEj = document.getElementById("añadirEj")
const terminarEntrenamiento = document.getElementById("terminarEntrenamiento")
const usuario = localStorage.getItem("usuario")
const fecha = localStorage.getItem("fecha")

fetch("/entrenamiento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: usuario, fecha: fecha })
})
.then(res => res.json())
.then(data => {
    localStorage.setItem("idEntrenamiento", data.idEntrenamiento)
    console.log(data)
})

añadirEj.addEventListener("click", function() {
    if(nombreEjercicio.value.trim() === "") {
        alert("Introduce el nombre del ejercicio")
        return
    }

    const valorNombre = nombreEjercicio.value
    const valorPeso = pesoEjercicio.value
    const valorSeries = numeroSeries.value
    const valorRepes = numeroRepes.value
    const idEntrenamiento = localStorage.getItem("idEntrenamiento")

    fetch("/ejercicio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nombre: valorNombre, 
            peso: valorPeso, 
            series: valorSeries, 
            repeticiones: valorRepes,
            idEntrenamiento: idEntrenamiento
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })

    contador++
    nombreEjercicio.value = ""
    pesoEjercicio.value = ""
    numeroSeries.value = ""
    numeroRepes.value = ""
    contadorEjercicios.innerHTML = "Ejercicios: " + contador
})

terminarEntrenamiento.addEventListener("click", function(){
    alert("Entrenamiento Terminado")
    window.location.href = "../html/index.html"
})