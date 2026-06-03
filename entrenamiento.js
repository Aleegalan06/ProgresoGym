const nombreEjercicio = document.getElementById("nombreEjercicio")
const pesoEjercicio = document.getElementById("pesoEjercicio")
const numeroSeries = document.getElementById("numeroSeries")
const numeroRepes = document.getElementById("numeroRepes")
const contadorEjercicios = document.getElementById("contadorEjercicios")
let contador = 0
const añadirEj = document.getElementById("añadirEj")
const terminarEntrenamiento = document.getElementById("terminarEntrenamiento")

añadirEj.addEventListener("click", function() {
    if(nombreEjercicio.value.trim() === "") {
        alert("Introduce el nombre del ejercicio")
        return
    }
    contador++
    nombreEjercicio.value = ""
    pesoEjercicio.value = ""
    numeroSeries.value = ""
    numeroRepes.value = ""
    contadorEjercicios.innerHTML = "Ejercicios: " + contador

})

terminarEntrenamiento.addEventListener("click", function(){
    alert("Entrenamiento Terminado")
    window.location.href = "index.html"
})