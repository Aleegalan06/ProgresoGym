const usuario = localStorage.getItem("usuario")
const selector = document.getElementById("selectorEjercicio")
const canvas = document.getElementById("graficaProgreso")

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
                            callbacks: {
                                label: function(context) {
                                    const index = context.dataIndex
                                    const repeticiones = historial[index].repeticiones
                                    return [
                                        "Peso: " + context.raw + "kg",
                                        "Repeticiones: " + repeticiones
                                    ]
                                }
                            }
                        }
                    }
                }
            })
        })
}