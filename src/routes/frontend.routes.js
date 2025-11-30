// src/routes/frontend.routes.js

import { Router } from "express";

// Páginas públicas
import { renderHomePage } from "../frontend/pages/home.js";
import { renderLoginPage } from "../frontend/pages/Loginc.js";
import { renderRegistroPage } from "../frontend/pages/registro.js";

// Páginas admin
import { renderAdminDashboard } from "../frontend/pages/admin/dashboard.js";
import { renderCategoriasPage } from "../frontend/pages/admin/categoria.js";
import { renderCursosPage } from "../frontend/pages/admin/productos.js";

// Páginas de error
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

// =======================
//   RUTAS DE ERROR
// =======================

router.get("/forbidden", (_req, res) => {
  res.send(renderForbiddenPage());
});

// 404 FRONTEND (cualquier ruta que no matchee antes)
router.use((_req, res) => {
  res.status(404).send(renderNotFoundPage());
});

export default router;
