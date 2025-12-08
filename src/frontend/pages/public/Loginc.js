// src/frontend/pages/public/Loginc.js
import { renderPage } from "../../layout/basepage.js";

export function renderLoginPage() {
  const content = `
    <section class="max-w-md mx-auto mt-10 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h1 class="text-xl font-semibold text-slate-800 mb-1">Accede a tu cuenta</h1>
      <p class="text-sm text-slate-500 mb-6">
        Ingresa con tu correo y contraseña para continuar aprendiendo.
      </p>

      <form id="login-form" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1" for="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            class="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1" for="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          class="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-md"
        >
          Acceder
        </button>
      </form>

      <p class="mt-4 text-xs text-slate-500 text-center">
        ¿No tienes cuenta?
        <a href="/registro" class="text-indigo-600 hover:underline font-medium">
          Regístrate aquí
        </a>
      </p>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const USER_KEY  = "freeed:user";

        const form = document.getElementById("login-form");
        if (!form) return;

        form.addEventListener("submit", async function (ev) {
          ev.preventDefault();

          const email = form.email.value.trim();
          const password = form.password.value.trim();

          if (!email || !password) {
            Swal.fire({
              icon: "warning",
              title: "Campos incompletos",
              text: "Por favor ingresa tu correo y contraseña.",
            });
            return;
          }

          try {
            const resp = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            if (!resp.ok) {
              const errorData = await resp.json().catch(() => ({}));
              const msg = errorData?.message || "Credenciales inválidas.";
              Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: msg,
              });
              return;
            }

            const data = await resp.json();

            // Guardar token y usuario en localStorage
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));

            // Redirección según rol
            if (data.user && data.user.rol === "ADMIN") {
              // 👉 Admin directamente al panel
              window.location.href = "/admin";
            } else {
              // 👉 Cliente: por ahora al home público (más adelante /client/inicio)
              window.location.href = "/";
            }
          } catch (err) {
            console.error("Error en login:", err);
            Swal.fire({
              icon: "error",
              title: "Error inesperado",
              text: "Ocurrió un error al iniciar sesión. Intenta de nuevo.",
            });
          }
        });
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd | Acceder",
    content,
  });
}
