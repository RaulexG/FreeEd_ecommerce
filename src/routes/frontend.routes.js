import { Router } from "express";

// =======================
//   PÁGINAS PÚBLICAS
// =======================
import { renderHomePage } from "../frontend/pages/public/home.js";
import { renderLoginPage } from "../frontend/pages/public/Loginc.js";
import { renderRegistroPage } from "../frontend/pages/public/registro.js";

// =======================
//   PÁGINAS ADMIN
// =======================
import { renderAdminDashboard } from "../frontend/pages/admin/dashboard.js";
import { renderCategoriasPage } from "../frontend/pages/admin/categoria.js";
import { renderCursosPage } from "../frontend/pages/admin/productos.js";
import { renderClientesPage } from "../frontend/pages/admin/clientes.js";
import { renderPedidosPage } from "../frontend/pages/admin/pedidos.js";

// =======================
//   PÁGINAS CLIENTE
// =======================
import { renderCarritoPage } from "../frontend/pages/client/carrito.js";
import { renderMisCursosPage } from "../frontend/pages/client/miscursos.js";
import { renderPerfilPage } from "../frontend/pages/client/perfil.js";

// =======================
//   PÁGINAS ERROR
// =======================
import { renderForbiddenPage } from "../frontend/pages/errors/ForbiddenPage.js";
import { renderNotFoundPage } from "../frontend/pages/errors/NotFoundPage.js";

const router = Router();

// =======================
//   RUTAS PÚBLICAS
// =======================

router.get("/", (_req, res) => {
  res.send(renderHomePage());
});

router.get("/login", (_req, res) => {
  res.send(renderLoginPage());
});

router.get("/registro", (_req, res) => {
  res.send(renderRegistroPage());
});

// =======================
//   RUTAS ADMIN
// =======================

router.get("/admin", (_req, res) => {
  res.send(renderAdminDashboard());
});

router.get("/admin/categorias", (_req, res) => {
  res.send(renderCategoriasPage());
});

router.get("/admin/cursos", (_req, res) => {
  res.send(renderCursosPage());
});

router.get("/admin/clientes", (_req, res) => {
  res.send(renderClientesPage());
});

router.get("/admin/pedidos", (_req, res) => {
  res.send(renderPedidosPage());
});

// =======================
//   RUTAS CLIENTE
// =======================

router.get("/client/carrito", (_req, res) => {
  res.send(renderCarritoPage());
});

router.get("/client/miscursos", (_req, res) => {
  res.send(renderMisCursosPage());
});

router.get("/client/perfil", (_req, res) => {
  res.send(renderPerfilPage());
});

// =======================
//   RUTAS DE ERROR
// =======================

router.get("/forbidden", (_req, res) => {
  res.send(renderForbiddenPage());
});

// 404 NOT FOUND
router.use((_req, res) => {
  res.status(404).send(renderNotFoundPage());
});

export default router;
