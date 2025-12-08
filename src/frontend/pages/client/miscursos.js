// src/frontend/pages/client/miscursos.js
import { renderPage } from "../../layout/basepage.js";

export function renderMisCursosPage() {
  const content = `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-1">
            Mi aprendizaje
          </p>
          <h1 class="text-2xl font-bold text-slate-900">Mis cursos</h1>
          <p class="text-sm text-slate-500 mt-1">
            Aquí se muestran los cursos de los pedidos que has confirmado desde tu carrito.
          </p>
        </div>
      </header>

      <div id="miscursos-root" class="space-y-4">
        <div class="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
          Cargando tus cursos...
        </div>
      </div>
    </section>

    <script>
      (function () {
        const TOKEN_KEY    = "freeed:token";
        const USER_KEY     = "freeed:user";
        const LEARNING_KEY = "freeed:learning";

        const root = document.getElementById("miscursos-root");

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        const token = localStorage.getItem(TOKEN_KEY);
        let user = null;
        try { user = JSON.parse(localStorage.getItem(USER_KEY)); } catch (_) {}

        if (!token || !user) {
          redirectToLogin();
          return;
        }

        // Solo clientes
        if (user.rol !== "CLIENTE") {
          window.location.href = "/";
          return;
        }

        function loadLearning() {
          try {
            const raw  = localStorage.getItem(LEARNING_KEY) || "[]";
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
          } catch (_) {
            return [];
          }
        }

        function formatDate(iso) {
          if (!iso) return "-";
          try {
            const d = new Date(iso);
            return d.toLocaleDateString("es-MX", {
              year: "numeric",
              month: "short",
              day: "2-digit"
            });
          } catch {
            return iso;
          }
        }

        function render() {
          const learning = loadLearning();

          if (!learning.length) {
            root.innerHTML = \`
              <div class="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                <p class="text-sm font-medium text-slate-800">Aún no tienes cursos registrados</p>
                <p class="text-sm text-slate-500">
                  Cuando confirmes una compra desde el carrito, tus cursos aparecerán aquí.
                </p>
                <a href="/" class="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700">
                  Explorar cursos
                </a>
              </div>
            \`;
            return;
          }

          // Aplanar todos los cursos de todos los pedidos
          const courseMap = new Map(); // para evitar duplicados por pedido/curso
          learning.forEach(entry => {
            const pedido   = entry.pedido   || {};
            const detalles = Array.isArray(entry.detalles) ? entry.detalles : [];

            detalles.forEach(d => {
              const key = \`\${pedido.id || "p"}-\${d.curso_id || d.cursoId || d.id}\`;
              if (!courseMap.has(key)) {
                courseMap.set(key, {
                  pedidoId:    pedido.id,
                  fecha:       pedido.created_at || pedido.createdAt,
                  titulo:      d.curso_titulo || d.cursoTitulo || ("Curso #" + (d.curso_id || d.cursoId || d.id)),
                  portada:     d.curso_portada || d.cursoPortada || "https://via.placeholder.com/600x360?text=FreeEd+Curso",
                  nivel:       d.curso_nivel || d.cursoNivel || "-",
                  precio:      d.precio_unitario ?? d.precioUnitario ?? 0
                });
              }
            });
          });

          const courses = Array.from(courseMap.values());
          const totalPedidos = learning.length;
          const totalCursos  = courses.length;

          const cards = courses.map(c => \`
            <article class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div class="h-40 overflow-hidden bg-slate-100">
                <img
                  src="\${c.portada}"
                  alt="Portada del curso"
                  class="w-full h-full object-cover"
                  onerror="this.src='https://via.placeholder.com/600x360?text=FreeEd+Curso';"
                />
              </div>

              <div class="p-4 flex-1 flex flex-col">
                <p class="text-[11px] text-indigo-600 font-medium mb-1">
                  Nivel \${c.nivel}
                </p>
                <h3 class="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
                  \${c.titulo}
                </h3>

                <p class="text-xs text-slate-500 mb-3">
                  Pedido #\${c.pedidoId || "-"} · \${formatDate(c.fecha)}
                </p>

                <div class="mt-auto flex items-center justify-between">
                  <span class="text-sm font-semibold text-slate-900">
                    \$ \${Number(c.precio || 0).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    class="px-3 py-1.5 text-xs rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Ver curso
                  </button>
                </div>
              </div>
            </article>
          \`).join("");

          root.innerHTML = \`
            <section class="space-y-4">
              <div class="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <p class="font-medium text-slate-800">Resumen de tu aprendizaje</p>
                  <p class="text-xs text-slate-500 mt-0.5">
                    \${totalCursos} curso(s) en \${totalPedidos} pedido(s) completados.
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <div class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Acceso permanente (proyecto académico)
                  </div>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                \${cards}
              </div>
            </section>
          \`;
        }

        render();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd · Mis cursos",
    content,
  });
}
