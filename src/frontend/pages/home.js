// src/frontend/pages/home.js
import { renderPage } from "../layout/basepage.js";

export function renderHomePage() {
  const content = `
    <section class="mt-10 text-center">
      <h1 class="text-4xl font-bold text-indigo-600 mb-4">
        Bienvenido a FreeEd
      </h1>

      <p class="text-gray-700 text-lg max-w-xl mx-auto mb-10">
        FreeEd impulsa a los estudiantes a convertir su conocimiento en cursos digitales únicos, prácticos y actuales. Una nueva manera de aprender a partir de experiencias reales.
      </p>

      <div class="flex justify-center gap-4">
        <a 
          href="/registro" 
          class="px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition">
          Crear mi cuenta
        </a>

        <a 
          href="/login" 
          class="px-5 py-2 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition">
          Iniciar sesión
        </a>
      </div>
    </section>
  `;

  return renderPage({
    title: "FreeEd | Inicio",
    content,
  });
}
