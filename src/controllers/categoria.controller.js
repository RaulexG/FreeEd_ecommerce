// src/controllers/categoria.controller.js
import { categoriaService } from "../services/categoria.service.js";

export const listarCategorias = async (req, res, next) => {
  try {
    const data = await categoriaService.listar();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

export const obtenerCategoria = async (req, res, next) => {
  try {
    const cat = await categoriaService.obtener(req.params.id);
    res.json(cat);
  } catch (e) {
    next(e);
  }
};

export const crearCategoria = async (req, res, next) => {
  try {
    // el service valida con Zod
    const cat = await categoriaService.crear(req.body);
    res.status(201).json(cat);
  } catch (e) {
    next(e);
  }
};

export const actualizarCategoria = async (req, res, next) => {
  try {
    // el service valida con Zod
    const cat = await categoriaService.actualizar(req.params.id, req.body);
    res.json(cat);
  } catch (e) {
    next(e);
  }
};

export const eliminarCategoria = async (req, res, next) => {
  try {
    await categoriaService.eliminar(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
