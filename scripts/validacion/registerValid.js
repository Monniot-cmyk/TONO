
document.addEventListener("DOMContentLoaded", () => {
    // Formulario general
    const form = document.getElementById("formRegistro");
    // Sección otros (gracias Anais por complicarme la vida :D)
    const otrosCheckbox = document.getElementById("otrosCheckbox");
    const otrosTexto = document.getElementById("otrosTexto");

    // Activar / desactivar campo "otros". Esto es mitad mío y mitad concha así que lo voy a comentar como si no hubiera un mañana
    otrosCheckbox.addEventListener("change", () => { //Cada vez que cambia su valor se ejecuta
        otrosTexto.disabled = !otrosCheckbox.checked; //Si no está marcado desactiva el texto y (el if de abajo) borra el valor metido
        if (!otrosCheckbox.checked) {
            otrosTexto.value = "";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener valores
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const pass1 = document.getElementById("contraseña").value;
        const pass2 = document.getElementById("contraseña2").value;

        // Validaciones basicorras
        if (!nombre || !email || !usuario || !pass1 || !pass2) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        // Hola Sergio del futuro, soy yo, tu consciencia. Recuerda que solo has validado la primera contraseña porque la segunda tiene que ser igual que esta así que tiene que estar bien por huevos. De nada. Por cierto tiende la ropa
        if (pass1.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (pass1 !== pass2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Guardamos los intereses en un array
        const intereses = [];
        // Busca todos los input con el nombre musica que sten marcados. Cada vez que encuentra uno lo guarda en chk (checked) y lo pushea en el array que hemos creado
        document.querySelectorAll("input[name='musica[]']:checked").forEach(chk => {
            intereses.push(chk.value);
        });

        // Si hay algo escrito se mete al array de intereses tambien
        if (otrosCheckbox.checked && otrosTexto.value.trim() !== "") {
            intereses.push(otrosTexto.value.trim());
        }

        // Creamos un objeto usuario para guardar tó
        const usuarioData = {
            nombre,
            email,
            usuario,
            intereses
        };

        // Guardar en sessionStorage con el nombre "usuarioRegistrado". Uso JSON porque es más escalable según chati.
        sessionStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioData)); //Como aparentemente no se pueden guardar objetos, se guarda en texto (stringify)

        // Redirección al index
        window.location.href = "../../index.html";

        //Esto luego se quita, de momento es para comprobar que todo va bien
        alert("Usuario registrado correctamente :D");
    });
});

//----------------------------------------
// COMO SACAR LOS DATOS GUARDADOS EN JSON
//----------------------------------------
/*
// Recoges el valor en texto de JSON y lo conviertes de vuelta a objeto
const usuario = JSON.parse(sessionStorage.getItem("usuarioRegistrado"));

// Se muestran los valores con el nombre del objeto (usuario) y el valor que se quiere sacar (nombre) == "usuario.nombre".
// Es buena idea comprobar antes si el objeto existe (pa porsi)
if (usuario) {
    console.log(usuario.nombre);
    console.log(usuario.email);
    console.log(usuario.intereses);
}
*/
