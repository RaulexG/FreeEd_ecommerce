// src/controllers/carrito.controller.js
import {
    obtenerCarrito,
    agregarCursoAlCarrito,
    actualizarCantidadCarrito,
    eliminarDetalleCarrito,
    vaciarCarrito,
    confirmarCarrito,
  } from "../services/carrito.service.js";
  
  export async function obtenerCarritoActual(req, res, next) {
    try {
      const clienteId = req.user.id;
      const data = await obtenerCarrito(clienteId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  export async function agregarItemCarrito(req, res, next) {
    try {
      const clienteId = req.user.id;
      const { cursoId, cantidad } = req.body;
  
      if (!cursoId) {
        return res.status(400).json({ message: "cursoId es obligatorio" });
      }
  
      const data = await agregarCursoAlCarrito({
        clienteId,
        cursoId,
        cantidad: cantidad ?? 1,
      });
  
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
  
  export async function actualizarItemCarrito(req, res, next) {
    try {
      const clienteId = req.user.id;
      const detalleId = Number(req.params.id);
      const { cantidad } = req.body;
  
      if (!detalleId || !Number.isInteger(detalleId)) {
        return res.status(400).json({ message: "ID de detalle inválido" });
      }
  
      if (cantidad == null) {
        return res.status(400).json({ message: "cantidad es obligatoria" });
      }
  
      const data = await actualizarCantidadCarrito({
        clienteId,
        detalleId,
        cantidad: Number(cantidad),
      });
  
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  export async function eliminarItemCarrito(req, res, next) {
    try {
      const clienteId = req.user.id;
      const detalleId = Number(req.params.id);
  
      if (!detalleId || !Number.isInteger(detalleId)) {
        return res.status(400).json({ message: "ID de detalle inválido" });
      }
  
      const data = await eliminarDetalleCarrito({ clienteId, detalleId });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  export async function vaciarCarritoActual(req, res, next) {
    try {
      const clienteId = req.user.id;
      const data = await vaciarCarrito(clienteId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  
  export async function confirmarCarritoActual(req, res, next) {
    try {
      const clienteId = req.user.id;
      const data = await confirmarCarrito(clienteId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  