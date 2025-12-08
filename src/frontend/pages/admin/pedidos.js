// src/frontend/pages/admin/pedidos.js
import { renderAdminPage } from "../../layout/adminLayout.js";

export function renderPedidosPage() {
  const content = `
    <section class="space-y-4">
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-semibold text-slate-800 text-sm">Pedidos</h2>
            <p class="text-xs text-slate-500">
              Revisa y gestiona los pedidos realizados en FreeEd.
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border border-slate-200 rounded-md">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left"># Pedido</th>
                <th class="px-3 py-2 text-left">Cliente</th>
                <th class="px-3 py-2 text-left">Estado</th>
                <th class="px-3 py-2 text-right">Total (MXN)</th>
                <th class="px-3 py-2 text-left">Fecha</th>
                <th class="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody id="pedidos-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="6" class="text-center py-4 text-slate-400">
                  Cargando pedidos...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const USER_KEY = "freeed:user";
        const ESTADOS = ["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO", "CARRITO"];

        const tbody = document.getElementById("pedidos-body");

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        const token = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);

        if (!token || !rawUser) {
          redirectToLogin();
          return;
        }

        let user;
        try {
          user = JSON.parse(rawUser);
        } catch {
          redirectToLogin();
          return;
        }

        if (user.rol !== "ADMIN") {
          window.location.href = "/";
          return;
        }

        function formatDate(iso) {
          if (!iso) return "-";
          try {
            const d = new Date(iso);
            if (isNaN(d.getTime())) return iso;
            return d.toLocaleString("es-MX", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            });
          } catch {
            return iso;
          }
        }

        function renderEstadoPill(estado) {
          let classes = "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ";
          switch (estado) {
            case "COMPLETADO":
              classes += "bg-emerald-50 text-emerald-700 border border-emerald-100";
              break;
            case "PENDIENTE":
              classes += "bg-amber-50 text-amber-700 border border-amber-100";
              break;
            case "EN_PROCESO":
              classes += "bg-sky-50 text-sky-700 border border-sky-100";
              break;
            case "CANCELADO":
              classes += "bg-rose-50 text-rose-700 border border-rose-100";
              break;
            case "CARRITO":
            default:
              classes += "bg-slate-50 text-slate-600 border border-slate-100";
          }
          return '<span class="' + classes + '">' + estado + "</span>";
        }

        // ================== LISTADO ==================
        async function cargarPedidos() {
          try {
            tbody.innerHTML = \`
              <tr>
                <td colspan="6" class="text-center py-4 text-slate-400">
                  Cargando pedidos...
                </td>
              </tr>\`;

            const resp = await fetch("/api/pedidos", {
              headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
              }
            });

            if (resp.status === 401) {
              redirectToLogin();
              return;
            }
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            const json = await resp.json();
            const all = Array.isArray(json) ? json : (json.data ?? []);

            // Solo pedidos reales (no carritos vacíos)
            const data = all.filter(p => p.estado !== "CARRITO");

            if (!data.length) {
              tbody.innerHTML = \`
                <tr>
                  <td colspan="6" class="text-center py-4 text-slate-400">
                    No hay pedidos registrados.
                  </td>
                </tr>\`;
              return;
            }

            tbody.innerHTML = data.map(p => {
              const nombreCliente =
                p.clienteNombre ??
                p.cliente_nombre ??
                p.nombreCliente ??
                p.cliente ??
                "—";

              const emailCliente =
                p.clienteEmail ??
                p.cliente_email ??
                p.emailCliente ??
                "";

              const fecha =
                p.createdAt ??
                p.created_at ??
                p.fecha ??
                null;

              const total = Number(p.total || 0).toFixed(2);

              return \`
              <tr class="hover:bg-slate-50" data-id="\${p.id}">
                <td class="px-3 py-2 text-slate-700">#\${p.id}</td>
                <td class="px-3 py-2 text-slate-700">
                  <div class="flex flex-col">
                    <span>\${nombreCliente}</span>
                    <span class="text-[11px] text-slate-500">\${emailCliente}</span>
                  </div>
                </td>
                <td class="px-3 py-2">\${renderEstadoPill(p.estado)}</td>
                <td class="px-3 py-2 text-right text-slate-700">
                  \$ \${total}
                </td>
                <td class="px-3 py-2 text-slate-600">
                  \${formatDate(fecha)}
                </td>
                <td class="px-3 py-2 text-right">
                  <button
                    type="button"
                    data-action="detalle"
                    data-id="\${p.id}"
                    class="inline-flex items-center px-2.5 py-1 text-xs rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.757 0-5-2.468-5-5s2.243-5 5-5 5 2.468 5 5-2.243 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                    </svg>
                    <span class="ml-1">Detalle</span>
                  </button>
                </td>
              </tr>\`;
            }).join("");
          } catch (err) {
            console.error("Error cargando pedidos:", err);
            tbody.innerHTML = \`
              <tr>
                <td colspan="6" class="text-center py-4 text-red-500">
                  Error al cargar pedidos.
                </td>
              </tr>\`;
          }
        }

        // ================== DETALLE ==================
        async function abrirDetallePedido(id) {
          try {
            const resp = await fetch("/api/pedidos/" + id, {
              headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
              }
            });

            if (resp.status === 401) {
              redirectToLogin();
              return;
            }
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            const data = await resp.json();
            const pedido = data.pedido || data;
            const detalles = data.detalles || pedido.detalles || [];

            const nombreCliente =
              pedido.clienteNombre ??
              pedido.cliente_nombre ??
              pedido.nombreCliente ??
              pedido.cliente ??
              "";

            const emailCliente =
              pedido.clienteEmail ??
              pedido.cliente_email ??
              pedido.emailCliente ??
              "";

            const fecha =
              pedido.createdAt ??
              pedido.created_at ??
              pedido.fecha ??
              null;

            const opcionesEstado = ESTADOS.map(e => \`
              <option value="\${e}" \${e === pedido.estado ? "selected" : ""}>\${e}</option>
            \`).join("");

            const filasDetalles = detalles.length
              ? detalles.map(d => {
                  const tituloCurso =
                    d.cursoTitulo ??
                    d.curso_titulo ??
                    d.tituloCurso ??
                    ("Curso #" + (d.cursoId ?? d.curso_id ?? ""));
                  const cantidad = d.cantidad ?? 1;
                  const precio = Number(d.precioUnitario ?? d.precio_unitario ?? 0).toFixed(2);
                  const subtotal = Number(d.subtotal ?? 0).toFixed(2);

                  return \`
                    <tr class="border-b border-slate-100 last:border-0">
                      <td class="px-3 py-1.5 text-sm text-slate-700">
                        \${tituloCurso}
                      </td>
                      <td class="px-3 py-1.5 text-center text-sm">\${cantidad}</td>
                      <td class="px-3 py-1.5 text-right text-sm">\$ \${precio}</td>
                      <td class="px-3 py-1.5 text-right text-sm">\$ \${subtotal}</td>
                    </tr>\`;
                }).join("")
              : '<tr><td colspan="4" class="px-3 py-2 text-center text-slate-400 text-sm">Sin detalles registrados.</td></tr>';

            await Swal.fire({
              title: "Pedido #" + pedido.id,
              width: "52rem",
              html: \`
                <div class="space-y-4 text-left text-sm">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-[11px] text-slate-500 mb-1">Cliente</p>
                      <p class="text-slate-800 font-medium">\${nombreCliente}</p>
                      <p class="text-[12px] text-slate-500">\${emailCliente}</p>
                    </div>
                    <div>
                      <p class="text-[11px] text-slate-500 mb-1">Fecha</p>
                      <p class="text-slate-800">\${formatDate(fecha)}</p>
                      <p class="text-[11px] text-slate-500 mt-1">Total:
                        <span class="font-semibold text-slate-800">
                          \$ \${Number(pedido.total || 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] text-slate-500 mb-1">Estado del pedido</label>
                    <select id="pedido-estado-select"
                            class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60">
                      \${opcionesEstado}
                    </select>
                  </div>

                  <div class="border border-slate-200 rounded-md overflow-hidden">
                    <div class="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 uppercase">
                      Detalles del pedido
                    </div>
                    <div class="overflow-x-auto">
                      <table class="min-w-full text-xs">
                        <thead class="bg-slate-50 text-[11px] text-slate-500">
                          <tr>
                            <th class="px-3 py-2 text-left">Curso</th>
                            <th class="px-3 py-2 text-center">Cantidad</th>
                            <th class="px-3 py-2 text-right">Precio</th>
                            <th class="px-3 py-2 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          \${filasDetalles}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              \`,
              showCancelButton: true,
              confirmButtonText: "Guardar cambios",
              cancelButtonText: "Cerrar",
              focusConfirm: false,
              preConfirm: async () => {
                const select = document.getElementById("pedido-estado-select");
                const nuevoEstado = select ? select.value : pedido.estado;

                if (!nuevoEstado || nuevoEstado === pedido.estado) {
                  return; // nada que actualizar
                }

                try {
                  const resp = await fetch("/api/pedidos/" + pedido.id, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({ estado: nuevoEstado })
                  });

                  if (resp.status === 401) {
                    redirectToLogin();
                    return false;
                  }

                  if (!resp.ok) {
                    let msg = "Error HTTP " + resp.status;
                    try {
                      const errJson = await resp.json();
                      if (errJson?.error?.message) msg = errJson.error.message;
                    } catch {}
                    Swal.showValidationMessage(msg);
                    return false;
                  }
                } catch (err) {
                  Swal.showValidationMessage("No se pudo actualizar el estado.");
                  return false;
                }
              }
            });

            await cargarPedidos();
          } catch (err) {
            console.error("Error obteniendo detalle de pedido:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo obtener el detalle del pedido."
            });
          }
        }

        tbody.addEventListener("click", (ev) => {
          const btn = ev.target.closest("button[data-action='detalle']");
          if (!btn) return;
          const id = btn.dataset.id;
          if (!id) return;
          abrirDetallePedido(id);
        });

        cargarPedidos();
      })();
    </script>
  `;

  return renderAdminPage({
    title: "FreeEd · Admin pedidos",
    pageTitle: "Pedidos",
    active: "pedidos",
    content,
  });
}
