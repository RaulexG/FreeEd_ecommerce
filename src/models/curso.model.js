// src/models/curso.model.js
import { z } from "zod";

export const nivelesCurso = ["BÁSICO", "INTERMEDIO", "AVANZADO"];
export const estadosCurso = ["BORRADOR", "PUBLICADO", "PAUSADO"];

// Crear curso
export const CursoCreateSchema = z.object({
  titulo: z.string().min(1, "título requerido").trim(),
  descripcion: z.string().min(1, "descripción requerida").trim(),
  categoriaId: z.number().int().positive(),
  precio: z.number().nonnegative(),

  nivel: z.enum(nivelesCurso).default("BÁSICO").optional(),

  duracionHoras: z
    .number({
      invalid_type_error: "duracionHoras debe ser numérico",
    })
    .nonnegative()
    .nullable()
    .optional(),

  portadaUrl: z
    .string()
    .trim()
    .url("portadaUrl debe ser una URL válida")
    .nullable()
    .optional(),

  estado: z.enum(estadosCurso).default("PUBLICADO").optional(),
});

// Actualizar curso
export const CursoUpdateSchema = z.object({
  titulo: z.string().min(1).trim().optional(),
  descripcion: z.string().min(1).trim().optional(),
  categoriaId: z.number().int().positive().optional(),
  precio: z.number().nonnegative().optional(),
  nivel: z.enum(nivelesCurso).optional(),

  duracionHoras: z
    .number({
      invalid_type_error: "duracionHoras debe ser numérico",
    })
    .nonnegative()
    .nullable()
    .optional(),

  portadaUrl: z.string().trim().optional(),

  estado: z.enum(estadosCurso).optional(),
});
