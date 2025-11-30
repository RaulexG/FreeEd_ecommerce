import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import frontendRoutes from "./routes/frontend.routes.js";

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Obtener __dirname en ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos (imágenes del frontend)
app.use("/static", express.static(path.join(__dirname, "frontend", "assets")));

app.use(express.json());

// RUTAS DE LA API
app.use("/api", routes);

// RUTAS DEL FRONTEND
app.use("/", frontendRoutes);

// 404 y errores
app.use(notFound);
app.use(errorHandler);

export default app;
