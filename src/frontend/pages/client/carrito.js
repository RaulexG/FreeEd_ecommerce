// src/frontend/pages/client/carrito.js
import { renderPage } from "../../layout/basepage.js";

export function renderCarritoPage() {
  const content = `
    <section class="space-y-6">
      <!-- Encabezado -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p class="text-[11px] font-semibold tracking-wide text-indigo-600 uppercase">
            Carrito de compra
          </p>
          <h1 class="text-xl font-semibold text-slate-900">
            Cursos en tu carrito
          </h1>
          <p class="text-sm text-slate-500">
            Revisa los cursos seleccionados antes de confirmar tu compra.
          </p>
        </div>

        <div class="text-right text-xs text-slate-500">
          <p class="font-medium text-slate-700">Paso 1 de 2</p>
          <p>Carrito → Mi aprendizaje</p>
        </div>
      </header>

      <!-- Tarjeta principal -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div class="border border-dashed border-slate-200 rounded-lg">
          <table id="carrito-table" class="min-w-full text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left font-medium">Curso</th>
                <th class="px-3 py-2 text-center font-medium">Cantidad</th>
                <th class="px-3 py-2 text-right font-medium">Precio</th>
                <th class="px-3 py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody id="carrito-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="4" class="py-6 text-center text-slate-400 text-sm">
                  Cargando carrito...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Total y acciones -->
        <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="text-xs text-slate-500">
            <p>Al confirmar la compra, los cursos pasarán a <span class="font-medium text-slate-700">Mi aprendizaje</span>.</p>
          </div>

          <div class="flex items-center gap-4 justify-between sm:justify-end">
            <div class="text-right">
              <p class="text-xs text-slate-500">Total</p>
              <p id="carrito-total" class="text-lg font-semibold text-slate-900">
                $ 0.00
              </p>
            </div>

            <button
              id="btn-carrito-confirmar"
              type="button"
              class="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
        const CART_KEY  = "freeed:cart";

        const tbody         = document.getElementById("carrito-body");
        const totalEl       = document.getElementById("carrito-total");
        const btnConfirmar  = document.getElementById("btn-carrito-confirmar");
        const table         = document.getElementById("carrito-table");

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        const token = localStorage.getItem(TOKEN_KEY);
        let user = null;

        try {
          user = JSON.parse(localStorage.getItem(USER_KEY));
        } catch (_) {
          user = null;
        }

        if (!token || !user || user.rol !== "CLIENTE") {
          redirectToLogin();
          return;
        }

        function formatMoney(value) {
          const v = Number(value || 0);
          return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(v);
        }

        async function fetchJson(url, options) {
          const baseOptions = options || {};
          const headers = baseOptions.headers || {};

          const resp = await fetch(url, {
            ...baseOptions,
            headers: {
              ...headers,
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          });

          if (!resp.ok) {
            throw new Error("HTTP " + resp.status + " en " + url);
          }

          return resp.json();
        }

        async function cargarCarrito() {
          if (!tbody || !totalEl) return;

          tbody.innerHTML =
            "<tr><td colspan=\\"4\\" class=\\"py-6 text-center text-slate-400 text-sm\\">Cargando carrito...</td></tr>";
          totalEl.textContent = formatMoney(0);

          try {
            const data = await fetchJson("/api/carrito");
            const pedido   = data.pedido || {};
            const detalles = Array.isArray(data.detalles) ? data.detalles : [];

            if (!detalles.length) {
              tbody.innerHTML =
                "<tr><td colspan=\\"4\\" class=\\"py-6 text-center text-slate-400 text-sm\\">Tu carrito está vacío.</td></tr>";
              totalEl.textContent = formatMoney(0);
              if (btnConfirmar) btnConfirmar.disabled = true;
              return;
            }

            if (btnConfirmar) btnConfirmar.disabled = false;

            const rowsHtml = detalles.map(function (d) {
              const precioUnitario =
                Number(d.precio_unitario || d.precioUnitario || 0);
              const cantidad = Number(d.cantidad || 1);
              const subtotal =
                Number(d.subtotal || precioUnitario * cantidad);
              const titulo =
                d.curso_titulo || d.cursoTitulo || ("Curso #" + d.curso_id);

              return (
                "<tr data-id=\\"" + d.id + "\\">" +
                  "<td class=\\"px-3 py-3 text-sm text-slate-800\\">" +
                    titulo +
                  "</td>" +
                  "<td class=\\"px-3 py-3 text-center text-sm text-slate-700\\">" +
                    "<input type=\\"number\\" min=\\"1\\" value=\\"" + cantidad + "\\" " +
                      "class=\\"w-16 px-2 py-1 border border-slate-200 rounded text-center text-sm\\" " +
                      "data-action=\\"change-qty\\" />" +
                  "</td>" +
                  "<td class=\\"px-3 py-3 text-right text-sm text-slate-700\\">" +
                    formatMoney(precioUnitario) +
                  "</td>" +
                  "<td class=\\"px-3 py-3 text-right text-sm text-slate-700\\">" +
                    "<span class=\\"mr-3 font-medium\\">" +
                      formatMoney(subtotal) +
                    "</span>" +
                    "<button type=\\"button\\" " +
                      "class=\\"text-rose-600 text-xs hover:text-rose-700\\" " +
                      "data-action=\\"remove\\">Eliminar</button>" +
                  "</td>" +
                "</tr>"
              );
            }).join("");

            tbody.innerHTML = rowsHtml;
            totalEl.textContent = formatMoney(pedido.total || 0);
          } catch (err) {
            console.error("Error cargando carrito:", err);
            tbody.innerHTML =
              "<tr><td colspan=\\"4\\" class=\\"py-6 text-center text-red-500 text-sm\\">Error al cargar el carrito.</td></tr>";
          }
        }

        async function actualizarCantidad(id, cantidad) {
          try {
            await fetchJson("/api/carrito/items/" + id, {
              method: "PATCH",
              body: JSON.stringify({ cantidad: cantidad }),
            });
            await cargarCarrito();
          } catch (err) {
            console.error("Error actualizando cantidad:", err);
            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "No se pudo actualizar",
                text: "Intenta de nuevo.",
              });
            }
          }
        }

        async function eliminarItem(id) {
          try {
            await fetchJson("/api/carrito/items/" + id, {
              method: "DELETE",
              body: JSON.stringify({ cantidad: 1 }),
            });
            await cargarCarrito();
          } catch (err) {
            console.error("Error eliminando item:", err);
            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text: "Intenta de nuevo.",
              });
            }
          }
        }

        // Delegación de eventos en la tabla
        if (table) {
          table.addEventListener("change", function (ev) {
            const input = ev.target.closest("input[data-action='change-qty']");
            if (!input) return;

            const row = input.closest("tr");
            if (!row) return;

            const id = row.getAttribute("data-id");
            const cantidad = Number(input.value) || 1;
            actualizarCantidad(id, cantidad);
          });

          table.addEventListener("click", function (ev) {
            const btnRemove = ev.target.closest("button[data-action='remove']");
            if (!btnRemove) return;

            const row = btnRemove.closest("tr");
            if (!row) return;

            const id = row.getAttribute("data-id");
            eliminarItem(id);
          });
        }

        if (btnConfirmar) {
          btnConfirmar.addEventListener("click", async function () {
            try {
              if (window.Swal) {
                const result = await Swal.fire({
                  icon: "question",
                  title: "Confirmar compra",
                  text: "¿Deseas completar tu compra y pasar los cursos a Mi aprendizaje?",
                  showCancelButton: true,
                  confirmButtonText: "Sí, confirmar",
                  cancelButtonText: "Cancelar",
                });
                if (!result.isConfirmed) return;
              }

              await fetchJson("/api/carrito/confirmar", {
                method: "POST",
              });

              if (window.Swal) {
                await Swal.fire({
                  icon: "success",
                  title: "Compra completada",
                  text: "Tus cursos ya están disponibles en Mi aprendizaje.",
                  timer: 1800,
                  showConfirmButton: false,
                });
              }

              // limpiamos carrito local
              localStorage.removeItem(CART_KEY);
              window.location.href = "/client/miscursos";
            } catch (err) {
              console.error("Error confirmando carrito:", err);
              if (window.Swal) {
                Swal.fire({
                  icon: "error",
                  title: "No se pudo confirmar",
                  text: "Intenta de nuevo en unos minutos.",
                });
              }
            }
          });
        }

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
