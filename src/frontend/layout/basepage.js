// src/frontend/layout/basepage.js

export function renderPage({ title = "FreeEd", content = "" }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/static/icono.png" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <style>
    body { font-family: 'Inter', sans-serif; }
    .nav-icon-btn:hover { opacity: .75; }
  </style>
</head>

<body class="bg-slate-50 min-h-screen flex flex-col">

  <!-- ========================= NAVBAR ========================= -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">

      <!-- LEFT: LOGO -->
      <a href="/" class="flex items-center gap-2">
        <img src="/static/logo.png" class="h-7" alt="FreeEd" />
      </a>

      <!-- CENTER: SEARCH BAR -->
      <div class="hidden md:flex flex-1 mx-8">
        <div class="flex items-center bg-slate-100 w-full px-3 py-2 rounded-full shadow-inner">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            placeholder="¿Qué quieres aprender hoy?"
            class="bg-transparent flex-1 outline-none px-2 text-sm"
          />
        </div>
      </div>

      <!-- RIGHT: NAV ACTIONS -->
      <div id="navbar-right" class="flex items-center gap-4 text-sm"></div>

    </nav>

    <div class="bg-white border-t border-slate-200" id="navbar-categories"></div>
  </header>


  <!-- ===================== MAIN CONTENT ===================== -->
  <main class="flex-1">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      ${content}
    </div>
  </main>


  <!-- ========================= FOOTER ========================= -->
  <footer class="bg-white border-t border-slate-200 mt-10 py-5">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 text-xs text-slate-500 flex justify-between">
      <span>© ${new Date().getFullYear()} FreeEd · Proyecto académico E-Business.</span>
      <span>Desarrollado por Raúl Chavira Narváez.</span>
    </div>
  </footer>


  <!-- ========================= NAVBAR SCRIPT ========================= -->
  <script>
    (function () {
      const TOKEN_KEY = "freeed:token";
      const USER_KEY  = "freeed:user";

      const navbarRight = document.getElementById("navbar-right");
      const categoryBar = document.getElementById("navbar-categories");

      const token = localStorage.getItem(TOKEN_KEY);
      let user = null;

      try {
        user = JSON.parse(localStorage.getItem(USER_KEY));
      } catch (_) {}

      if (categoryBar) {
        categoryBar.innerHTML = "";
      }

      // ===========================
      // SIN SESIÓN
      // ===========================
      if (!token || !user) {
        if (navbarRight) {
          navbarRight.innerHTML = \`
            <a href="/login" class="text-slate-700 hover:text-indigo-600 font-medium">
              Acceder
            </a>
          \`;
        }
        return;
      }

      // ===========================
      // CON SESIÓN (CLIENTE / ADMIN)
      // ===========================
      const isAdmin = user?.rol === "ADMIN";
      const nombre  = (user?.nombre || "Perfil").split(" ")[0];

      const adminLink = isAdmin
        ? '<a href="/admin" class="text-slate-700 hover:text-indigo-600 font-medium">Panel Admin</a>'
        : "";

      if (navbarRight) {
        navbarRight.innerHTML = \`
          \${adminLink}

          <!-- Carrito -->
          <button id="btn-cart" class="relative nav-icon-btn">
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
            </svg>
            <span id="navbar-cart-count"
                  class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-1">
              0
            </span>
          </button>

          <!-- Perfil -->
          <div class="relative">
            <button id="btn-profile"
              class="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
              \${nombre.charAt(0).toUpperCase()}
            </button>

            <div id="profile-menu"
              class="hidden absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40 border border-slate-100">
              <div class="px-4 py-2 text-xs text-slate-500">\${user.email || ""}</div>
              <a href="/client/miscursos" class="block px-4 py-2 hover:bg-slate-100 text-sm">Mi aprendizaje</a>
              <a href="/client/perfil" class="block px-4 py-2 hover:bg-slate-100 text-sm">Mi perfil</a>
              <button id="logout-btn"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">
                Cerrar sesión
              </button>
            </div>
          </div>
        \`;
      }

      const profileBtn  = document.getElementById("btn-profile");
      const profileMenu = document.getElementById("profile-menu");
      const logoutBtn   = document.getElementById("logout-btn");
      const btnCart     = document.getElementById("btn-cart");

      if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", () => {
          profileMenu.classList.toggle("hidden");
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/";
        });
      }

      if (btnCart) {
        btnCart.addEventListener("click", () => {
          window.location.href = "/client/carrito";
        });
      }

      // ===========================
      // SINCRONIZAR BADGE DESDE API
      // ===========================
      async function syncCartBadge() {
        const badge = document.getElementById("navbar-cart-count");
        if (!badge || !token) return;

        try {
          const resp = await fetch("/api/carrito", {
            headers: {
              "Accept": "application/json",
              "Authorization": "Bearer " + token
            }
          });

          if (!resp.ok) {
            console.error("No se pudo obtener carrito (badge):", resp.status);
            return;
          }

          const data = await resp.json();
          const detalles = data.detalles || [];
          badge.textContent = detalles.length || 0;
        } catch (e) {
          console.error("Error al sincronizar badge de carrito:", e);
        }
      }

      // la dejamos accesible para otras páginas (home.js)
      window.freeedSyncCartBadge = syncCartBadge;

      // sincronizar al cargar
      syncCartBadge();
    })();
  </script>
</body>
</html>
`;
}
