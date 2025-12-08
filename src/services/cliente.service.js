import bcrypt from "bcryptjs";
import { clienteRepository } from "../repositories/cliente.repository.js";

export const clienteService = {
  async listar() {
    return clienteRepository.findAll();
  },

  async obtener(id) {
    const c = await clienteRepository.findById(id);
    if (!c) {
      const err = new Error("Cliente no encontrado");
      err.status = 404;
      throw err;
    }
    return c;
  },

  async crear({ nombre, email, password, rol, activo }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return await clienteRepository.create({
        nombre,
        email,
        passwordHash,
        rol: rol || "CLIENTE",
        activo: activo ?? true,
      });
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("Email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async actualizar(id, { nombre, email, password, rol, activo }) {
    try {
      const data = { nombre, email, rol, activo };
      if (password !== undefined) {
        data.passwordHash = await bcrypt.hash(password, 10);
      }

      const updated = await clienteRepository.update(id, data);
      if (!updated) {
        const err = new Error("Cliente no encontrado");
        err.status = 404;
        throw err;
      }
      return updated;
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("Email ya está registrado");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async eliminar(id) {
    const ok = await clienteRepository.remove(id);
    if (!ok) {
      const err = new Error("Cliente no encontrado");
      err.status = 404;
      throw err;
    }
  },
};
