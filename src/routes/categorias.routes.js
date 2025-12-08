// src/routes/categorias.routes.js
import { Router } from "express";
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from "../controllers/categoria.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

// GET públicos 
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

// protegidas 
router.post("/", authRequired, crearCategoria);
router.patch("/:id", authRequired, actualizarCategoria);
router.delete("/:id", authRequired, eliminarCategoria);

export default router;
