// src/frontend/pages/client/perfil.js
import { renderPage } from "../../layout/basepage.js";

export function renderPerfilPage() {
  const content = `
    <section class="space-y-6">
      <!-- Encabezado -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Mi perfil</h1>
          <p class="text-sm text-slate-500">
            Revisa tus datos de cuenta en FreeEd.
          </p>
        </div>
      </header>

      <!-- Tarjeta de datos -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-w-xl">
        <h2 class="text-sm font-semibold text-slate-700 mb-4">
          Información de la cuenta
        </h2>

        <div class="space-y-4 text-sm">
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">
              Nombre
            </label>
            <div
              id="perfil-nombre"
              class="px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-800"
            >
              —
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">
              Correo electrónico
            </label>
            <div
              id="perfil-email"
              class="px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-800"
            >
              —
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">
                Rol
              </label>
              <div
                id="perfil-rol"
                class="px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-800 uppercase text-[11px] tracking-wide"
              >
                —
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">
                Estado
              </label>
              <div
                id="perfil-activo"
                class="inline-flex items-center px-3 py-2 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-medium"
              >
                —
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta de seguridad / sesión -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-w-xl">
        <h2 class="text-sm font-semibold text-slate-700 mb-3">
          Seguridad y sesión
        </h2>

        <p class="text-xs text-slate-500 mb-4">
          Por ahora, desde esta sección solo puedes cerrar tu sesión actual.
        </p>

        <button
          id="perfil-logout"
          class="inline-flex items-center px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700"
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const USER_KEY  = "freeed:user";
        const CART_KEY  = "freeed:cart";

        const token = localStorage.getItem(TOKEN_KEY);
        let user = null;

        try {
          user = JSON.parse(localStorage.getItem(USER_KEY));
        } catch (_) {
          user = null;
        }

        // Si no hay sesión, redirigimos a login
        if (!token || !user) {
          window.location.href = "/login";
          return;
        }

        // Referencias a elementos
        const elNombre = document.getElementById("perfil-nombre");
        const elEmail  = document.getElementById("perfil-email");
        const elRol    = document.getElementById("perfil-rol");
        const elActivo = document.getElementById("perfil-activo");
        const btnLogout = document.getElementById("perfil-logout");

        // Pintamos datos del usuario desde localStorage
        if (elNombre) elNombre.textContent = user.nombre || "—";
        if (elEmail)  elEmail.textContent  = user.email || "—";
        if (elRol)    elRol.textContent    = (user.rol || "CLIENTE").toUpperCase();

        if (elActivo) {
          const activo = user.activo !== false; // por defecto true
          elActivo.textContent = activo ? "Cuenta activa" : "Cuenta inactiva";
          elActivo.className =
            "inline-flex items-center px-3 py-2 rounded-md border text-xs font-medium " +
            (activo
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-500");
        }

        // Cerrar sesión
        if (btnLogout) {
          btnLogout.addEventListener("click", function () {
            if (window.Swal) {
              Swal.fire({
                icon: "warning",
                title: "Cerrar sesión",
                text: "¿Seguro que quieres salir de FreeEd?",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#e11d48"
              }).then((res) => {
                if (!res.isConfirmed) return;

                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem(CART_KEY);
                window.location.href = "/";
              });
            } else {
              // Fallback sin SweetAlert
              if (confirm("¿Seguro que quieres cerrar sesión?")) {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem(CART_KEY);
                window.location.href = "/";
              }
            }
          });
        }
      })();
    </script>
  `;
  return renderPage({
    title: "FreeEd · Mi perfil",
    content,
  });
}
