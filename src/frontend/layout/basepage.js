// src/frontend/layout/basepage.js

export function renderPage({ title = "FreeEd", content = "" }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${title}</title>

  <link rel="icon" type="image/png" href="/static/icono.png" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>


  <!-- Fuente opcional -->
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

<body class="bg-slate-100 min-h-screen flex flex-col">
  <!-- NAVBAR ÚNICO -->
  <header class="bg-white border-b border-slate-200">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="/static/logo.png" alt="FreeEd" class="h-8 w-auto" />
        <span class="font-semibold text-lg text-indigo-700 tracking-tight">
          FreeEd
        </span>
      </a>

      <div id="navbar-right" class="flex items-center gap-4 text-sm">
        <!-- Versión por defecto (sin sesión) -->
        <a href="/" class="text-slate-700 hover:text-indigo-600 font-medium text-xs sm:text-sm">
          Inicio
        </a>
        <a href="/login" class="px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium text-xs">
          Iniciar sesión
        </a>
        <a href="/registro" class="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-xs">
          Registrarse
        </a>
      </div>
    </nav>
  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main class="flex-1">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      ${content}
    </div>
  </main>

  <!-- FOOTER -->
  <footer class="bg-white border-t border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
      <span>© ${new Date().getFullYear()} FreeEd · Proyecto académico E-Business.</span>
      <span>Desarrollado por Raúl Chavira Narváez.</span>
    </div>
  </footer>

  <!-- SCRIPT: Manejo de sesión en la barra -->
  <script>
    (function () {
      const TOKEN_KEY = "freeed:token";
      const USER_KEY = "freeed:user";

      function getUser() {
        try {
          const raw = localStorage.getItem(USER_KEY);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (_) {
          return null;
        }
      }

      const navbarRight = document.getElementById("navbar-right");
      if (!navbarRight) return;

      const token = localStorage.getItem(TOKEN_KEY);
      const user = getUser();

      // Si no hay sesión, dejamos los botones por defecto
      if (!token || !user) {
        navbarRight.innerHTML = \`
          <a href="/" class="text-slate-700 hover:text-indigo-600 font-medium text-xs sm:text-sm">
            Inicio
          </a>
          <a href="/login" class="px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium text-xs">
            Iniciar sesión
          </a>
          <a href="/registro" class="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-xs">
            Registrarse
          </a>
        \`;
        return;
      }

      const isAdmin = user.rol === "ADMIN";
      const nombre = user.nombre || user.email || "usuario";

      const adminLink = isAdmin
        ? \`<a href="/admin" class="text-slate-700 hover:text-indigo-600 font-medium text-xs sm:text-sm">Admin</a>\`
        : "";

      navbarRight.innerHTML = \`
        <a href="/" class="text-slate-700 hover:text-indigo-600 font-medium text-xs sm:text-sm">
          Inicio
        </a>
        \${adminLink}
        <span class="hidden sm:inline text-xs text-slate-600">
          Hola, <span class="font-semibold">\${nombre}</span>
        </span>
        <button
          id="btn-logout"
          class="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
        >
          Cerrar sesión
        </button>
      \`;

      const btn = document.getElementById("btn-logout");
      if (btn) {
        btn.addEventListener("click", function () {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/";
        });
      }
    })();
  </script>
</body>
</html>
`;
}
