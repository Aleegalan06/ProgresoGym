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
            div.className = "entrenamiento-item"
            div.innerHTML = `
                <p class="entrenamiento-fecha">
                    ${entrenamiento.fecha}
                    <span class="${entrenamiento.estado === 'COMPLETADO' ? 'estado-completado' : 'estado-pendiente'}">
                        ${entrenamiento.estado}
                    </span>
                </p>
                <div class="entrenamiento-acciones">
                    <button class="btn-editar">✏️</button>
                    <button class="btn-eliminar">🗑️</button>
                </div>
            `

            div.querySelector(".entrenamiento-fecha").addEventListener("click", function() {
                localStorage.setItem("idEntrenamiento", entrenamiento.id)
                window.location.href = "../html/detalle.html"
            })

            div.querySelector(".btn-editar").addEventListener("click", function() {
                localStorage.setItem("idEntrenamiento", entrenamiento.id)
                window.location.href = "../html/editar.html"
            })

            div.querySelector(".btn-eliminar").addEventListener("click", function() {
                if(confirm("¿Eliminar este entrenamiento?")) {
                    fetch("/entrenamiento/" + entrenamiento.id, {
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.mensaje) {
                            div.remove()
                        }
                    })
                }
            })

            contenedor.appendChild(div)
        })
    })