// src/frontend/layout/adminLayout.js

function buildSidebarItemClass(active, key) {
    return [
      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition",
      key === active
        ? "bg-slate-900 text-white"
        : "text-slate-200 hover:bg-slate-800",
    ].join(" ");
  }
  
  export function renderAdminLayout({
    title = "FreeEd · Panel Administrativo",
    pageTitle = "",
    active = "resumen", // resumen | cursos | categorias | clientes | pedidos
    content = "",
  } = {}) {
    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  
    <link rel="icon" type="image/png" href="/static/icono.png" />
  
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
  
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
    <!-- Fuente -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    >
  
    <style>
      body { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    </style>
  </head>
  
  <body class="bg-slate-100 min-h-screen">
    <div class="flex min-h-screen">
      <!-- SIDEBAR -->
      <aside class="w-60 bg-slate-950 text-slate-100 flex flex-col">
        <div class="h-16 flex items-center px-4 border-b border-slate-800">
          <a href="/admin" class="flex items-center gap-2">
            <img src="/static/logo.png" alt="FreeEd" class="h-7 w-auto opacity-90" />
            <div class="flex flex-col leading-tight">
              <span class="text-sm font-semibold">FreeEd Admin</span>
              <span class="text-[11px] text-slate-400">Panel administrativo</span>
            </div>
          </a>
        </div>
  
        <nav class="flex-1 px-3 py-4 space-y-1 text-xs">
          <!-- Resumen -->
          <a href="/admin" class="${buildSidebarItemClass(active, "resumen")}">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <!-- Icono: gráfico de barras -->
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 20h16" />
                <rect x="6" y="10" width="3" height="6" rx="1" />
                <rect x="11" y="6" width="3" height="10" rx="1" />
                <rect x="16" y="12" width="3" height="4" rx="1" />
              </svg>
            </span>
            <span>Resumen</span>
          </a>
  
          <!-- Cursos -->
          <a href="/admin/cursos" class="${buildSidebarItemClass(active, "cursos")}">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <!-- Icono: libro abierto -->
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5h7a3 3 0 0 1 3 3v11H6a3 3 0 0 1-3-3V5z" />
                <path d="M21 5h-7a3 3 0 0 0-3 3v11h7a3 3 0 0 0 3-3V5z" />
              </svg>
            </span>
            <span>Cursos</span>
          </a>
  
          <!-- Categorías -->
          <a href="/admin/categorias" class="${buildSidebarItemClass(active, "categorias")}">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <!-- Icono: cuadrícula -->
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <rect x="13" y="4" width="7" height="7" rx="1" />
                <rect x="4" y="13" width="7" height="7" rx="1" />
                <rect x="13" y="13" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span>Categorías</span>
          </a>
  
          <!-- Clientes -->
          <a href="/admin/clientes" class="${buildSidebarItemClass(active, "clientes")}">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <!-- Icono: usuarios -->
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="3" />
                <path d="M4 20a5 5 0 0 1 10 0" />
                <path d="M14 20a4 4 0 0 1 8 0" />
              </svg>
            </span>
            <span>Clientes</span>
          </a>
  
          <!-- Pedidos -->
          <a href="/admin/pedidos" class="${buildSidebarItemClass(active, "pedidos")}">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900">
              <!-- Icono: recibo -->
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-100" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
                <path d="M9 7h6" />
                <path d="M9 11h6" />
                <path d="M9 15h4" />
              </svg>
            </span>
            <span>Pedidos</span>
          </a>
        </nav>
  
        <div class="px-4 py-4 border-t border-slate-800 text-[11px]">
          <div id="admin-user-info" class="mb-2 text-slate-300">
            Administrador
          </div>
          <button
            id="admin-logout"
            class="w-full px-3 py-2 rounded-md bg-red-500/90 hover:bg-red-600 text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 176v-40a40 40 0 0 0-40-40H88a40 40 0 0 0-40 40v240a40 40 0 0 0 40 40h192a40 40 0 0 0 40-40v-40m64-160l80 80l-80 80m-193-80h273"/></svg></span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
  
      <!-- MAIN AREA -->
      <div class="flex-1 flex flex-col">
        <!-- TOPBAR -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 class="text-lg font-semibold text-slate-800">
              ${pageTitle || "Panel de Control"}
            </h1>
            <p class="text-xs text-slate-500">
              Administración de cursos, clientes y pedidos en FreeEd.
            </p>
          </div>
  
          <div class="flex items-center gap-3 text-xs">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              Sistema operativo
            </span>
          </div>
        </header>
  
        <!-- CONTENT -->
        <main class="flex-1 overflow-y-auto bg-slate-50">
          <div class="max-w-6xl mx-auto px-6 py-6">
            ${content}
          </div>
        </main>
  
        <!-- FOOTER -->
        <footer class="h-10 border-t border-slate-200 bg-white">
          <div class="max-w-6xl mx-auto h-full flex items-center justify-between px-6 text-[11px] text-slate-500">
            <span>© ${new Date().getFullYear()} FreeEd · Panel Administrativo.</span>
            <span>Desarrollado para proyecto E-Business.</span>
          </div>
        </footer>
      </div>
    </div>
  
    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const USER_KEY = "freeed:user";
  
        function getUser() {
          try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
          } catch (_) {
            return null;
          }
        }
  
        const user = getUser();
  
        // Si no hay usuario o no es ADMIN, redirige
        if (!user || user.rol !== "ADMIN") {
          window.location.href = "/forbidden";
          return;
        }
  
        const info = document.getElementById("admin-user-info");
        if (info) {
          const nombre = user.nombre || "Administrador";
          const email = user.email || "";
          info.innerHTML = \`
            <div class="font-semibold text-[12px]">\${nombre}</div>
            <div class="text-slate-400 text-[11px]">\${email}</div>
          \`;
        }
  
        const btnLogout = document.getElementById("admin-logout");
        if (btnLogout) {
          btnLogout.addEventListener("click", function () {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = "/login";
          });
        }
      })();
    </script>
  </body>
  </html>
  `;
  }  

  export function renderAdminPage(options) {
    return renderAdminLayout(options);
  }
  