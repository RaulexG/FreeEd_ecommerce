// src/utils/adminSeed.js
import { pool } from "./db.js";   // 👈 CAMBIO: antes era "import pool from ...";
import bcrypt from "bcryptjs";

/**
 * Crea el usuario ADMIN inicial si no existe.
 * Se ejecuta al iniciar el servidor.
 */
export async function ensureAdminUser() {
  const adminName = "Raúl Chavira";
  const adminEmail = "raulex@gmail.com";
  const adminPassword = "Admin123";

  let connection;

  try {
    connection = await pool.getConnection();

    // Verificar si ya existe un ADMIN
    const [rows] = await connection.query(
      `SELECT id FROM clientes WHERE rol = 'ADMIN' LIMIT 1`
    );

    if (rows.length > 0) {
      console.log("[adminSeed] Ya existe un usuario ADMIN. No se crea otro.");
      return;
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Insertar admin
    await connection.query(
      `INSERT INTO clientes (nombre, email, password_hash, rol, activo)
       VALUES (?, ?, ?, 'ADMIN', 1)`,
      [adminName, adminEmail, passwordHash]
    );

    console.log("=======================================");
    console.log("[adminSeed] Usuario ADMIN creado");
    console.log("Email:    ", adminEmail);
    console.log("Password: ", adminPassword);
    console.log("=======================================");

  } catch (error) {
    console.error("[adminSeed] Error:", error);
  } finally {
    if (connection) connection.release();
  }
}
