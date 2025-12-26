// Otros - musica
// Esto hace que cuando se pulse el check de musica se active el campo para escribir
    const otrosCheckbox = document.getElementById("otrosCheckbox");
    const otrosTexto = document.getElementById("otrosTexto");

    otrosCheckbox.addEventListener("change", () => {
        otrosTexto.disabled = !otrosCheckbox.checked;
        if (!otrosCheckbox.checked) otrosTexto.value = "";
    });

    //Lo mismo pero para videojuegos
    const otrosJuegosCheckbox = document.getElementById("otrosJuegosCheckbox");
    const otrosJuegosTexto = document.getElementById("otrosJuegosTexto");

    otrosJuegosCheckbox.addEventListener("change", () => {
        otrosJuegosTexto.disabled = !otrosJuegosCheckbox.checked;
        if (!otrosJuegosCheckbox.checked) otrosJuegosTexto.value = "";
    });






    // Validar el formulario
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        const pass1 = document.getElementById("contraseña").value;
        const pass2 = document.getElementById("contraseña2").value;

        if (pass1 !== pass2) {
            alert("Las contraseñas no coinciden.");
            e.preventDefault();
            return;
        }

        const musicaChecked = document.querySelectorAll('input[name="musica[]"]:checked').length;
        const juegosChecked = document.querySelectorAll('input[name="juegos[]"]:checked').length;

        if (musicaChecked === 0 && juegosChecked === 0) {
            alert("Selecciona al menos un interés musical o un tipo de videojuego.");
            e.preventDefault();
        }
    });