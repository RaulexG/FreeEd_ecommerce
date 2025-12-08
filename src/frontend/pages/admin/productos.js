// src/frontend/pages/admin/productos.js
import { renderAdminPage } from "../../layout/adminLayout.js";

export function renderCursosPage() {
  const content = `
    <section class="space-y-4">
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="font-semibold text-slate-800 text-sm">
              Listado de cursos
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Cursos registrados en la plataforma (borrador, publicados o pausados).
            </p>
          </div>

          <button
            type="button"
            data-action="nuevo-curso"
            class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Nuevo curso
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border border-slate-200 rounded-md">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left">Título</th>
                <th class="px-3 py-2 text-left">Categoría</th>
                <th class="px-3 py-2 text-left">Nivel</th>
                <th class="px-3 py-2 text-left">Precio</th>
                <th class="px-3 py-2 text-left">Estado</th>
                <th class="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody id="cursos-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="6" class="text-center py-4 text-slate-400">
                  Cargando cursos...
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

        const nivelesCurso = ["BÁSICO", "INTERMEDIO", "AVANZADO"];
        const estadosCurso = ["BORRADOR", "PUBLICADO", "PAUSADO"];

        let cursosCache = [];
        let categoriasCache = [];

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        const rawToken = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);

        if (!rawToken || !rawUser) {
          redirectToLogin();
          return;
        }

        let user;
        try {
          user = JSON.parse(rawUser);
        } catch (e) {
          redirectToLogin();
          return;
        }

        // Solo ADMIN
        if (user.rol !== "ADMIN") {
          window.location.href = "/";
          return;
        }

        const tbody = document.getElementById("cursos-body");

        async function cargarCategorias() {
          try {
            const resp = await fetch("/api/categorias", {
              headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + rawToken
              }
            });

            if (resp.status === 401) {
              redirectToLogin();
              return;
            }
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            const data = await resp.json();
            categoriasCache = Array.isArray(data) ? data : [];
          } catch (err) {
            console.error("Error cargando categorías:", err);
            categoriasCache = [];
          }
        }

        async function cargarCursos() {
          try {
            tbody.innerHTML = \`
              <tr>
                <td colspan="6" class="text-center py-4 text-slate-400">
                  Cargando cursos...
                </td>
              </tr>\`;

            const resp = await fetch("/api/cursos", {
              headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + rawToken
              }
            });

            if (resp.status === 401) {
              redirectToLogin();
              return;
            }
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            const data = await resp.json();
            cursosCache = Array.isArray(data) ? data : [];

            if (!cursosCache.length) {
              tbody.innerHTML = \`
                <tr>
                  <td colspan="6" class="text-center py-4 text-slate-400">
                    No hay cursos registrados.
                  </td>
                </tr>\`;
              return;
            }

            tbody.innerHTML = cursosCache.map(curso => \`
              <tr
                class="border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                data-id="\${curso.id}"
              >
                <td class="px-3 py-2 text-sm text-slate-700">\${curso.titulo}</td>
                <td class="px-3 py-2 text-sm text-slate-500">
                  \${curso.categoriaNombre ?? "-"}
                </td>
                <td class="px-3 py-2 text-sm">\${curso.nivel}</td>
                <td class="px-3 py-2 text-sm">
                  \$ \${Number(curso.precio).toFixed(2)}
                </td>
                <td class="px-3 py-2 text-sm">\${curso.estado}</td>
                <td class="px-3 py-2 text-right">
                  <button
                    type="button"
                    data-action="delete"
                    data-id="\${curso.id}"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs
                           border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2zm12-13h-2.5l-.71-.71A.996.996 0 0 0 14.09 5H9.91c-.26 0-.52.11-.7.29L8.5 6H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1"/>
                    </svg>
                  </button>
                </td>
              </tr>\`
            ).join("");
          } catch (err) {
            console.error("Error cargando cursos:", err);
            tbody.innerHTML = \`
              <tr>
                <td colspan="6" class="text-center py-4 text-red-500">
                  Error al cargar cursos.
                </td>
              </tr>\`;
          }
        }

        async function eliminarCurso(id) {
          const curso = cursosCache.find(c => c.id === Number(id));
          const titulo = curso ? curso.titulo : "este curso";

          const confirm = await Swal.fire({
            icon: "warning",
            title: "¿Eliminar curso?",
            text: "Se eliminará \\"" + titulo + "\\". Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444"
          });

          if (!confirm.isConfirmed) return;

          try {
            const resp = await fetch("/api/cursos/" + id, {
              method: "DELETE",
              headers: {
                "Authorization": "Bearer " + rawToken
              }
            });

            if (resp.status === 401) {
              redirectToLogin();
              return;
            }
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            await Swal.fire({
              icon: "success",
              title: "Curso eliminado",
              timer: 1500,
              showConfirmButton: false
            });

            await cargarCursos();
          } catch (err) {
            console.error("Error eliminando curso:", err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo eliminar el curso."
            });
          }
        }

        async function abrirModalCurso(modo, curso) {
          if (!categoriasCache.length) {
            await cargarCategorias();
          }

          const optsCategorias = categoriasCache.map(cat => \`
            <option value="\${cat.id}" \${curso && curso.categoriaId === cat.id ? "selected" : ""}>
              \${cat.nombre}
            </option>\`
          ).join("");

          const optsNiveles = nivelesCurso.map(niv => \`
            <option value="\${niv}" \${curso && curso.nivel === niv ? "selected" : ""}>
              \${niv}
            </option>\`
          ).join("");

          const optsEstados = estadosCurso.map(est => \`
            <option value="\${est}" \${curso && curso.estado === est ? "selected" : ""}>
              \${est}
            </option>\`
          ).join("");

          const tituloModal = modo === "create" ? "Nuevo curso" : "Editar curso";

          await Swal.fire({
            title: tituloModal,
            width: "48rem",
            html: \`
              <div class="space-y-4 text-left text-sm">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">
                    Título
                  </label>
                  <input
                    id="curso-titulo"
                    type="text"
                    class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    value="\${curso?.titulo ?? ""}"
                    placeholder="Ej. Introducción a Python para estudiantes"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="curso-descripcion"
                    rows="3"
                    class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    placeholder="Describe brevemente de qué trata el curso"
                  >\${curso?.descripcion ?? ""}</textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Categoría
                    </label>
                    <select
                      id="curso-categoria"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    >
                      <option value="">Selecciona una categoría</option>
                      \${optsCategorias}
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Nivel
                    </label>
                    <select
                      id="curso-nivel"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    >
                      \${optsNiveles}
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Precio (MXN)
                    </label>
                    <input
                      id="curso-precio"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      value="\${curso?.precio ?? ""}"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Duración (horas)
                    </label>
                    <input
                      id="curso-duracion"
                      type="number"
                      min="0"
                      step="0.5"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      value="\${curso?.duracionHoras ?? ""}"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Estado
                    </label>
                    <select
                      id="curso-estado"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    >
                      \${optsEstados}
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">
                    URL de portada (opcional)
                  </label>
                  <input
                    id="curso-portada"
                    type="url"
                    class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    value="\${curso?.portadaUrl ?? ""}"
                    placeholder="https://ejemplo.com/portadas/mi-curso.png"
                  />
                  <p class="mt-1 text-[11px] text-slate-400">
                    Se mostrará una previsualización si la URL es válida.
                  </p>
                  <div class="mt-3">
                    <img
                      id="curso-portada-preview"
                      src="\${curso?.portadaUrl ?? ""}"
                      class="\${curso?.portadaUrl ? "block" : "hidden"} w-full max-h-48 object-cover rounded-md border border-slate-200"
                      alt="Previsualización de portada"
                    />
                  </div>
                </div>
              </div>
            \`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: modo === "create" ? "Crear curso" : "Guardar cambios",
            cancelButtonText: "Cancelar",
            customClass: {
              popup: "pb-6"
            },
            didOpen: () => {
              const popup = Swal.getPopup();
              const portadaInput = popup.querySelector("#curso-portada");
              const imgPrev = popup.querySelector("#curso-portada-preview");

              portadaInput.addEventListener("input", () => {
                const url = portadaInput.value.trim();
                if (url) {
                  imgPrev.src = url;
                  imgPrev.classList.remove("hidden");
                } else {
                  imgPrev.classList.add("hidden");
                  imgPrev.removeAttribute("src");
                }
              });
            },
            preConfirm: () => {
              const popup = Swal.getPopup();
              const titulo = popup.querySelector("#curso-titulo").value.trim();
              const descripcion = popup.querySelector("#curso-descripcion").value.trim();
              const categoriaId = Number(popup.querySelector("#curso-categoria").value);
              const nivel = popup.querySelector("#curso-nivel").value;
              const precio = parseFloat(popup.querySelector("#curso-precio").value);
              const duracionRaw = popup.querySelector("#curso-duracion").value;
              const duracionHoras = duracionRaw ? parseFloat(duracionRaw) : null;
              const estado = popup.querySelector("#curso-estado").value;
              const portadaUrl = popup.querySelector("#curso-portada").value.trim();

              if (!titulo || !descripcion || !categoriaId || isNaN(precio)) {
                Swal.showValidationMessage(
                  "Título, descripción, categoría y precio son obligatorios."
                );
                return;
              }

              return {
                titulo,
                descripcion,
                categoriaId,
                nivel,
                precio,
                duracionHoras,
                estado,
                portadaUrl
              };
            }
          }).then(async (result) => {
            if (!result.isConfirmed) return;

            const payload = result.value;

            try {
              let resp;
              if (modo === "create") {
                resp = await fetch("/api/cursos", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + rawToken
                  },
                  body: JSON.stringify(payload)
                });
              } else {
                resp = await fetch("/api/cursos/" + curso.id, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + rawToken
                  },
                  body: JSON.stringify(payload)
                });
              }

              if (resp.status === 401) {
                redirectToLogin();
                return;
              }

              if (!resp.ok) {
                let msg = "Error HTTP " + resp.status;
                try {
                  const errJson = await resp.json();
                  if (errJson?.error?.message) msg = errJson.error.message;
                } catch (_) {}
                throw new Error(msg);
              }

              await Swal.fire({
                icon: "success",
                title: modo === "create" ? "Curso creado" : "Curso actualizado",
                timer: 1600,
                showConfirmButton: false
              });

              await cargarCursos();
            } catch (err) {
              console.error("Error guardando curso:", err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "No se pudo guardar el curso."
              });
            }
          });
        }

        document.addEventListener("DOMContentLoaded", () => {
          const nuevoBtn = document.querySelector("[data-action='nuevo-curso']");
          if (nuevoBtn) {
            nuevoBtn.addEventListener("click", () => abrirModalCurso("create"));
          }

          tbody.addEventListener("click", (ev) => {
            const deleteBtn = ev.target.closest("button[data-action='delete']");
            if (deleteBtn) {
              ev.stopPropagation();
              const id = deleteBtn.dataset.id;
              if (id) eliminarCurso(id);
              return;
            }

            const row = ev.target.closest("tr[data-id]");
            if (!row) return;
            const id = Number(row.dataset.id);
            const curso = cursosCache.find(c => c.id === id);
            if (curso) abrirModalCurso("edit", curso);
          });

          Promise.all([cargarCategorias(), cargarCursos()]).catch(() => {});
        });
      })();
    </script>
  `;

  return renderAdminPage({
    title: "FreeEd · Admin cursos",
    pageTitle: "Cursos",
    subtitle: "Crea, edita y administra los cursos digitales publicados en FreeEd.",
    active: "cursos",
    content,
  });
}
