const idEntrenamiento = localStorage.getItem("idEntrenamiento")
const contenedor = document.getElementById("contenedorEditar")

fetch("/detalle/" + idEntrenamiento)
    .then(res => res.json())
    .then(ejercicios => {
        if(ejercicios.length === 0) {
            contenedor.innerHTML = "<p>No hay ejercicios en este entrenamiento</p>"
            return
        }

        ejercicios.forEach(ejercicio => {
            const div = document.createElement("div")
            div.className = "ejercicio-editar"
            div.innerHTML = `
                <input type="text" class="input-nombre" value="${ejercicio.nombre}" placeholder="Nombre del ejercicio">
                <input type="text" class="input-peso" value="${ejercicio.peso}" placeholder="Peso (kg)">
                <input type="number" class="input-series" value="${ejercicio.series}" placeholder="Series">
                <input type="number" class="input-repeticiones" value="${ejercicio.repeticiones}" placeholder="Repeticiones">
                <div class="ejercicio-acciones">
                    <button class="btn-eliminar-ejercicio">🗑️ Eliminar</button>
                    <button class="btn-guardar-ejercicio">✓ Guardar</button>
                </div>
            `

            div.querySelector(".btn-guardar-ejercicio").addEventListener("click", function() {
                const nombre = div.querySelector(".input-nombre").value
                const peso = div.querySelector(".input-peso").value
                const series = div.querySelector(".input-series").value
                const repeticiones = div.querySelector(".input-repeticiones").value

                fetch("/ejercicio/" + ejercicio.id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, peso, series, repeticiones })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.mensaje) {
                        div.style.borderColor = "#e8ff47"
                        setTimeout(() => div.style.borderColor = "#2a2a2a", 1500)
                    }
                })
            })

            div.querySelector(".btn-eliminar-ejercicio").addEventListener("click", function() {
                if(confirm("¿Eliminar este ejercicio?")) {
                    fetch("/ejercicio/" + ejercicio.id, {
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

        const btnVolver = document.createElement("button")
        btnVolver.className = "btn-volver"
        btnVolver.textContent = "← Volver al listado"
        btnVolver.addEventListener("click", function() {
            window.location.href = "../html/listado.html"
        })
        contenedor.appendChild(btnVolver)
    })