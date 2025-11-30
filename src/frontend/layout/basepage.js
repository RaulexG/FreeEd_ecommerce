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
  <!-- NAVBAR -->
  <header class="bg-white shadow-sm">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="/static/logo.png" alt="FreeEd" class="h-8 w-auto" />
        <span class="font-semibold text-lg text-indigo-700 tracking-tight">
          FreeEd
        </span>
      </a>

      <div class="flex items-center gap-4 text-sm">
        <a href="/" class="text-slate-700 hover:text-indigo-600 font-medium">
          Inicio
        </a>
        <a href="/admin" class="text-slate-700 hover:text-indigo-600 font-medium">
          Admin
        </a>
        <a href="/login" class="px-3 py-1.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium">
          Iniciar sesión
        </a>
        <a href="/registro" class="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
          Registrarse
        </a>
      </div>
    </nav>
  </header>

  <!-- BANNER (opcional, se usa el logo_banner) -->
  <div class="bg-indigo-50 border-b border-indigo-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
      <img src="/static/logo_banner.png" alt="FreeEd banner" class="h-8 w-auto hidden sm:block" />
      <p class="text-xs sm:text-sm text-slate-700">
        FreeEd · Plataforma de cursos digitales creados por estudiantes.
      </p>
    </div>
  </div>

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
</body>
</html>
`;
}
