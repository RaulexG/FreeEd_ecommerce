import { Router } from "express";
import clientesRouter from "./clientes.routes.js";
import authRouter from "./auth.routes.js";
import categoriasRouter from "./categorias.routes.js";
import cursosRouter from "./cursos.routes.js";


const router = Router();

router.get("/freeed", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.use("/auth", authRouter);      
router.use("/clientes", clientesRouter); 
router.use("/categorias", categoriasRouter);
router.use("/cursos", cursosRouter);

export default router;
