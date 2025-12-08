// src/routes/carrito.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import {
  obtenerCarritoActual,
  agregarItemCarrito,
  actualizarItemCarrito,
  eliminarItemCarrito,
  vaciarCarritoActual,
  confirmarCarritoActual,
} from "../controllers/carrito.controller.js";

const router = Router();

// todas requieren sesión
router.use(authRequired);

router.get("/", obtenerCarritoActual);
router.post("/items", agregarItemCarrito);
router.patch("/items/:id", actualizarItemCarrito);
router.delete("/items/:id", eliminarItemCarrito);
router.delete("/", vaciarCarritoActual);
router.post("/confirmar", confirmarCarritoActual);

export default router;
