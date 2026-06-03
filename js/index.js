const botonEmpezar = document.getElementById("empezarEntrenamiento")
const nombreUsuario = document.getElementById("nombreUsuario")
const fecha = document.getElementById("fecha")
fecha.value = new Date().toISOString().split("T")[0]
const formularioIndex = document.getElementById("formularioIndex")
formularioIndex.addEventListener("submit", function(event){
    event.preventDefault()
    //Recoge el valor del nombredeusuario que los pasa a minusculaTodos
    const valorNombre = nombreUsuario.value.toLowerCase().trim()
    //Recoge el valor de la fecha de hoy
    const valorFecha = fecha.value
    //Envio de datos
    fetch("/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: valorNombre })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("usuario", valorNombre)
        localStorage.setItem("fecha", valorFecha)
        window.location.href = "../html/entrenamiento.html"
    })
    //Y redirige a entrenamiento.html
})