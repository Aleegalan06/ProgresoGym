const formulario = document.getElementById("formularioLogin")
const btnRegistro = document.getElementById("btnRegistro")
const mensajeError = document.getElementById("mensajeError")

formulario.addEventListener("submit", async function(event) {
    event.preventDefault()

    const nombre = document.getElementById("nombreUsuario").value
    const password = document.getElementById("password").value

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password })
    })

    const data = await res.json()

    if(data.error) {
        mensajeError.textContent = data.error
    } else {
        localStorage.setItem("usuario", data.nombre)
        window.location.href = "../html/index.html"
    }
})

btnRegistro.addEventListener("click", async function() {
    const nombre = document.getElementById("nombreUsuario").value
    const password = document.getElementById("password").value

    if(!nombre || !password) {
        mensajeError.textContent = "Rellena el nombre y la contraseña"
        return
    }

    const res = await fetch("/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password })
    })

    const data = await res.json()

    if(data.error) {
        mensajeError.textContent = data.error
    } else {
        mensajeError.style.color = "#e8ff47"
        mensajeError.textContent = "Usuario registrado, inicia sesión"
    }
})