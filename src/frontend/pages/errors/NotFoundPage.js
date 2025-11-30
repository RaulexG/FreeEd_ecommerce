// src/frontend/pages/errors/NotFoundPage.js
import { renderPage } from "../../layout/basepage.js";

export function renderNotFoundPage() {
  const content = `
    <div class="text-center py-20">
      <h1 class="text-6xl font-bold text-indigo-600">404</h1>
      <p class="text-lg text-slate-600 mt-4">La página que buscas no existe.</p>

      <a href="/" class="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Volver al inicio
      </a>
    </div>
  `;

  return renderPage({
    title: "FreeEd · Página no encontrada",
    content,
  });
}
