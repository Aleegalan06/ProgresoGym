const botonEmpezar = document.getElementById("empezarEntrenamiento")
const nombreUsuario = document.getElementById("nombreUsuario")
const fecha = document.getElementById("fecha")
const formularioIndex = document.getElementById("formularioIndex")
formularioIndex.addEventListener("submit", function(event){
    event.preventDefault()
    //Recoge el valor del nombredeusuario que los pasa a minusculaTodos
    const valorNombre = nombreUsuario.value.toLowerCase().trim()
    //Recoge el valor de la fecha de hoy
    const valorFecha = fecha.value
    //Y redirige a entrenamiento.html
    window.location.href = "entrenamiento.html"
})