// src/controllers/pedido.controller.js
import {
    listarPedidosDeCliente,
    obtenerPedidoDeCliente,
    listarPedidosAdmin,
    obtenerPedidoAdmin,
  } from "../services/pedido.service.js";
  
  export async function listarMisPedidos(req, res, next) {
    try {
      const clienteId = req.user.id;
      const pedidos = await listarPedidosDeCliente(clienteId);
      res.json(pedidos);
    } catch (err) {
      next(err);
    }
  }
  
  export async function obtenerMiPedido(req, res, next) {
    try {
      const clienteId = req.user.id;
      const pedidoId = Number(req.params.id);
  
      const data = await obtenerPedidoDeCliente(clienteId, pedidoId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
  
  // --- Endpoints para ADMIN ---
  
  export async function listarPedidosAdminController(req, res, next) {
    try {
      if (req.user.rol !== "ADMIN") {
        return res.status(403).json({ message: "Acceso sólo para administradores" });
      }
  
      const pedidos = await listarPedidosAdmin();
      res.json(pedidos);
    } catch (err) {
      next(err);
    }
  }
  
  export async function obtenerPedidoAdminController(req, res, next) {
    try {
      if (req.user.rol !== "ADMIN") {
        return res.status(403).json({ message: "Acceso sólo para administradores" });
      }
  
      const pedidoId = Number(req.params.id);
      const data = await obtenerPedidoAdmin(pedidoId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
  