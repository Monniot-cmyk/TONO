window.addEventListener("DOMContentLoaded", () => {
    const usuarioString = localStorage.getItem("usuarioActivo");

    if (!usuarioString) {
        alert("No has iniciado sesión");
        window.location.href = "../../index.html"; 
        return;
    }

    const usuario = JSON.parse(usuarioString);

    document.getElementById("perfilNombre").textContent = usuario.usuario || usuario.nombre;
    document.getElementById("perfilEmail").textContent = usuario.email || "No registrado";
    document.getElementById("perfilIntereses").textContent =
        usuario.intereses && usuario.intereses.length > 0
            ? usuario.intereses.join(", ")
            : "Sin intereses registrados";
});
