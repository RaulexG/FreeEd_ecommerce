// src/services/pedido.service.js
import { pool } from "../utils/db.js";
import { findDetallesConCursoByPedido } from "../models/pedidoDetalle.model.js";

// Pedidos de un cliente (sin incluir el carrito en curso)
export async function listarPedidosDeCliente(clienteId) {
  const [rows] = await pool.query(
    `
    SELECT id, cliente_id, estado, total, created_at, updated_at
    FROM pedidos
    WHERE cliente_id = ?
      AND estado <> 'CARRITO'
    ORDER BY created_at DESC
    `,
    [clienteId]
  );

  return rows;
}

export async function obtenerPedidoDeCliente(clienteId, pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT id, cliente_id, estado, total, created_at, updated_at
    FROM pedidos
    WHERE id = ?
      AND cliente_id = ?
      AND estado <> 'CARRITO'
    LIMIT 1
    `,
    [pedidoId, clienteId]
  );

  const pedido = rows[0];
  if (!pedido) {
    throw new Error("Pedido no encontrado para este cliente");
  }

  const detalles = await findDetallesConCursoByPedido(pedido.id);

  return { pedido, detalles };
}

// Admin: todos los pedidos (sin incluir carritos)
export async function listarPedidosAdmin() {
  const [rows] = await pool.query(
    `
    SELECT p.id,
           p.cliente_id,
           p.estado,
           p.total,
           p.created_at,
           p.updated_at,
           c.nombre AS cliente_nombre,
           c.email  AS cliente_email
    FROM pedidos p
    JOIN clientes c ON c.id = p.cliente_id
    WHERE p.estado <> 'CARRITO'
    ORDER BY p.created_at DESC
    `
  );

  return rows;
}

export async function obtenerPedidoAdmin(pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT p.id,
           p.cliente_id,
           p.estado,
           p.total,
           p.created_at,
           p.updated_at,
           c.nombre AS cliente_nombre,
           c.email  AS cliente_email
    FROM pedidos p
    JOIN clientes c ON c.id = p.cliente_id
    WHERE p.id = ?
      AND p.estado <> 'CARRITO'
    LIMIT 1
    `,
    [pedidoId]
  );

  const pedido = rows[0];
  if (!pedido) {
    throw new Error("Pedido no encontrado");
  }

  const detalles = await findDetallesConCursoByPedido(pedido.id);

  return { pedido, detalles };
}
