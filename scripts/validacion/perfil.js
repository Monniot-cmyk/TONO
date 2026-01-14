window.addEventListener("DOMContentLoaded", () => {
    const usuarioString = localStorage.getItem("usuarioActivo");

    if (!usuarioString) {
        alert("No has iniciado sesión");
        window.location.href = "../../index.html";
        return;
    }

    const usuario = JSON.parse(usuarioString);

    document.getElementById("perfilNombre").textContent =
        usuario.nombre || usuario.usuario || "Sin nombre";

    document.getElementById("perfilEmail").textContent =
        usuario.email || "No registrado";

    document.getElementById("perfilIntereses").textContent =
        usuario.intereses?.length
            ? usuario.intereses.join(", ")
            : "Sin intereses registrados";
});

const botones = document.querySelectorAll('.mantenimiento-btn');

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        boton.classList.remove('shake');
        void boton.offsetWidth; // fuerza reflow
        boton.classList.add('shake');

        setTimeout(() => {
            boton.classList.remove('shake'); // quita clase después
            alert('Este botón está en mantenimiento.');
        }, 400);
    });
});