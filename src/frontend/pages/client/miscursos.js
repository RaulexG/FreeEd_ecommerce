// src/frontend/pages/client/miscursos.js
import { renderPage } from "../../layout/basepage.js";

export function renderMisCursosPage() {
  const content = `
    <section class="space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-1">
            MI APRENDIZAJE
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
        const TOKEN_KEY = "freeed:token";
        const USER_KEY  = "freeed:user";

        const root = document.getElementById("miscursos-root");

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        // ================== VALIDAR SESIÓN ==================
        const token   = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);

        if (!token || !rawUser) {
          redirectToLogin();
          return;
        }

        let user = null;
        try {
          user = JSON.parse(rawUser);
        } catch {
          redirectToLogin();
          return;
        }

        // Solo CLIENTE puede ver esta página
        if (user.rol !== "CLIENTE") {
          window.location.href = "/";
          return;
        }

        // ================== HELPERS ==================
        async function fetchJson(url, options = {}) {
          const headers = {
            Accept: "application/json",
            ...(options.headers || {}),
            Authorization: "Bearer " + token,
          };

          const resp = await fetch(url, { ...options, headers });

          if (resp.status === 401) {
            redirectToLogin();
            throw new Error("No autorizado");
          }

          if (!resp.ok) {
            throw new Error("HTTP " + resp.status + " en " + url);
          }

          return resp.json();
        }

        function formatDate(iso) {
          if (!iso) return "-";
          try {
            const d = new Date(iso);
            return d.toLocaleDateString("es-MX", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });
          } catch {
            return iso;
          }
        }

        function renderCursos(learning) {
          if (!Array.isArray(learning) || !learning.length) {
            root.innerHTML = \`
              <div class="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                <p class="text-sm font-medium text-slate-800">
                  Aún no tienes cursos registrados
                </p>
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

          // learning = [ { pedido, detalles: [...] }, ... ]
          const courseMap = new Map();

          learning.forEach((entry) => {
            const pedido   = entry.pedido || entry || {};
            const detalles = Array.isArray(entry.detalles)
              ? entry.detalles
              : Array.isArray(pedido.detalles)
                ? pedido.detalles
                : [];

            detalles.forEach((d) => {
              const cursoId = d.curso_id ?? d.cursoId ?? d.id;
              if (!cursoId) return;

              // clave por id de curso para no duplicar
              const key = String(cursoId);

              if (!courseMap.has(key)) {
                courseMap.set(key, {
                  pedidoId: pedido.id,
                  fecha:    pedido.created_at || pedido.createdAt || pedido.fecha,
                  titulo:
                    d.curso_titulo ||
                    d.cursoTitulo ||
                    ("Curso #" + cursoId),
                  portada:
                    d.curso_portada ||
                    d.cursoPortada ||
                    "https://via.placeholder.com/600x360?text=FreeEd+Curso",
                  nivel:  d.curso_nivel || d.cursoNivel || "-",
                  precio: Number(d.precio_unitario ?? d.precioUnitario ?? 0),
                });
              }
            });
          });

          const courses      = Array.from(courseMap.values());
          const totalCursos  = courses.length;
          const totalPedidos = learning.length;

          const cards = courses.map((c) => \`
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
                    \$ \${c.precio.toFixed(2)}
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

        // ================== CARGA: /api/pedidos/mios ==================
        async function cargarMisCursos() {
          try {
            root.innerHTML = \`
              <div class="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                Cargando tus cursos...
              </div>
            \`;

            // 1) Pedidos SOLO del cliente actual
            const json = await fetchJson("/api/pedidos/mios");
            const pedidosBase = Array.isArray(json) ? json : (json.data ?? []);

            if (!pedidosBase.length) {
              renderCursos([]);
              return;
            }

            // 2) Por cada pedido, traer su detalle con /api/pedidos/mios/:id
            const learning = await Promise.all(
              pedidosBase.map(async (p) => {
                try {
                  const detalle = await fetchJson("/api/pedidos/mios/" + p.id);
                  const pedido   = detalle.pedido || detalle;
                  const detalles = detalle.detalles || pedido.detalles || [];
                  return { pedido, detalles };
                } catch (e) {
                  console.error("Error cargando pedido", p.id, e);
                  return { pedido: p, detalles: [] };
                }
              })
            );

            renderCursos(learning);
          } catch (err) {
            console.error("Error cargando mis cursos:", err);
            root.innerHTML = \`
              <div class="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-red-500">
                Ocurrió un error al cargar tus cursos.
              </div>
            \`;
          }
        }

        cargarMisCursos();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd · Mis cursos",
    content,
  });
}
