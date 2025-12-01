// src/frontend/pages/admin/dashboard.js
import { renderPage } from "../../layout/basepage.js";

export function renderAdminDashboard() {
  const content = `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800">
            Panel de administración
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Gestiona categorías y cursos publicados en FreeEd.
          </p>
        </div>
      </header>

      <div class="grid gap-6 md:grid-cols-3">
        <a href="/admin/categorias" class="block p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition">
          <h2 class="font-semibold text-slate-800">Categorías</h2>
          <p class="text-xs text-slate-500 mt-2">
            Administrar categorias disponibles en la plataforma.
          </p>
        </a>

        <a href="/admin/cursos" class="block p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition">
          <h2 class="font-semibold text-slate-800">Cursos</h2>
          <p class="text-xs text-slate-500 mt-2">
            Administrar cursos disponibles en la plataforma.
          </p>
        </a>

        <div class="block p-4 bg-white rounded-lg shadow-sm border border-dashed border-slate-200">
          <h2 class="font-semibold text-slate-800">Próximamente</h2>
          <p class="text-xs text-slate-500 mt-2">
            panel de clientes
          </p>
        </div>
      </div>
    </section>
  `;

  return renderPage({
    title: "FreeEd · Admin",
    content,
  });
}
