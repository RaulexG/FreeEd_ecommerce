// src/frontend/pages/admin/dashboard.js
import { renderAdminPage } from "../../layout/adminLayout.js";

export function renderAdminDashboard() {
  const content = `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">
            Resumen general
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            Estado actual de cursos, categorías, clientes y pedidos en FreeEd.
          </p>
        </div>
      </header>

      <!-- KPIs principales -->
      <div class="grid gap-4 md:grid-cols-4">
        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p class="text-xs text-slate-500">Cursos publicados</p>
          <p id="kpi-cursos" class="mt-2 text-2xl font-semibold text-slate-800">-</p>
          <p class="mt-1 text-[11px] text-slate-400">
            Total de cursos registrados en la plataforma.
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p class="text-xs text-slate-500">Categorías</p>
          <p id="kpi-categorias" class="mt-2 text-2xl font-semibold text-slate-800">-</p>
          <p class="mt-1 text-[11px] text-slate-400">
            Agrupaciones disponibles para organizar los cursos.
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p class="text-xs text-slate-500">Clientes</p>
          <p id="kpi-clientes" class="mt-2 text-2xl font-semibold text-slate-800">-</p>
          <p class="mt-1 text-[11px] text-slate-400">
            Usuarios registrados en FreeEd.
          </p>
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <p class="text-xs text-slate-500">Pedidos totales</p>
          <p id="kpi-pedidos" class="mt-2 text-2xl font-semibold text-slate-800">-</p>
          <p class="mt-1 text-[11px] text-slate-400">
            Pedidos generados a partir de carritos confirmados.
          </p>
        </div>
      </div>

      <!-- Pedidos e ingresos -->
      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-800">
            Estado de pedidos
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Resumen de los pedidos confirmados en la plataforma.
          </p>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Pedidos completados</span>
              <span id="kpi-pedidos-completados" class="font-semibold text-slate-800">-</span>
            </div>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-800">
            Ingresos estimados
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Suma del total de los pedidos marcados como completados.
          </p>

          <div class="mt-4">
            <p id="kpi-ingresos"
               class="text-2xl font-semibold text-emerald-600 tracking-tight">
              $ -
            </p>
            <p class="mt-1 text-[11px] text-slate-400">
              Monto calculado directamente desde los pedidos almacenados en la base de datos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";

        function getHeaders() {
          const token = localStorage.getItem(TOKEN_KEY);
          if (!token) return { Accept: "application/json" };
          return {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          };
        }

        async function safeFetch(url) {
          const resp = await fetch(url, { headers: getHeaders() });
          if (!resp.ok) return null;
          return resp.json();
        }

        async function loadDashboard() {
          const [cursos, categorias, clientes, pedidos] = await Promise.all([
            safeFetch("/api/cursos"),
            safeFetch("/api/categorias"),
            safeFetch("/api/clientes"),
            safeFetch("/api/pedidos"),
          ]);

          const elCursos = document.getElementById("kpi-cursos");
          const elCategorias = document.getElementById("kpi-categorias");
          const elClientes = document.getElementById("kpi-clientes");
          const elPedidos = document.getElementById("kpi-pedidos");
          const elPedidosCompletados = document.getElementById("kpi-pedidos-completados");
          const elIngresos = document.getElementById("kpi-ingresos");

          const totalCursos = Array.isArray(cursos) ? cursos.length : 0;
          const totalCategorias = Array.isArray(categorias) ? categorias.length : 0;
          const totalClientes = Array.isArray(clientes) ? clientes.length : 0;

          let totalPedidos = 0;
          let totalCompletados = 0;
          let totalIngresos = 0;

          if (Array.isArray(pedidos)) {
            totalPedidos = pedidos.length;
            pedidos.forEach((p) => {
              const estado = String(p.estado || "").toUpperCase();
              if (estado === "COMPLETADO") {
                totalCompletados += 1;
                totalIngresos += Number(p.total || 0);
              }
            });
          }

          if (elCursos) elCursos.textContent = totalCursos;
          if (elCategorias) elCategorias.textContent = totalCategorias;
          if (elClientes) elClientes.textContent = totalClientes;
          if (elPedidos) elPedidos.textContent = totalPedidos;
          if (elPedidosCompletados) elPedidosCompletados.textContent = totalCompletados;
          if (elIngresos) elIngresos.textContent = "$ " + totalIngresos.toFixed(2);
        }

        loadDashboard().catch((err) => {
          console.error("Error cargando resumen admin:", err);
        });
      })();
    </script>
  `;

  return renderAdminPage({
    title: "FreeEd · Panel administrativo",
    pageTitle: "Panel administrativo",
    active: "resumen",
    content,
  });
}
