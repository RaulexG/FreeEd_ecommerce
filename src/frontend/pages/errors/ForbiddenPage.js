// src/frontend/pages/errors/ForbiddenPage.js
import { renderPage } from "../../layout/basepage.js";

export function renderForbiddenPage() {
  const content = `
    <div class="text-center py-20">
      <h1 class="text-6xl font-bold text-rose-600">403</h1>
      <p class="text-lg text-slate-600 mt-4">
        No tienes permiso para acceder a esta sección.
      </p>

      <a href="/" class="mt-6 inline-block px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700">
        Volver al inicio
      </a>
    </div>
  `;

  return renderPage({
    title: "FreeEd · Acceso denegado",
    content,
  });
}
