// src/routes/pedidos.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";

import {
  listarMisPedidos,
  obtenerMiPedido,
  listarPedidosAdminController,
  obtenerPedidoAdminController,
} from "../controllers/pedido.controller.js";

const router = Router();

// CLIENTE
router.get("/mios", authRequired, listarMisPedidos);
router.get("/mios/:id", authRequired, obtenerMiPedido);

// ADMIN
router.get("/", authRequired, listarPedidosAdminController);
router.get("/:id", authRequired, obtenerPedidoAdminController);

export default router;
