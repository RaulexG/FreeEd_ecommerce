// src/frontend/pages/admin/categoria.js
import { renderPage } from "../../layout/basepage.js";

export function renderCategoriasPage() {
  const content = `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800">
            Categorías de cursos
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Administra las categorías que organizan los cursos de FreeEd.
          </p>
        </div>
      </header>

      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="font-semibold text-slate-800 text-sm">Listado de categorías</h2>
          <button
            class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Nueva categoría
          </button>
        </div>

        <!-- Aquí después se inyectará la tabla real con fetch a la API -->
        <div class="border border-dashed border-slate-300 rounded-md p-6 text-center text-sm text-slate-500">
          Aquí se mostrará la tabla de categorías conectada al backend
          (<span class="font-mono text-xs">/api/categorias</span>).
        </div>
      </div>
    </section>
  `;

  return renderPage({
    title: "FreeEd · Admin categorías",
    content,
  });
}
