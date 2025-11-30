// src/routes/cursos.routes.js
import { Router } from "express";
import {
  listarCursos,
  obtenerCurso,
  crearCurso,
  actualizarCurso,
  eliminarCurso
} from "../controllers/curso.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// Todas protegidas para el panel admin
router.get("/", authRequired, listarCursos);
router.get("/:id", authRequired, obtenerCurso);
router.post("/", authRequired, crearCurso);
router.patch("/:id", authRequired, actualizarCurso);
router.delete("/:id", authRequired, eliminarCurso);

export default router;
