const nombreEjercicio = document.getElementById("nombreEjercicio")
const pesoEjercicio = document.getElementById("pesoEjercicio")
const numeroSeries = document.getElementById("numeroSeries")
const numeroRepes = document.getElementById("numeroRepes")
const parrafoEjercicios = document.getElementById("parrafoEjercicios")
let contadorEjercicios = 0
const añadirEj = document.getElementById("añadirEj")
const terminarEntrenamiento = document.getElementById("terminarEntrenamiento")

añadirEj.addEventListener("click", function() {
    if(nombreEjercicio.value.trim() === "") {
        alert("Introduce el nombre del ejercicio")
        return
    }
    contadorEjercicios++
    nombreEjercicio.value = ""
    pesoEjercicio.value = ""
    numeroSeries.value = ""
    numeroRepes.value = ""
    parrafoEjercicios.innerHTML = "Ejercicios: " + contadorEjercicios + 
    ' <input type="button" value="Añadir" id="añadirEj"><br>' +
    ' <input type="button" value="Terminar entrenamiento" id="terminarEntrenamiento">'
})

terminarEntrenamiento.addEventListener("click", function(){
    alert("Entrenamiento Terminado")
    window.location.href = "index.html"
})