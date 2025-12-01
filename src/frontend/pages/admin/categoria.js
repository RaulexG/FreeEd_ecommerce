// src/frontend/pages/admin/categoria.js
import { renderPage } from "../../layout/basepage.js";

export function renderCategoriasPage() {
  const content = `
    <section class="space-y-6">
      <header class="flex items-center justify-between mb-2">
        <div>
          <p class="text-xs text-slate-400">
            Admin / Catálogos / Categorías
          </p>
          <h1 class="text-2xl font-semibold text-slate-800 mt-1">
            Categorías de cursos
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Administra las categorías que organizan los cursos publicados en FreeEd.
          </p>
        </div>

        <a
          href="/admin"
          class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
        >
          ← Volver al panel
        </a>
      </header>

      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="font-semibold text-slate-800 text-sm">
            Listado de categorías
          </h2>
          <button
            id="btn-new-category"
            class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Nueva categoría
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                <th class="px-4 py-2 font-medium">Nombre</th>
                <th class="px-4 py-2 font-medium">Descripción</th>
                <th class="px-4 py-2 font-medium text-center">Activo</th>
                <th class="px-4 py-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody id="categorias-tbody">
              <tr>
                <td colspan="4" class="text-center py-4 text-slate-400">
                  Cargando categorías...
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
        const tbody = document.getElementById("categorias-tbody");
        const btnNew = document.getElementById("btn-new-category");

        function getToken() {
          return localStorage.getItem(TOKEN_KEY);
        }

        function escapeHtml(str) {
          if (!str) return "";
          return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

        async function cargarCategorias() {
          const token = getToken();
          if (!token) {
            tbody.innerHTML =
              '<tr><td colspan="4" class="text-center py-4 text-red-500 text-sm">No hay sesión activa.</td></tr>';
            return;
          }

          try {
            const resp = await fetch("/api/categorias", {
              headers: {
                "Authorization": "Bearer " + token
              }
            });

            if (!resp.ok) {
              throw new Error("Error HTTP " + resp.status);
            }

            const data = await resp.json();

            if (!Array.isArray(data) || !data.length) {
              tbody.innerHTML =
                '<tr><td colspan="4" class="text-center py-4 text-slate-400 text-sm">No hay categorías registradas.</td></tr>';
              return;
            }

            tbody.innerHTML = data
              .map(cat => {
                const nombre = escapeHtml(cat.nombre);
                const descripcion = escapeHtml(cat.descripcion || "");
                const activoTexto = cat.activo ? "Sí" : "No";
                const activoFlag = cat.activo ? "1" : "0";

                return \`
                  <tr
                    class="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    data-id="\${cat.id}"
                    data-nombre="\${nombre}"
                    data-descripcion="\${descripcion}"
                    data-activo="\${activoFlag}"
                  >
                    <td class="px-4 py-2 text-slate-800 text-sm">\${nombre}</td>
                    <td class="px-4 py-2 text-slate-600 text-sm">\${descripcion}</td>
                    <td class="px-4 py-2 text-center text-xs">\${activoTexto}</td>
                    <td class="px-4 py-2 text-right">
                      <button
                        type="button"
                        data-action="delete"
                        data-id="\${cat.id}"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-xs"
                      >
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1"/></svg>
                      </button>
                    </td>
                  </tr>
                \`;
              })
              .join("");
          } catch (err) {
            console.error(err);
            tbody.innerHTML =
              '<tr><td colspan="4" class="text-center py-4 text-red-500 text-sm">Error al cargar categorías.</td></tr>';

            if (window.Swal) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las categorías."
              });
            }
          }
        }

        // ---------- MODAL CREAR CATEGORÍA ----------
        if (btnNew && window.Swal) {
          btnNew.addEventListener("click", async () => {
            const token = getToken();
            if (!token) {
              Swal.fire({
                icon: "warning",
                title: "Sesión requerida",
                text: "Debes iniciar sesión para crear categorías."
              });
              return;
            }

            const { value: formValues } = await Swal.fire({
              title: "Nueva categoría",
              width: "42rem",
              html: \`
                <div class="flex flex-col gap-3 text-left">
                  <label class="text-xs text-slate-600">
                    Nombre
                    <input id="swal-cat-nombre"
                      class="swal2-input"
                      placeholder="Ej. Programación avanzada" />
                  </label>
                  <label class="text-xs text-slate-600">
                    Descripción
                    <textarea id="swal-cat-descripcion"
                      class="swal2-textarea"
                      placeholder="Cursos relacionados con..."></textarea>
                  </label>
                  <label class="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <input id="swal-cat-activo" type="checkbox" checked />
                    <span>Activo</span>
                  </label>
                </div>
              \`,
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonText: "Guardar",
              cancelButtonText: "Cancelar",
              confirmButtonColor: "#4f46e5",
              cancelButtonColor: "#6b7280",
              preConfirm: () => {
                const nombre = document.getElementById("swal-cat-nombre").value.trim();
                const descripcion = document.getElementById("swal-cat-descripcion").value.trim();
                const activo = document.getElementById("swal-cat-activo").checked;

                if (!nombre) {
                  Swal.showValidationMessage("El nombre es obligatorio");
                  return false;
                }

                return { nombre, descripcion, activo };
              }
            });

            if (!formValues) return; // cancelado

            try {
              const resp = await fetch("/api/categorias", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                  nombre: formValues.nombre,
                  descripcion: formValues.descripcion,
                  activo: formValues.activo
                })
              });

              if (resp.status === 409) {
                Swal.fire({
                  icon: "warning",
                  title: "Duplicado",
                  text: "Ya existe una categoría con ese nombre."
                });
                return;
              }

              if (!resp.ok) {
                throw new Error("HTTP " + resp.status);
              }

              await cargarCategorias();

              Swal.fire({
                icon: "success",
                title: "Categoría creada",
                showConfirmButton: false,
                timer: 1300
              });
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear la categoría."
              });
            }
          });
        }

        // ---------- MODAL EDITAR CATEGORÍA ----------
        async function abrirEditarCategoria(cat) {
          const token = getToken();
          if (!token || !window.Swal) return;

          const { value: formValues } = await Swal.fire({
            title: "Editar categoría",
            width: "42rem",
            html: \`
              <div class="flex flex-col gap-3 text-left">
                <label class="text-xs text-slate-600">
                  Nombre
                  <input id="swal-cat-nombre"
                    class="swal2-input"
                    placeholder="Ej. Programación avanzada" />
                </label>
                <label class="text-xs text-slate-600">
                  Descripción
                  <textarea id="swal-cat-descripcion"
                    class="swal2-textarea"
                    placeholder="Cursos relacionados con..."></textarea>
                </label>
                <label class="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <input id="swal-cat-activo" type="checkbox" />
                  <span>Activo</span>
                </label>
              </div>
            \`,
            didOpen: () => {
              const inputNombre = document.getElementById("swal-cat-nombre");
              const inputDesc = document.getElementById("swal-cat-descripcion");
              const inputActivo = document.getElementById("swal-cat-activo");

              if (inputNombre) inputNombre.value = cat.nombre || "";
              if (inputDesc) inputDesc.value = cat.descripcion || "";
              if (inputActivo) inputActivo.checked = !!cat.activo;
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar cambios",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#4f46e5",
            cancelButtonColor: "#6b7280",
            preConfirm: () => {
              const nombre = document.getElementById("swal-cat-nombre").value.trim();
              const descripcion = document.getElementById("swal-cat-descripcion").value.trim();
              const activo = document.getElementById("swal-cat-activo").checked;

              if (!nombre) {
                Swal.showValidationMessage("El nombre es obligatorio");
                return false;
              }

              return { nombre, descripcion, activo };
            }
          });

          if (!formValues) return; // cancelado

          try {
            const resp = await fetch("/api/categorias/" + cat.id, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
              body: JSON.stringify({
                nombre: formValues.nombre,
                descripcion: formValues.descripcion,
                activo: formValues.activo
              })
            });

            if (resp.status === 409) {
              Swal.fire({
                icon: "warning",
                title: "Duplicado",
                text: "Ya existe una categoría con ese nombre."
              });
              return;
            }

            if (!resp.ok) {
              throw new Error("HTTP " + resp.status);
            }

            await cargarCategorias();

            Swal.fire({
              icon: "success",
              title: "Cambios guardados",
              showConfirmButton: false,
              timer: 1200
            });
          } catch (err) {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo actualizar la categoría."
            });
          }
        }

        // ---------- DELEGACIÓN CLICK TABLA (ELIMINAR / EDITAR) ----------
        tbody.addEventListener("click", async (e) => {
          const token = getToken();
          if (!token || !window.Swal) return;

          // 1) ¿Click en botón Eliminar?
          const btnDelete = e.target.closest("[data-action='delete']");
          if (btnDelete) {
            const id = btnDelete.dataset.id;
            if (!id) return;

            const result = await Swal.fire({
              icon: "warning",
              title: "¿Eliminar categoría?",
              text: "Esta acción no se puede deshacer.",
              showCancelButton: true,
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
              confirmButtonColor: "#ef4444",
              cancelButtonColor: "#6b7280"
            });

            if (!result.isConfirmed) return;

            try {
              const resp = await fetch("/api/categorias/" + id, {
                method: "DELETE",
                headers: {
                  "Authorization": "Bearer " + token
                }
              });

              if (resp.status !== 204 && !resp.ok) {
                throw new Error("HTTP " + resp.status);
              }

              await cargarCategorias();

              Swal.fire({
                icon: "success",
                title: "Eliminada",
                showConfirmButton: false,
                timer: 1100
              });
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la categoría."
              });
            }

            return; // ya manejamos el click
          }

          // 2) Si no fue botón eliminar, tratamos el click como EDITAR (fila completa)
          const row = e.target.closest("tr[data-id]");
          if (!row) return;

          const cat = {
            id: row.dataset.id,
            nombre: row.dataset.nombre || "",
            descripcion: row.dataset.descripcion || "",
            activo: row.dataset.activo === "1"
          };

          abrirEditarCategoria(cat);
        });

        // Cargar al entrar
        cargarCategorias();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd · Admin categorías",
    content,
  });
}
