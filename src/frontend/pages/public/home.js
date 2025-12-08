// src/frontend/pages/public/home.js
import { renderPage } from "../../layout/basepage.js";

export function renderHomePage() {
  const content = `
    <section class="mt-10 space-y-14">
      <!-- HERO PRINCIPAL -->
      <section class="grid gap-10 lg:grid-cols-2 items-center">
        <!-- Texto -->
        <div>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-4"
          >
            Nuevo · Plataforma académica FreeEd
          </span>

          <h1
            class="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight"
          >
            Invierte en tu <span class="text-indigo-600">conocimiento</span>,
            construye tu futuro.
          </h1>

          <p class="text-slate-600 text-base sm:text-lg mb-6 max-w-xl">
            Accede a cursos digitales creados para estudiantes y
            profesionales que quieren aprender de forma práctica.
            Aprende a tu propio ritmo, desde cualquier lugar.
          </p>

          <div class="flex flex-wrap items-center gap-4 mb-6">
            <a
              href="/registro"
              class="px-5 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm font-medium"
            >
              Comenzar gratis
            </a>

            <a
              href="#home-courses"
              class="px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition text-sm font-medium"
            >
              Ver cursos destacados
            </a>
          </div>

          <div class="flex flex-wrap gap-6 text-xs sm:text-sm text-slate-500">
            <div>
              <p class="font-semibold text-slate-700">
                +50k Estudiantes (meta académica)
              </p>
              <p>Inspirado en las mejores plataformas de aprendizaje.</p>
            </div>
            <div>
              <p class="font-semibold text-slate-700">
                Certificados descargables
              </p>
              <p>
                Al completar cada curso 
              </p>
            </div>
          </div>
        </div>

        <!-- Imagen / Mockup -->
        <div class="relative">
          <div class="rounded-2xl overflow-hidden shadow-xl bg-slate-900">
            <img
              src="https://aulaideal.com/wp-content/uploads/Certificados/micertificado-2020.png"
              alt="Estudiante tomando un curso en línea"
              class="w-full h-full object-cover"
            />
          </div>

          <div
            class="absolute -bottom-6 left-4 bg-white rounded-xl shadow-lg px-4 py-3 text-xs sm:text-sm"
          >
            <p class="font-semibold text-slate-800 mb-1">
              Certificado oficial 
            <p class="text-slate-500">
              Al completar cada curso registrado en FreeEd.
            </p>
          </div>
        </div>
      </section>

    

      <!-- CATEGORÍAS (PÚBLICAS) -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-700">
            Explora por categoría
          </h2>
        </div>

        <div
          id="home-categories"
          class="min-h-[3rem] flex flex-wrap gap-2 text-sm"
        >
          <span class="text-xs text-slate-400">Cargando categorías...</span>
        </div>
      </section>

      <!-- CURSOS DESTACADOS (PÚBLICOS) -->
      <section class="space-y-4" id="section-courses">
        <div class="flex items-baseline justify-between">
          <h2 class="text-sm font-semibold text-slate-700">
            Cursos destacados
          </h2>
        </div>

        <div
          id="home-courses"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <p class="text-xs text-slate-400">Cargando cursos...</p>
        </div>
      </section>

      <!-- SECCIÓN DE BENEFICIOS / ESTADÍSTICAS -->
      <section
        class="grid gap-6 md:grid-cols-3 bg-slate-900 text-slate-50 rounded-2xl px-6 py-8"
      >
        <div>
          <p class="text-2xl font-bold mb-1">3.5k+</p>
          <p class="text-sm font-medium">Estudiantes </p>
          <p class="text-xs text-slate-300 mt-1">
            Dato de ejemplo para mostrar cómo se verían las métricas reales.
          </p>
        </div>
        <div>
          <p class="text-2xl font-bold mb-1">120+</p>
          <p class="text-sm font-medium">Horas de contenido</p>
          <p class="text-xs text-slate-300 mt-1">
            Tus cursos pueden crecer con el tiempo conforme avances el proyecto.
          </p>
        </div>
        <div>
          <p class="text-2xl font-bold mb-1">4.8 / 5</p>
          <p class="text-sm font-medium">Calificación promedio</p>
          <p class="text-xs text-slate-300 mt-1">
            Usa la tabla de reseñas para registrar opiniones de los alumnos.
          </p>
        </div>
      </section>
    </section>

    <script>
      (function () {
        const TOKEN_KEY = "freeed:token";
        const CART_KEY = "freeed:cart";

        const catContainer = document.getElementById("home-categories");
        const coursesContainer = document.getElementById("home-courses");

        // estado en memoria
        let categoriasCache = [];
        let cursosCache = [];
        let activeCategoryId = "all"; // "all" o id numérico

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

        /* ========== CATEGORÍAS (PÚBLICAS) ========== */
        function renderCategories() {
          if (!categoriasCache.length) {
            catContainer.innerHTML =
              '<span class="text-xs text-slate-400">No hay categorías registradas.</span>';
            return;
          }

          const baseClasses =
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer";
          const activeClasses =
            "bg-indigo-600 text-white shadow-sm";
          const inactiveClasses =
            "bg-indigo-50 text-indigo-700 hover:bg-indigo-100";

          const pills = [];

          // botón "Todos"
          pills.push(
            '<button type="button" data-category-id="all" class="' +
              baseClasses +
              " " +
              (activeCategoryId === "all"
                ? activeClasses
                : inactiveClasses) +
              '">Todos</button>'
          );

          categoriasCache.forEach((cat) => {
            const isActive = String(activeCategoryId) === String(cat.id);
            pills.push(
              '<button type="button" data-category-id="' +
                cat.id +
                '" class="' +
                baseClasses +
                " " +
                (isActive ? activeClasses : inactiveClasses) +
                '">' +
                cat.nombre +
                "</button>"
            );
          });

          catContainer.innerHTML = pills.join("");
        }

        async function loadCategories() {
          try {
            const data = await fetchJson("/api/categorias");

            if (!Array.isArray(data) || !data.length) {
              categoriasCache = [];
              renderCategories();
              return;
            }

            // Solo categorías activas
            categoriasCache = data.filter((c) => c.activo);

            renderCategories();
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
                text: "El curso se agregó a tu carrito.",
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

        /* ========== CURSOS DESTACADOS (PÚBLICOS) ========== */
        function getFilteredCourses() {
          const publicados = cursosCache.filter(
            (c) => String(c.estado).toUpperCase() === "PUBLICADO"
          );

          if (activeCategoryId === "all") return publicados;

          return publicados.filter(
            (c) => Number(c.categoriaId) === Number(activeCategoryId)
          );
        }

        function renderCourses() {
          const cursos = getFilteredCourses();

          if (!cursos.length) {
            coursesContainer.innerHTML =
              '<p class="text-xs text-slate-400">No hay cursos para esta categoría.</p>';
            return;
          }

          const top = cursos.slice(0, 6);

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
                  class="group bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  data-curso-id="\${curso.id}"
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
                    <h3
                      class="font-semibold text-slate-800 text-sm mb-2 line-clamp-2"
                    >
                      \${curso.titulo}
                    </h3>

                    <p class="text-sm text-slate-500 line-clamp-2 mb-3">
                      \${curso.descripcion ||
                        "Curso de FreeEd diseñado para este proyecto de E-Business."}
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
        }

        async function loadCourses() {
          try {
            const data = await fetchJson("/api/cursos");

            if (!Array.isArray(data) || data.length === 0) {
              cursosCache = [];
              coursesContainer.innerHTML =
                '<p class="text-xs text-slate-400">No hay cursos disponibles.</p>';
              return;
            }

            cursosCache = data;
            renderCourses();
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

          const id = Number(btn.dataset.id);
          const curso = cursosCache.find((c) => Number(c.id) === id);
          if (!curso) return;

          addToCart({
            id: curso.id,
            titulo: curso.titulo,
            precio: Number(curso.precio || 0),
          });
        });

        // Delegación para filtrar por categoría
        catContainer.addEventListener("click", (e) => {
          const pill = e.target.closest("[data-category-id]");
          if (!pill) return;

          const id = pill.dataset.categoryId;
          activeCategoryId = id === "all" ? "all" : Number(id);

          renderCategories();
          renderCourses();
        });

        // Ejecutar al cargar la página
        loadCategories();
        loadCourses();
      })();
    </script>
  `;

  return renderPage({
    title: "FreeEd | Aprende en línea",
    content,
  });
}
