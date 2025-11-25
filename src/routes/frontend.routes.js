// src/routes/frontend.routes.js

import { Router } from "express";

// Importar las páginas del frontend
import { renderHomePage } from "../frontend/pages/home.js";
import { renderLoginPage } from "../frontend/pages/Loginc.js";
import { renderRegistroPage } from "../frontend/pages/registro.js";

const router = Router();

// RUTA: HOME
router.get("/", (req, res) => {
  res.send(renderHomePage());
});

// RUTA: LOGIN
router.get("/login", (req, res) => {
  res.send(renderLoginPage());
});

// RUTA: REGISTRO
router.get("/registro", (req, res) => {
  res.send(renderRegistroPage());
});

// Exportar router
export default router;
