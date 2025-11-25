import express from "express";
import "dotenv/config";

import routes from "./routes/index.js";                 // API (/api)
import frontendRoutes from "./routes/frontend.routes.js"; // FRONTEND (/, /login, /registro)

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());


//RUTAS DE LA API (JSON)

app.use("/api", routes);

//RUTAS DEL FRONTEND (HTML)

app.use("/", frontendRoutes);


//404 Y MANEJADOR DE ERRORES

app.use(notFound);
app.use(errorHandler);

export default app;
