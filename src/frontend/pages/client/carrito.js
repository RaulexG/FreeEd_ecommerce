// src/frontend/pages/client/carrito.js
import { renderPage } from "../../layout/basepage.js";

export function renderCarritoPage() {
  const content = `
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            Carrito de compra
          </p>
          <h1 class="text-xl font-bold text-slate-900">
            Cursos en tu carrito
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Revisa los cursos seleccionados antes de confirmar tu compra.
          </p>
        </div>
        <div class="text-right text-[11px] text-slate-500">
          <p>Paso 1 de 2</p>
          <p><span class="font-medium text-slate-700">Carrito</span> → Mi aprendizaje</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Resumen de cursos
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50 text-[11px] font-medium text-slate-500 uppercase">
              <tr>
                <th class="px-6 py-3 text-left">Curso</th>
                <th class="px-6 py-3 text-center w-24">Cantidad</th>
                <th class="px-6 py-3 text-right w-32">Precio</th>
                <th class="px-6 py-3 text-right w-32">Subtotal</th>
              </tr>
            </thead>
            <tbody id="carrito-body">
              <tr>
                <td colspan="4" class="px-6 py-6 text-center text-slate-400 text-sm">
                  Cargando carrito...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm">
          <p class="text-xs text-slate-500">
            Al confirmar la compra, los cursos pasarán a
            <a href="/client/miscursos" class="text-indigo-600 font-medium">Mi aprendizaje</a>.
          </p>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-[11px] text-slate-400 uppercase">Total</p>
              <p id="carrito-total" class="text-base font-semibold text-slate-900">
                $ 0.00
              </p>
            </div>
            <button
              id="btn-confirmar"
              type="button"
              class="px-4 py-2.5 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Confirmar compra
            </button>
          </div>
        </div>
      </div>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const USER_KEY  = "freeed:user";

        const tbody = document.getElementById("carrito-body");
        const totalEl = document.getElementById("carrito-total");
        const btnConfirmar = document.getElementById("btn-confirmar");

        if (!tbody || !totalEl || !btnConfirmar) {
          console.error("Elementos del carrito no encontrados");
          return;
        }

        const token = localStorage.getItem(TOKEN_KEY);
        let user = null;
        try {
          user = JSON.parse(localStorage.getItem(USER_KEY));
        } catch (_) {}

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem("freeed:cart");
          window.location.href = "/login";
        }

        if (!token || !user || user.rol !== "CLIENTE") {
          redirectToLogin();
          return;
        }

        function formatMoney(value) {
          const n = Number(value || 0);
          return n.toFixed(2);
        }

        async function fetchJson(url, options = {}) {
          const resp = await fetch(url, {
            ...options,
            headers: {
              "Accept": "application/json",
              ...(options.headers || {}),
              "Authorization": "Bearer " + token,
            },
          });

          if (resp.status === 401) {
            redirectToLogin();
            return Promise.reject(new Error("No autorizado"));
          }

          if (!resp.ok) {
            throw new Error("Error HTTP " + resp.status);
          }

          if (resp.status === 204) return null;
          return resp.json();
        }

        /* ================= CARGAR CARRITO ================= */
        async function cargarCarrito() {
          try {
            tbody.innerHTML = \`
              <tr>
                <td colspan="4" class="px-6 py-6 text-center text-slate-400 text-sm">
                  Cargando carrito...
                </td>
              </tr>\`;

            const data = await fetchJson("/api/carrito");
            if (!data || !data.pedido) {
              tbody.innerHTML = \`
                <tr>
                  <td colspan="4" class="px-6 py-6 text-center text-slate-400 text-sm">
                    Tu carrito está vacío.
                  </td>
                </tr>\`;
              totalEl.textContent = "$ 0.00";
              btnConfirmar.disabled = true;
              return;
            }

            const detalles = data.detalles || [];
            const total = data.pedido.total || 0;

            if (!detalles.length) {
              tbody.innerHTML = \`
                <tr>
                  <td colspan="4" class="px-6 py-6 text-center text-slate-400 text-sm">
                    Tu carrito está vacío.
                  </td>
                </tr>\`;
              totalEl.textContent = "$ 0.00";
              btnConfirmar.disabled = true;
              return;
            }

            tbody.innerHTML = detalles
              .map((d) => {
                const titulo = d.curso_titulo || "Curso #" + d.curso_id;
                const nivel  = d.curso_nivel || "";
                const portada = d.curso_portada ||
                  "https://via.placeholder.com/160x100?text=FreeEd";

                return \`
                  <tr class="border-t border-slate-100 hover:bg-slate-50" data-detalle-id="\${d.id}">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-16 h-10 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src="\${portada}"
                            alt="Portada curso"
                            class="w-full h-full object-cover"
                            onerror="this.src='https://via.placeholder.com/160x100?text=FreeEd';"
                          />
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-slate-800 line-clamp-1">
                            \${titulo}
                          </p>
                          <p class="text-[11px] text-slate-500 uppercase">\${nivel}</p>
                          <button
                            type="button"
                            class="mt-1 text-[11px] text-rose-600 hover:text-rose-700"
                            data-action="remove-item"
                            data-id="\${d.id}"
                            data-cantidad="\${d.cantidad}"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center align-middle">
                      \${d.cantidad}
                    </td>
                    <td class="px-6 py-4 text-right align-middle">
                      \$ \${formatMoney(d.precio_unitario)}
                    </td>
                    <td class="px-6 py-4 text-right align-middle">
                      \$ \${formatMoney(d.subtotal)}
                    </td>
                  </tr>
                \`;
              })
              .join("");

            totalEl.textContent = "$ " + formatMoney(total);
            btnConfirmar.disabled = false;

          } catch (err) {
            console.error("Error cargando carrito:", err);
            tbody.innerHTML = \`
              <tr>
                <td colspan="4" class="px-6 py-6 text-center text-red-500 text-sm">
                  Error al cargar el carrito.
                </td>
              </tr>\`;
            totalEl.textContent = "$ 0.00";
            btnConfirmar.disabled = true;
          }
        }

        /* ================= ELIMINAR ITEM ================= */
        async function eliminarItem(detalleId, cantidad) {
          try {
            const body = { cantidad: Number(cantidad) || 1 };

            await fetchJson("/api/carrito/items/" + detalleId, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            // Actualizar contador del icono
            if (window.freeedSyncCartBadge) {
              window.freeedSyncCartBadge();
            }

            await cargarCarrito();
          } catch (err) {
            console.error("Error eliminando item:", err);
            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el curso del carrito.",
              });
            } else {
              alert("No se pudo eliminar el curso del carrito.");
            }
          }
        }

        tbody.addEventListener("click", (ev) => {
          const btn = ev.target.closest("[data-action='remove-item']");
          if (!btn) return;

          const id = btn.dataset.id;
          const cantidad = btn.dataset.cantidad || "1";

          if (!id) return;

          if (window.Swal) {
            Swal.fire({
              icon: "question",
              title: "Eliminar curso",
              text: "¿Deseas eliminar este curso de tu carrito?",
              showCancelButton: true,
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                eliminarItem(id, cantidad);
              }
            });
          } else {
            if (confirm("¿Eliminar este curso del carrito?")) {
              eliminarItem(id, cantidad);
            }
          }
        });

        /* ================= CONFIRMAR COMPRA ================= */
        btnConfirmar.addEventListener("click", async () => {
          try {
            btnConfirmar.disabled = true;

            await fetchJson("/api/carrito/confirmar", {
              method: "POST",
            });

            if (window.freeedSyncCartBadge) {
              window.freeedSyncCartBadge();
            }

            if (window.Swal) {
              await Swal.fire({
                icon: "success",
                title: "Compra confirmada",
                text: "Tus cursos ahora están disponibles en Mi aprendizaje.",
                confirmButtonText: "Ir a Mi aprendizaje",
              });
            }
            window.location.href = "/client/miscursos";
          } catch (err) {
            console.error("Error confirmando compra:", err);
            btnConfirmar.disabled = false;
            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo confirmar la compra.",
              });
            } else {
              alert("No se pudo confirmar la compra.");
            }
          }
        });

        // Cargar al entrar
        cargarCarrito();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd · Carrito",
    content,
  });
}
