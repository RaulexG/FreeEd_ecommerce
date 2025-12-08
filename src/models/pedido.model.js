// src/models/pedido.model.js
import { pool } from "../utils/db.js";

/**
 * Crea un nuevo pedido.
 * Por defecto se crea como 'CARRITO'.
 */
export async function createPedido({
  clienteId,
  estado = "CARRITO",
  total = 0,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO pedidos (cliente_id, estado, total)
    VALUES (?, ?, ?)
  `,
    [clienteId, estado, total]
  );

  return findPedidoById(result.insertId);
}

/**
 * Busca un pedido por ID.
 */
export async function findPedidoById(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedidos
    WHERE id = ?
  `,
    [id]
  );

  return rows[0] || null;
}

/**
 * Lista pedidos con filtros opcionales por cliente y/o estado.
 * Ejemplo: findPedidos({ clienteId: 1, estado: 'COMPLETADO' })
 */
export async function findPedidos({ clienteId, estado } = {}) {
  const conditions = [];
  const params = [];

  if (clienteId) {
    conditions.push("cliente_id = ?");
    params.push(clienteId);
  }

  if (estado) {
    conditions.push("estado = ?");
    params.push(estado);
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedidos
    ${whereClause}
    ORDER BY created_at DESC
  `,
    params
  );

  return rows;
}

/**
 * Actualiza solo el estado de un pedido.
 */
export async function updatePedidoEstado(id, estado) {
  await pool.query(
    `
    UPDATE pedidos
    SET estado = ?
    WHERE id = ?
  `,
    [estado, id]
  );

  return findPedidoById(id);
}

/**
 * Actualiza el total de un pedido.
 * (normalmente lo recalcularemos desde los detalles)
 */
export async function updatePedidoTotal(id, total) {
  await pool.query(
    `
    UPDATE pedidos
    SET total = ?
    WHERE id = ?
  `,
    [total, id]
  );

  return findPedidoById(id);
}

/**
 * Elimina un pedido (se borran en cascada sus detalles).
 */
export async function deletePedido(id) {
  const [result] = await pool.query(
    `
    DELETE FROM pedidos
    WHERE id = ?
  `,
    [id]
  );

  return result.affectedRows > 0;
}

/* =========================================================
   Funciones pensadas específicamente para el CARRITO
   (estado = 'CARRITO')
   ========================================================= */

/**
 * Devuelve el carrito activo de un cliente (pedido con estado 'CARRITO').
 */
export async function findCarritoActivoByCliente(clienteId) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedidos
    WHERE cliente_id = ?
      AND estado = 'CARRITO'
    ORDER BY created_at DESC
    LIMIT 1
  `,
    [clienteId]
  );

  return rows[0] || null;
}

/**
 * Obtiene el carrito activo o lo crea si no existe.
 * No recalcula totales todavía, eso lo haremos en el servicio.
 */
export async function getOrCreateCarrito(clienteId) {
  const existing = await findCarritoActivoByCliente(clienteId);
  if (existing) return existing;

  return createPedido({
    clienteId,
    estado: "CARRITO",
    total: 0,
  });
}
