// src/controllers/curso.controller.js
import {
  CursoCreateSchema,
  CursoUpdateSchema,
} from "../models/curso.model.js";
import { cursoService } from "../services/curso.service.js";

export const listarCursos = async (_req, res, next) => {
  try {
    const data = await cursoService.listar();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const obtenerCurso = async (req, res, next) => {
  try {
    const curso = await cursoService.obtener(req.params.id);
    res.json(curso);
  } catch (e) {
    next(e);
  }
};

export const crearCurso = async (req, res, next) => {
  try {
    const parsed = CursoCreateSchema.parse(req.body);
    const curso = await cursoService.crear(parsed);
    res.status(201).json(curso);
  } catch (e) {
    next(e);
  }
};

export const actualizarCurso = async (req, res, next) => {
  try {
    const payload = CursoUpdateSchema.parse(req.body);
    const curso = await cursoService.actualizar(req.params.id, payload);
    res.json(curso);
  } catch (e) {
    next(e);
  }
};

export const eliminarCurso = async (req, res, next) => {
  try {
    await cursoService.eliminar(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
