// src/frontend/pages/home.js
import { renderPage } from "../layout/basepage.js";

export function renderHomePage() {
  const content = `
    <section class="mt-10">
      <!-- HERO -->
      <div class="text-center mb-10">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-4 leading-tight">
          Aprende con cursos creados por estudiantes
        </h1>

        <p class="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          FreeEd impulsa a los estudiantes a convertir su conocimiento en cursos
          digitales únicos, prácticos y actuales. Descubre contenidos hechos desde
          la experiencia real.
        </p>

        <div class="flex justify-center gap-4">
          <a
            href="/registro"
            class="px-5 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm font-medium"
          >
            Crear mi cuenta
          </a>

          <a
            href="/login"
            class="px-5 py-2.5 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition text-sm font-medium"
          >
            Iniciar sesión
          </a>
        </div>
      </div>

      <!-- CATEGORÍAS -->
      <section class="mb-10">
        <h2 class="text-sm font-semibold text-slate-700 mb-3">
          Explora por categoría
        </h2>

        <div
          id="home-categories"
          class="min-h-[3rem] flex flex-wrap gap-2 text-sm"
        >
          <span class="text-xs text-slate-400">Cargando categorías...</span>
        </div>
      </section>

      <!-- CURSOS DESTACADOS -->
      <section class="mb-4">
        <div class="flex items-baseline justify-between mb-3">
          <h2 class="text-sm font-semibold text-slate-700">
            Cursos destacados
          </h2>
          <p class="text-[11px] text-slate-400">
            Sólo se muestran cursos publicados.
          </p>
        </div>

        <div
          id="home-courses"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <p class="text-xs text-slate-400">Cargando cursos...</p>
        </div>
      </section>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const CART_KEY = "freeed:cart";

        const catContainer = document.getElementById("home-categories");
        const coursesContainer = document.getElementById("home-courses");

        function getToken() {
          return localStorage.getItem(TOKEN_KEY);
        }

        async function fetchJson(url, options = {}) {
          const token = getToken();
          const headers = {
            Accept: "application/json",
            ...(options.headers || {}),
          };

          // Si hay token lo mandamos; si no, va sin auth
          if (token) {
            headers["Authorization"] = "Bearer " + token;
          }

          const resp = await fetch(url, {
            ...options,
            headers,
          });

          if (!resp.ok) {
            throw new Error("HTTP " + resp.status + " en " + url);
          }

          return resp.json();
        }

        /* ========== CATEGORÍAS ========== */
        async function loadCategories() {
          try {
            const data = await fetchJson("/api/categorias");

            if (!Array.isArray(data) || data.length === 0) {
              catContainer.innerHTML =
                '<span class="text-xs text-slate-400">No hay categorías registradas.</span>';
              return;
            }

            // Sólo activas
            const activas = data.filter((c) => c.activo);

            if (!activas.length) {
              catContainer.innerHTML =
                '<span class="text-xs text-slate-400">No hay categorías activas.</span>';
              return;
            }

            catContainer.innerHTML = activas
              .map(
                (cat) => \`
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
                  >
                    \${cat.nombre}
                  </span>
                \`
              )
              .join("");
          } catch (err) {
            console.error("Error cargando categorías:", err);
            catContainer.innerHTML =
              '<span class="text-xs text-red-500">Error al cargar categorías.</span>';
          }
        }

        /* ========== CARRITO (LOCALSTORAGE) ========== */
        function addToCart(curso) {
          try {
            const raw = localStorage.getItem(CART_KEY) || "[]";
            const cart = JSON.parse(raw);

            const exists = cart.some((item) => item.id === curso.id);
            if (!exists) {
              cart.push({
                id: curso.id,
                titulo: curso.titulo,
                precio: Number(curso.precio) || 0,
              });
              localStorage.setItem(CART_KEY, JSON.stringify(cart));
            }

            if (window.Swal) {
              Swal.fire({
                icon: "success",
                title: "Añadido al carrito",
                text: "El curso se agregó a tu carrito temporal.",
                timer: 1300,
                showConfirmButton: false,
              });
            } else {
              alert("Curso añadido al carrito.");
            }
          } catch (e) {
            console.error("Error al guardar en carrito:", e);
          }
        }

        /* ========== CURSOS DESTACADOS ========== */
        async function loadCourses() {
          try {
            const data = await fetchJson("/api/cursos");

            if (!Array.isArray(data) || data.length === 0) {
              coursesContainer.innerHTML =
                '<p class="text-xs text-slate-400">No hay cursos disponibles.</p>';
              return;
            }

            // Sólo cursos PUBLICADO
            const publicados = data.filter(
              (c) => String(c.estado).toUpperCase() === "PUBLICADO"
            );

            if (!publicados.length) {
              coursesContainer.innerHTML =
                '<p class="text-xs text-slate-400">No hay cursos publicados aún.</p>';
              return;
            }

            // Tomamos máximo 6
            const top = publicados.slice(0, 6);

            coursesContainer.innerHTML = top
              .map((curso) => {
                const precio = Number(curso.precio || 0).toFixed(2);
                const categoria = curso.categoriaNombre || "Sin categoría";
                const nivel = curso.nivel || "-";
                const portada =
                  curso.portadaUrl ||
                  "https://via.placeholder.com/600x360?text=FreeEd+Curso";

                return \`
                  <article
                    class="group bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col"
                    data-curso-id="\${curso.id}"
                    data-curso-titulo="\${curso.titulo}"
                    data-curso-precio="\${precio}"
                  >
                    <div class="h-40 overflow-hidden bg-slate-100">
                      <img
                        src="\${portada}"
                        alt="Portada del curso"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onerror="this.src='https://via.placeholder.com/600x360?text=FreeEd+Curso';"
                      />
                    </div>

                    <div class="p-4 flex-1 flex flex-col">
                      <p class="text-[11px] text-indigo-600 font-medium mb-1">
                        \${categoria} · \${nivel}
                      </p>
                      <h3 class="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">
                        \${curso.titulo}
                      </h3>

                      <p class="text-sm text-slate-500 line-clamp-2 mb-3">
                        \${curso.descripcion || "Curso creado por estudiantes de FreeEd."}
                      </p>

                      <div class="mt-auto flex items-center justify-between">
                        <span class="text-sm font-semibold text-slate-900">
                          \$ \${precio}
                        </span>

                        <button
                          type="button"
                          class="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                          data-action="add-cart"
                          data-id="\${curso.id}"
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    </div>
                  </article>
                \`;
              })
              .join("");
          } catch (err) {
            console.error("Error cargando cursos:", err);
            coursesContainer.innerHTML =
              '<p class="text-xs text-red-500">Error al cargar cursos.</p>';
          }
        }

        // Delegación para botón "Añadir al carrito"
        coursesContainer.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-action='add-cart']");
          if (!btn) return;

          const card = btn.closest("[data-curso-id]");
          if (!card) return;

          const curso = {
            id: Number(card.dataset.cursoId),
            titulo: card.dataset.cursoTitulo,
            precio: Number(card.dataset.cursoPrecio || 0),
          };

          addToCart(curso);
        });

        // Ejecutar al cargar la página
        loadCategories();
        loadCourses();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd | Inicio",
    content,
  });
}
