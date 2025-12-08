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

// GET públicos 
router.get("/", listarCursos);
router.get("/:id", obtenerCurso);

// Operaciones del panel admin 
router.post("/", authRequired, crearCurso);
router.patch("/:id", authRequired, actualizarCurso);
router.delete("/:id", authRequired, eliminarCurso);

export default router;
