// src/models/pedidoDetalle.model.js
import { pool } from "../utils/db.js";

export async function createDetalle({
  pedidoId,
  cursoId,
  cantidad,
  precioUnitario,
  subtotal,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO pedido_detalles (pedido_id, curso_id, cantidad, precio_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?)
  `,
    [pedidoId, cursoId, cantidad, precioUnitario, subtotal]
  );

  return findDetalleById(result.insertId);
}

export async function findDetalleById(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedido_detalles
    WHERE id = ?
  `,
    [id]
  );

  return rows[0] || null;
}

export async function findDetallesByPedido(pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedido_detalles
    WHERE pedido_id = ?
    ORDER BY id ASC
  `,
    [pedidoId]
  );

  return rows;
}

/* detalle concreto del mismo curso dentro de un pedido */
export async function findDetalleByPedidoAndCurso(pedidoId, cursoId) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedido_detalles
    WHERE pedido_id = ?
      AND curso_id = ?
    LIMIT 1
  `,
    [pedidoId, cursoId]
  );

  return rows[0] || null;
}

export async function findDetallesConCursoByPedido(pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT 
      d.id,
      d.pedido_id,
      d.curso_id,
      d.cantidad,
      d.precio_unitario,
      d.subtotal,
      c.titulo       AS curso_titulo,
      c.portada_url  AS curso_portada,
      c.nivel        AS curso_nivel
    FROM pedido_detalles d
    INNER JOIN cursos c
      ON d.curso_id = c.id
    WHERE d.pedido_id = ?
    ORDER BY d.id ASC
  `,
    [pedidoId]
  );

  return rows;
}

export async function updateDetalle({
  id,
  cantidad,
  precioUnitario,
  subtotal,
}) {
  await pool.query(
    `
    UPDATE pedido_detalles
    SET cantidad = ?,
        precio_unitario = ?,
        subtotal = ?
    WHERE id = ?
  `,
    [cantidad, precioUnitario, subtotal, id]
  );

  return findDetalleById(id);
}

export async function deleteDetalle(id) {
  const [result] = await pool.query(
    `
    DELETE FROM pedido_detalles
    WHERE id = ?
  `,
    [id]
  );

  return result.affectedRows > 0;
}

export async function deleteDetallesByPedido(pedidoId) {
  await pool.query(
    `
    DELETE FROM pedido_detalles
    WHERE pedido_id = ?
  `,
    [pedidoId]
  );
}
