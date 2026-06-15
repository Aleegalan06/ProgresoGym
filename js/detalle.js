// detalle.js
const idEntrenamiento = localStorage.getItem("idEntrenamiento")
const contenedor = document.getElementById("contenedorEjercicios")

console.log("idEntrenamiento:", idEntrenamiento)

fetch("/detalle/" + idEntrenamiento)
    .then(res => res.json())
    .then(ejercicios => {
        console.log("ejercicios:", ejercicios)
        if(ejercicios.length === 0) {
            contenedor.innerHTML = "<p>No hay ejercicios en este entrenamiento</p>"
            return
        }

        ejercicios.forEach(ejercicio => {
            const div = document.createElement("div")
            div.innerHTML = `
                <input type="checkbox" id="ej-${ejercicio.id}" ${ejercicio.completado ? "checked" : ""}>
                <label for="ej-${ejercicio.id}">
                    ${ejercicio.nombre} - ${ejercicio.peso}kg - ${ejercicio.series} series x ${ejercicio.repeticiones} reps
                </label>
            `

            const checkbox = div.querySelector("input[type='checkbox']")
            checkbox.addEventListener("change", function() {
                fetch("/ejercicio/completado", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        id: ejercicio.id, 
                        completado: checkbox.checked ? 1 : 0,
                        idEntrenamiento: idEntrenamiento
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.completado) {
                        window.location.href = "../html/listado.html"
                    }
                })
            })

            contenedor.appendChild(div)
        })
    })