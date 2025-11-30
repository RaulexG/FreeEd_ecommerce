// src/models/curso.model.js
import { z } from "zod";

export const nivelesCurso = ["BÁSICO", "INTERMEDIO", "AVANZADO"];
export const estadosCurso = ["BORRADOR", "PUBLICADO", "PAUSADO"];

// Para crear cursos
export const CursoCreateSchema = z.object({
  titulo: z.string().min(1, "título requerido").trim(),
  descripcion: z.string().min(1, "descripción requerida").trim(),
  categoriaId: z.number().int().positive(),
  precio: z.number().nonnegative(),
  // opcionales, tienen default en la BD
  nivel: z.enum(nivelesCurso).optional(),
  duracionHoras: z.number().positive().optional(),
  portadaUrl: z.string().url().trim().optional(),
  estado: z.enum(estadosCurso).optional()
});

// Para actualizar cursos (todo opcional)
export const CursoUpdateSchema = z.object({
  titulo: z.string().min(1).trim().optional(),
  descripcion: z.string().min(1).trim().optional(),
  categoriaId: z.number().int().positive().optional(),
  precio: z.number().nonnegative().optional(),
  nivel: z.enum(nivelesCurso).optional(),
  duracionHoras: z.number().positive().optional(),
  portadaUrl: z.string().url().trim().optional(),
  estado: z.enum(estadosCurso).optional()
});
