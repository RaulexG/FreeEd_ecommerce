import app from "./app.js";
import { ensureAdminUser } from "./utils/adminSeed.js";

const PORT = process.env.PORT ?? 8080;

async function startServer() {
  try {
    // Crear admin si no existe
    await ensureAdminUser();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();
