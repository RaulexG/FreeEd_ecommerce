// src/services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginSchema } from "../models/auth.model.js";
import { clienteRepository } from "../repositories/cliente.repository.js";

const { JWT_SECRET, JWT_EXPIRES_IN = "1h" } = process.env;

if (!JWT_SECRET) {
  console.warn("Falta JWT_SECRET en el .env");
}

export const authService = {
  async login(payload) {
    // Validar datos de entrada con Zod
    const parsed = LoginSchema.safeParse(payload);
    if (!parsed.success) {
      const error = new Error("Datos de login inválidos");
      error.status = 400;
      error.details = parsed.error.flatten();
      throw error;
    }

    const { email, password } = parsed.data;

    // Buscar cliente por email
    const user = await clienteRepository.findByEmail(email);
    if (!user || !user.activo) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    // Comparar contraseña
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    // Payload del token: incluimos también el rol
    const tokenPayload = {
      id: user.id,
      email: user.email,
      rol: user.rol
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    // Limpiar datos sensibles
    const { password_hash, ...safeUser } = user;

    return {
      token,
      user: safeUser
    };
  }
};
