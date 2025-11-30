// src/services/curso.service.js
import { CursoCreateSchema, CursoUpdateSchema } from "../models/curso.model.js";
import { cursoRepository } from "../repositories/curso.repository.js";

export const cursoService = {
  async listar() {
    return cursoRepository.findAll();
  },

  async obtener(id) {
    const curso = await cursoRepository.findById(id);
    if (!curso) {
      const err = new Error("Curso no encontrado");
      err.status = 404;
      throw err;
    }
    return curso;
  },

  async crear({ instructorId, ...payload }) {
    const parsed = CursoCreateSchema.safeParse(payload);
    if (!parsed.success) {
      const err = new Error("Datos de curso inválidos");
      err.status = 400;
      err.details = parsed.error.flatten();
      throw err;
    }

    try {
      return await cursoRepository.create({
        instructorId,
        ...parsed.data
      });
    } catch (e) {
      // Clave foránea inválida (categoria_id)
      if (e?.code === "ER_NO_REFERENCED_ROW_2" || e?.errno === 1452) {
        const err = new Error("La categoría indicada no existe");
        err.status = 400;
        throw err;
      }
      throw e;
    }
  },

  async actualizar(id, payload) {
    const parsed = CursoUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      const err = new Error("Datos de curso inválidos");
      err.status = 400;
      err.details = parsed.error.flatten();
      throw err;
    }

    try {
      const updated = await cursoRepository.update(id, parsed.data);
      if (!updated) {
        const err = new Error("Curso no encontrado");
        err.status = 404;
        throw err;
      }
      return updated;
    } catch (e) {
      if (e?.code === "ER_NO_REFERENCED_ROW_2" || e?.errno === 1452) {
        const err = new Error("La categoría indicada no existe");
        err.status = 400;
        throw err;
      }
      throw e;
    }
  },

  async eliminar(id) {
    const ok = await cursoRepository.remove(id);
    if (!ok) {
      const err = new Error("Curso no encontrado");
      err.status = 404;
      throw err;
    }
  }
};
