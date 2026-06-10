const usuario = localStorage.getItem("usuario")
const contenedor = document.getElementById("contenedorEntrenamientos")

fetch("/listado/" + usuario)
    .then(res => res.json())
    .then(entrenamientos => {
        if(entrenamientos.length === 0) {
            contenedor.innerHTML = "<p>No hay entrenamientos registrados</p>"
            return
        }

        entrenamientos.forEach(entrenamiento => {
            const div = document.createElement("div")
            div.innerHTML = `
                <p>${entrenamiento.fecha} - ${entrenamiento.estado}</p>
            `
            div.addEventListener("click", function() {
                localStorage.setItem("idEntrenamiento", entrenamiento.id)
                window.location.href = "../html/detalle.html"
            })
            contenedor.appendChild(div)
        })
    })