// src/frontend/pages/Loginc.js
import { renderPage } from "../layout/basepage.js";

export function renderLoginPage() {
  const content = `
    <section class="mt-10 flex justify-center">
      <div class="w-full max-w-md bg-white rounded-xl shadow-md px-6 py-6">
        <h1 class="text-2xl font-bold text-center text-indigo-600 mb-2">
          Iniciar sesión
        </h1>
        <p class="text-sm text-gray-600 text-center mb-6">
          Accede a tu cuenta de FreeEd para continuar.
        </p>

        <form id="loginForm" class="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          <p id="loginMessage" class="text-sm mt-1"></p>

          <button
            type="submit"
            class="w-full mt-2 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>

    <script>
      (function () {
        const form = document.getElementById("loginForm");
        const msg  = document.getElementById("loginMessage");
        if (!form || !msg) return;

        form.addEventListener("submit", async function (e) {
          e.preventDefault();
          msg.textContent = "Verificando credenciales...";
          msg.className = "text-sm mt-1 text-gray-600";

          const formData = new FormData(form);
          const body = {
            email: formData.get("email"),
            password: formData.get("password"),
          };

          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            if (!res.ok) {
              let errorText = "Credenciales inválidas";
              try {
                const dataErr = await res.json();
                if (dataErr && dataErr.message) errorText = dataErr.message;
              } catch (_) {}
              throw new Error(errorText);
            }

            const data = await res.json();

            // Guardar token y nombre de usuario en localStorage
            if (data && data.token) {
              localStorage.setItem("freeed_token", data.token);
            }
            if (data && data.user && data.user.nombre) {
              localStorage.setItem("freeed_user_name", data.user.nombre);
            }

            msg.textContent = "Inicio de sesión correcto. Redirigiendo...";
            msg.className = "text-sm mt-1 text-green-600";

            setTimeout(function () {
              window.location.href = "/";
            }, 800);
          } catch (err) {
            msg.textContent = err.message || "Ocurrió un error al iniciar sesión";
            msg.className = "text-sm mt-1 text-red-600";
          }
        });
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd | Login",
    content,
  });
}
