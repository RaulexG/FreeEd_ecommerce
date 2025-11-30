// src/services/categoria.service.js
import { categoriaRepository } from "../repositories/categoria.repository.js";
import { CategoriaCreateSchema, CategoriaUpdateSchema } from "../models/categoria.model.js";

export const categoriaService = {
  async listar() {
    return categoriaRepository.findAll();
  },

  async obtener(id) {
    const cat = await categoriaRepository.findById(id);
    if (!cat) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
    return cat;
  },

  async crear(data) {
    // validar con Zod
    const parsed = CategoriaCreateSchema.safeParse(data);
    if (!parsed.success) {
      const err = new Error("Datos inválidos");
      err.status = 400;
      err.details = parsed.error.flatten();
      throw err;
    }

    try {
      return await categoriaRepository.create(parsed.data);
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("El nombre de categoría ya existe");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async actualizar(id, data) {
    // validar con Zod
    const parsed = CategoriaUpdateSchema.safeParse(data);
    if (!parsed.success) {
      const err = new Error("Datos inválidos");
      err.status = 400;
      err.details = parsed.error.flatten();
      throw err;
    }

    try {
      const updated = await categoriaRepository.update(id, parsed.data);

      if (!updated) {
        const err = new Error("Categoría no encontrada");
        err.status = 404;
        throw err;
      }

      return updated;
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY" || e?.errno === 1062) {
        const err = new Error("El nombre de categoría ya existe");
        err.status = 409;
        throw err;
      }
      throw e;
    }
  },

  async eliminar(id) {
    const ok = await categoriaRepository.remove(id);
    if (!ok) {
      const err = new Error("Categoría no encontrada");
      err.status = 404;
      throw err;
    }
  }
};
