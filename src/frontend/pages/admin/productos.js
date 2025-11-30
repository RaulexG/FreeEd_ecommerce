// src/frontend/pages/admin/productos.js
import { renderPage } from "../../layout/basepage.js";

export function renderCursosPage() {
  const content = `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800">
            Cursos
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Crea y administra los cursos digitales publicados en FreeEd.
          </p>
        </div>
      </header>

      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="font-semibold text-slate-800 text-sm">Listado de cursos</h2>
          <button
            class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Nuevo curso
          </button>
        </div>

        <!-- Futuro: tabla de cursos desde /api/cursos -->
        <div class="border border-dashed border-slate-300 rounded-md p-6 text-center text-sm text-slate-500">
          Aquí se mostrará la tabla de cursos conectada al backend
          (<span class="font-mono text-xs">/api/cursos</span>).
        </div>
      </div>
    </section>
  `;

  return renderPage({
    title: "FreeEd · Admin cursos",
    content,
  });
}
