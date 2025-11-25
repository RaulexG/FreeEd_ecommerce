// src/frontend/layout/basepage.js

export function renderPage({ title = "FreeEd", content = "" }) {
    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
  
        <!-- Tailwind CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
  
        <!-- Fuente  para mejor diseño -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        
        <style>
          body { font-family: 'Inter', sans-serif; }
        </style>
      </head>
  
      <body class="bg-gray-100 min-h-screen flex flex-col">
  
        <!-- NAVBAR -->
        <nav class="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <a href="/" class="text-2xl font-bold text-indigo-600">
            FreeEd
          </a>
  
          <div id="nav-right" class="flex items-center gap-5 text-sm">
            <!-- Aquí se insertan los botones dinámicamente -->
          </div>
        </nav>
  
        <!-- MAIN CONTENT -->
        <main class="flex-1 w-full max-w-4xl mx-auto p-6">
          ${content}
        </main>
  
        <!-- FOOTER -->
        <footer class="text-center text-xs py-4 text-gray-500">
          © ${new Date().getFullYear()} FreeEd — Todos los derechos reservados.
        </footer>
  
        <!-- SCRIPT DE SESIÓN -->
        <script>
          (function () {
            const navRight = document.getElementById("nav-right");
            if (!navRight) return;
  
            const token = localStorage.getItem("freeed_token");
            const name  = localStorage.getItem("freeed_user_name") || "Mi cuenta";
  
            if (token) {
              // Usuario logueado
              navRight.innerHTML = \`
                <a href="/" class="hover:text-indigo-500">Inicio</a>
                <span class="text-gray-600">Hola, \${name}</span>
  
                <button id="logoutBtn"
                  class="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">
                  Cerrar sesión
                </button>
              \`;
  
              document.getElementById("logoutBtn").onclick = () => {
                localStorage.removeItem("freeed_token");
                localStorage.removeItem("freeed_user_name");
                window.location.href = "/";
              };
  
            } else {
              // Usuario NO logueado
              navRight.innerHTML = \`
                <a href="/" class="hover:text-indigo-500">Inicio</a>
                <a href="/login" class="hover:text-indigo-500">Iniciar sesión</a>
                <a href="/registro"
                  class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition">
                  Registrarse
                </a>
              \`;
            }
          })();
        </script>
  
      </body>
    </html>
    `;
  }
  