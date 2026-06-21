const usuario = localStorage.getItem("usuario")
const selector = document.getElementById("selectorEjercicio")
const canvas = document.getElementById("graficaProgreso")
const infoDiv = document.getElementById("infoEjercicio")

let grafica = null

fetch("/ejercicios-unicos/" + usuario)
    .then(res => res.json())
    .then(ejercicios => {
        if(ejercicios.length === 0) {
            selector.innerHTML = "<option>No hay ejercicios registrados</option>"
            return
        }

        ejercicios.forEach(ejercicio => {
            const option = document.createElement("option")
            option.value = ejercicio.nombre
            option.textContent = ejercicio.nombre
            selector.appendChild(option)
        })

        cargarGrafica(selector.value)
    })

selector.addEventListener("change", function() {
    cargarGrafica(selector.value)
})

function cargarGrafica(nombreEjercicio) {
    fetch("/progreso/" + usuario + "/" + nombreEjercicio)
        .then(res => res.json())
        .then(historial => {
            const fechas = historial.map(h => h.fecha)
            const pesos = historial.map(h => h.peso)

            if(grafica) {
                grafica.destroy()
            }

            infoDiv.style.display = "none"

            grafica = new Chart(canvas, {
                type: "line",
                data: {
                    labels: fechas,
                    datasets: [{
                        label: "Peso (kg)",
                        data: pesos,
                        borderColor: "#e8ff47",
                        backgroundColor: "#e8ff4733",
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: "#e8ff47",
                        pointRadius: 5
                    }]
                },
                options: {
                    interaction: {
                        mode: "nearest",
                        intersect: true
                    },
                    scales: {
                        y: {
                            ticks: { color: "#aaa" },
                            grid: { color: "#2a2a2a" }
                        },
                        x: {
                            ticks: { color: "#aaa" },
                            grid: { color: "#2a2a2a" }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: "#f0f0f0" }
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            })

            canvas.onclick = function(event) {
                const puntos = grafica.getElementsAtEventForMode(event, "nearest", { intersect: false }, true)
                console.log(puntos)
                if(puntos.length > 0) {
                    const index = puntos[0].index
                    infoDiv.innerHTML = `Peso: ${historial[index].peso}kg — Repeticiones: ${historial[index].repeticiones}`
                    infoDiv.style.display = "block"
                }
            }
        })
}