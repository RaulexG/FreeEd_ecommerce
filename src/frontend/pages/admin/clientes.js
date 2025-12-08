// src/frontend/pages/admin/clientes.js
import { renderAdminPage } from "../../layout/adminLayout.js";

export function renderClientesPage() {
  const content = `
    <section class="space-y-4">
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4">

        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-semibold text-slate-800 text-sm">Clientes</h2>
            <p class="text-xs text-slate-500">
              Administración de usuarios registrados en FreeEd.
            </p>
          </div>

          <button 
            id="btn-new-client"
            class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Nuevo cliente
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border border-slate-200 rounded-md">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left">Nombre</th>
                <th class="px-3 py-2 text-left">Email</th>
                <th class="px-3 py-2 text-left">Rol</th>
                <th class="px-3 py-2 text-left">Activo</th>
                <th class="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody id="clientes-body" class="divide-y divide-slate-100">
              <tr>
                <td colspan="5" class="text-center py-4 text-slate-400">
                  Cargando clientes...
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

        const tbody = document.getElementById("clientes-body");
        const btnNew = document.getElementById("btn-new-client");

        function redirectToLogin() {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          window.location.href = "/login";
        }

        const token = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);

        if (!token || !rawUser) return redirectToLogin();

        let user;
        try { user = JSON.parse(rawUser); }
        catch { return redirectToLogin(); }

        if (user.rol !== "ADMIN") {
          window.location.href = "/";
          return;
        }

        // ===================== CARGAR CLIENTES =====================
        async function cargarClientes() {
          try {
            tbody.innerHTML = \`
              <tr>
                <td colspan="5" class="text-center py-4 text-slate-400">
                  Cargando clientes...
                </td>
              </tr>\`;

            const resp = await fetch("/api/clientes?limit=100&offset=0", {
              headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
              }
            });

            if (resp.status === 401) return redirectToLogin();
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            const json = await resp.json();
            const all = Array.isArray(json) ? json : (json.data ?? []);

            // 🔹 Solo mostrar usuarios con rol CLIENTE
            const data = all.filter(c => c.rol === "CLIENTE");

            if (!Array.isArray(data) || !data.length) {
              tbody.innerHTML = \`
                <tr>
                  <td colspan="5" class="text-center py-4 text-slate-400">
                    No hay clientes registrados.
                  </td>
                </tr>\`;
              return;
            }

            tbody.innerHTML = data.map(cli => \`
              <tr
                class="hover:bg-slate-50 cursor-pointer"
                data-id="\${cli.id}"
                data-nombre="\${encodeURIComponent(cli.nombre ?? "")}"
                data-email="\${encodeURIComponent(cli.email ?? "")}"
                data-activo="\${cli.activo ? "1" : "0"}"
              >
                <td class="px-3 py-2">\${cli.nombre}</td>
                <td class="px-3 py-2 text-slate-600">\${cli.email}</td>
                <td class="px-3 py-2 text-slate-600">\${cli.rol}</td>
                <td class="px-3 py-2 text-center">\${cli.activo ? "Sí" : "No"}</td>
                <td class="px-3 py-2 text-right">
                  <button
                    type="button"
                    data-action="delete"
                    data-id="\${cli.id}"
                    class="inline-flex items-center px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2zm12-13h-2.5l-.71-.71A.996.996 0 0 0 14.09 5H9.91c-.26 0-.52.11-.7.29L8.5 6H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            \`).join("");

          } catch (err) {
            console.error(err);
            tbody.innerHTML = \`
              <tr>
                <td colspan="5" class="text-center py-4 text-red-500">
                  Error al cargar clientes.
                </td>
              </tr>\`;
          }
        }

        // ===================== MODAL CREAR CLIENTE =====================
        if (btnNew && window.Swal) {
          btnNew.addEventListener("click", async () => {
            const { value } = await Swal.fire({
              title: "Nuevo cliente",
              width: "42rem",
              showCancelButton: true,
              confirmButtonText: "Crear",
              cancelButtonText: "Cancelar",
              customClass: {
                popup: "pb-6"
              },
              html: \`
                <div class="space-y-4 text-left text-sm">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-slate-600 mb-1">
                        Nombre
                      </label>
                      <input
                        id="cli-nombre"
                        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-600 mb-1">
                        Email
                      </label>
                      <input
                        id="cli-email"
                        type="email"
                        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="correo@dominio.com"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-slate-600 mb-1">
                        Contraseña
                      </label>
                      <input
                        id="cli-pass"
                        type="password"
                        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div class="flex items-center mt-6">
                    </div>
                  </div>
                </div>
              \`,
              preConfirm: () => {
                const nombre = document.getElementById("cli-nombre").value.trim();
                const email  = document.getElementById("cli-email").value.trim();
                const password = document.getElementById("cli-pass").value.trim();

                if (!nombre || !email || !password) {
                  Swal.showValidationMessage("Nombre, email y contraseña son obligatorios.");
                  return false;
                }

                return { nombre, email, password }; // rol no se manda, backend pone CLIENTE
              }
            });

            if (!value) return;

            try {
              const resp = await fetch("/api/clientes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
                },
                body: JSON.stringify(value)
              });

              if (resp.status === 409) {
                Swal.fire({
                  icon: "warning",
                  title: "Duplicado",
                  text: "Ya existe un cliente con ese email."
                });
                return;
              }

              if (!resp.ok) throw new Error("Error HTTP " + resp.status);

              await cargarClientes();

              Swal.fire({
                icon: "success",
                title: "Cliente creado",
                timer: 1500,
                showConfirmButton: false
              });
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el cliente."
              });
            }
          });
        }

        // ===================== MODAL EDITAR CLIENTE =====================
        async function abrirEditarCliente(cli) {
          if (!window.Swal) return;

          const safeNombre = (cli.nombre || "").replace(/"/g, "&quot;");
          const safeEmail  = (cli.email  || "").replace(/"/g, "&quot;");

          const { value } = await Swal.fire({
            title: "Editar cliente",
            width: "42rem",
            showCancelButton: true,
            confirmButtonText: "Guardar cambios",
            cancelButtonText: "Cancelar",
            customClass: {
              popup: "pb-6"
            },
            html: \`
              <div class="space-y-4 text-left text-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Nombre
                    </label>
                    <input
                      id="edit-nombre"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      value="\${safeNombre}"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      value="\${safeEmail}"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">
                      Nueva contraseña (opcional)
                    </label>
                    <input
                      id="edit-pass"
                      type="password"
                      class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      placeholder="Dejar en blanco para no cambiar"
                    />
                  </div>
                  <div class="flex items-center gap-2 mt-6">
                    <input
                      id="edit-activo"
                      type="checkbox"
                      class="rounded border-slate-300"
                      \${cli.activo ? "checked" : ""}
                    />
                    <label for="edit-activo" class="text-xs text-slate-700">
                      Cliente activo
                    </label>
                  </div>
                </div>

                <p class="text-[11px] text-slate-400">
                  El rol permanecerá como <span class="font-semibold">CLIENTE</span>.
                </p>
              </div>
            \`,
            preConfirm: () => {
              const nombre = document.getElementById("edit-nombre").value.trim();
              const email  = document.getElementById("edit-email").value.trim();
              const password = document.getElementById("edit-pass").value.trim();
              const activo = document.getElementById("edit-activo").checked;

              if (!nombre || !email) {
                Swal.showValidationMessage("Nombre y email son obligatorios.");
                return false;
              }

              const payload = { nombre, email, activo };
              if (password) payload.password = password;
              return payload;
            }
          });

          if (!value) return;

          try {
            const resp = await fetch("/api/clientes/" + cli.id, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
              body: JSON.stringify(value)
            });

            if (resp.status === 409) {
              Swal.fire({
                icon: "warning",
                title: "Duplicado",
                text: "Ya existe un cliente con ese email."
              });
              return;
            }

            if (!resp.ok) throw new Error("Error HTTP " + resp.status);

            await cargarClientes();

            Swal.fire({
              icon: "success",
              title: "Cambios guardados",
              timer: 1500,
              showConfirmButton: false
            });
          } catch (err) {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo actualizar el cliente."
            });
          }
        }

        // ===================== ELIMINAR / EDITAR =====================
        tbody.addEventListener("click", async (ev) => {
          const btnDelete = ev.target.closest("button[data-action='delete']");
          if (btnDelete && window.Swal) {
            ev.stopPropagation(); // para que no dispare el click de la fila

            const id = btnDelete.dataset.id;
            if (!id) return;

            const res = await Swal.fire({
              icon: "warning",
              title: "Eliminar cliente",
              text: "Esta acción no se puede deshacer.",
              showCancelButton: true,
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
              confirmButtonColor: "#ef4444"
            });

            if (!res.isConfirmed) return;

            try {
              const resp = await fetch("/api/clientes/" + id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
              });

              if (resp.status !== 204 && !resp.ok) {
                throw new Error("Error HTTP " + resp.status);
              }

              await cargarClientes();

              Swal.fire({
                icon: "success",
                title: "Cliente eliminado",
                showConfirmButton: false,
                timer: 1400
              });
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el cliente."
              });
            }

            return;
          }

          // Click en la fila → EDITAR
          const row = ev.target.closest("tr[data-id]");
          if (!row) return;

          const cli = {
            id: row.dataset.id,
            nombre: row.dataset.nombre ? decodeURIComponent(row.dataset.nombre) : "",
            email: row.dataset.email ? decodeURIComponent(row.dataset.email) : "",
            activo: row.dataset.activo === "1",
            rol: "CLIENTE"
          };

          abrirEditarCliente(cli);
        });

        // ===================== INICIAL =====================
        cargarClientes();
      })();
    </script>
  `;

  return renderAdminPage({
    title: "FreeEd · Admin clientes",
    pageTitle: "Clientes",
    active: "clientes",
    content,
  });
}
