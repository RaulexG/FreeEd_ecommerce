// src/frontend/pages/Loginc.js
import { renderPage } from "../layout/basepage.js";

export function renderLoginPage() {
  const content = `
    <section class="max-w-md mx-auto bg-white shadow-sm rounded-xl p-8 mt-10">
      <h1 class="text-2xl font-semibold text-slate-800 mb-4 text-center">
        Iniciar sesión
      </h1>
      <p class="text-sm text-slate-600 mb-6 text-center">
        Accede a tu cuenta de FreeEd para administrar tus cursos y compras.
      </p>

      <form id="login-form" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minlength="8"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <button
          type="submit"
          class="w-full mt-2 inline-flex justify-center items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Iniciar sesión
        </button>

        <p id="login-message" class="mt-3 text-sm text-center"></p>
      </form>

      <p class="mt-6 text-xs text-slate-500 text-center">
        ¿Aún no tienes cuenta?
        <a href="/registro" class="text-indigo-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </section>

    <script>
      const TOKEN_KEY = "freeed:token";
      const USER_KEY  = "freeed:user";

      document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("login-form");
        const msg  = document.getElementById("login-message");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (msg) {
            msg.textContent = "";
            msg.className = "mt-3 text-sm text-center";
          }

          const body = {
            email: form.email.value,
            password: form.password.value
          };

          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });

            if (!res.ok) {
              let errorText = "Credenciales inválidas";
              try {
                const dataErr = await res.json();
                if (dataErr && dataErr.error && dataErr.error.message) {
                  errorText = dataErr.error.message;
                }
              } catch (_) {}
              throw new Error(errorText);
            }

            const data = await res.json();

            if (data && data.token && data.user) {
              // limpiar claves viejas
              localStorage.removeItem("freeed_token");
              localStorage.removeItem("freeed_user_name");

              localStorage.setItem(TOKEN_KEY, data.token);
              localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            }

            if (msg) {
              msg.textContent = "Inicio de sesión correcto. Redirigiendo...";
              msg.className = "mt-3 text-sm text-center text-emerald-600";
            }

            setTimeout(() => {
              window.location.href = "/";
            }, 800);
          } catch (err) {
            if (msg) {
              msg.textContent = err.message || "Error al iniciar sesión.";
              msg.className = "mt-3 text-sm text-center text-red-600";
            }
          }
        });
      });
    </script>
  `;

  return renderPage({
    title: "Iniciar sesión · FreeEd",
    content,
  });
}
