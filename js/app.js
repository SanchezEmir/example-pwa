if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((registrado) =>
      console.log("Se instaló correctamente...", registrado)
    )
    .catch((error) => console.log("Fallo la instalación", error));
} else {
  console.log("SW no soportados");
}

// ============================ Audio ============================

// Ruta del sonido
const audio = new Audio("https://samplelib.com/lib/preview/mp3/sample-3s.mp3"); // Cambia la URL a tu archivo
audio.loop = true; // Activar bucle de reproducción

let userInteracted = localStorage.getItem("userInteracted") === "true"; // Verificar si ya hay interacción registrada
let cooldown = false; // Estado de descanso tras detener el sonido

// Elementos del DOM
const permissionsButton = document.getElementById("permissions-button");
const permissionsIcon = document.getElementById("permissions-icon");
const permissionsText = document.getElementById("permissions-text");

// Configuración inicial del botón
if (userInteracted) {
  permissionsButton.classList.remove("btn-danger");
  permissionsButton.classList.add("btn-success"); // Cambia a verde
  permissionsIcon.className = "bi bi-check-circle-fill"; // Ícono de check
  permissionsText.textContent = "Permiso Habilitado";

  // Iniciar el sonido después de 5 segundos
  setTimeout(() => {
    if (!cooldown) {
      audio.play().then(() => console.log("Reproduciendo sonido en bucle..."));
    }
  }, 5000);
}

// Función para alternar el permiso
permissionsButton.addEventListener("click", () => {
  if (userInteracted) {
    // Deshabilitar permiso
    userInteracted = false;
    localStorage.setItem("userInteracted", "false");
    permissionsButton.classList.remove("btn-success");
    permissionsButton.classList.add("btn-danger"); // Cambia a rojo
    permissionsIcon.className = "bi bi-lock-fill"; // Cambiar ícono a candado
    permissionsText.textContent = "Sin Permiso";
    console.log("Permiso revocado. Deteniendo sonido.");
    audio.pause();
    audio.currentTime = 0; // Reiniciar el audio
    return;
  }

  // Habilitar permiso
  userInteracted = true;
  localStorage.setItem("userInteracted", "true");
  permissionsButton.classList.remove("btn-danger");
  permissionsButton.classList.add("btn-success"); // Cambia a verde
  permissionsIcon.className = "bi bi-check-circle-fill"; // Cambiar ícono a check
  permissionsText.textContent = "Permiso Habilitado";
  console.log("Permiso otorgado y registrado en localStorage.");

  // Iniciar el sonido después de 5 segundos
  setTimeout(() => {
    if (!cooldown) {
      audio.play().then(() => console.log("Reproduciendo sonido en bucle..."));
    }
  }, 5000);
});

// Evento para detener el sonido
document.getElementById("main-action").addEventListener("click", () => {
  if (cooldown) return; // Evitar múltiples clics durante el descanso

  audio.pause();
  console.log("Sonido detenido. Descanso de 10 segundos.");
  cooldown = true;

  // Configurar un descanso de 10 segundos antes de reiniciar
  setTimeout(() => {
    cooldown = false;
    if (userInteracted) {
      console.log("Descanso finalizado. Reanudando sonido.");
      audio.play().then(() => console.log("Reproduciendo sonido en bucle..."));
    }
  }, 10000); // 10 segundos
});
