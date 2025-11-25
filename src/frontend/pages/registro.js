// src/frontend/pages/registro.js
import { renderPage } from "../layout/basepage.js";

export function renderRegistroPage() {
  const content = `
    <section class="mt-10 flex justify-center">
      <div class="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-6">
        <h1 class="text-2xl font-bold text-center text-indigo-600 mb-2">
          Crear cuenta
        </h1>
        <p class="text-sm text-gray-600 text-center mb-6">
          Regístrate en FreeEd para poder comprar cursos creados por estudiantes.
        </p>

        <form id="registerForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              minlength="8"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <p id="registerMessage" class="text-sm mt-1"></p>

          <button
            type="submit"
            class="w-full mt-2 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </section>

    <script>
      (function () {
        const form = document.getElementById("registerForm");
        const msg  = document.getElementById("registerMessage");
        if (!form || !msg) return;

        form.addEventListener("submit", async function (e) {
          e.preventDefault();
          msg.textContent = "Creando cuenta...";
          msg.className = "text-sm mt-1 text-gray-600";

          const formData = new FormData(form);
          const body = {
            nombre: formData.get("nombre"),
            email: formData.get("email"),
            password: formData.get("password"),
          };

          try {
            const res = await fetch("/api/clientes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            if (!res.ok) {
              let errorText = "No se pudo crear la cuenta";
              try {
                const dataErr = await res.json();
                if (dataErr && dataErr.message) errorText = dataErr.message;
              } catch (_) {}
              throw new Error(errorText);
            }

            msg.textContent = "Cuenta creada correctamente. Redirigiendo al login...";
            msg.className = "text-sm mt-1 text-green-600";

            setTimeout(function () {
              window.location.href = "/login";
            }, 900);
          } catch (err) {
            msg.textContent = err.message || "Ocurrió un error al registrarte";
            msg.className = "text-sm mt-1 text-red-600";
          }
        });
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd | Registro",
    content,
  });
}
