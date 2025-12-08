// src/services/carrito.service.js
import { pool } from "../utils/db.js";
import {
  getOrCreateCarrito,
  findCarritoActivoByCliente,
  updatePedidoTotal,
  updatePedidoEstado,
  findPedidoById,
} from "../models/pedido.model.js";

import {
  createDetalle,
  findDetalleByPedidoAndCurso,
  findDetallesConCursoByPedido,
  deleteDetalle,
  deleteDetallesByPedido,
  updateDetalle,
} from "../models/pedidoDetalle.model.js";

// helpers internos

async function obtenerCursoParaCarrito(cursoId) {
  const [rows] = await pool.query(
    `
    SELECT id, titulo, precio, estado
    FROM cursos
    WHERE id = ?
  `,
    [cursoId]
  );

  const curso = rows[0];
  if (!curso) throw new Error("Curso no encontrado");
  if (String(curso.estado).toUpperCase() !== "PUBLICADO") {
    throw new Error("El curso no está disponible para la venta");
  }

  return curso;
}

async function recalcularTotalPedido(pedidoId) {
  const [rows] = await pool.query(
    `
    SELECT SUM(subtotal) AS total
    FROM pedido_detalles
    WHERE pedido_id = ?
  `,
    [pedidoId]
  );

  const total = Number(rows[0]?.total || 0);
  await updatePedidoTotal(pedidoId, total);
  return total;
}

// API del carrito

export async function obtenerCarrito(clienteId) {
  const carrito = await getOrCreateCarrito(clienteId);
  const detalles = await findDetallesConCursoByPedido(carrito.id);

  const total = await recalcularTotalPedido(carrito.id);

  return {
    pedido: { ...carrito, total },
    detalles,
  };
}

export async function agregarCursoAlCarrito({
  clienteId,
  cursoId,
  cantidad = 1,
}) {
  if (cantidad <= 0) throw new Error("Cantidad inválida");

  const curso = await obtenerCursoParaCarrito(cursoId);
  const carrito = await getOrCreateCarrito(clienteId);

  const existente = await findDetalleByPedidoAndCurso(carrito.id, curso.id);
  const precio = Number(curso.precio || 0);

  // Regla FreeEd: un mismo curso sólo una vez en el carrito, cantidad fija en 1
  if (existente) {
    await recalcularTotalPedido(carrito.id);
    return obtenerCarrito(clienteId);
  }

  const subtotal = precio;

  await createDetalle({
    pedidoId: carrito.id,
    cursoId: curso.id,
    cantidad: 1,
    precioUnitario: precio,
    subtotal,
  });

  await recalcularTotalPedido(carrito.id);
  return obtenerCarrito(clienteId);
}

export async function actualizarCantidadCarrito({
  clienteId,
  detalleId,
  cantidad,
}) {
  const carrito = await findCarritoActivoByCliente(clienteId);
  if (!carrito) throw new Error("No hay carrito activo");

  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedido_detalles
    WHERE id = ?
      AND pedido_id = ?
  `,
    [detalleId, carrito.id]
  );

  const detalle = rows[0];
  if (!detalle) throw new Error("Detalle no encontrado en tu carrito");

  const cantidadNormalizada = cantidad <= 0 ? 0 : 1;

  if (cantidadNormalizada === 0) {
    return eliminarDetalleCarrito({ clienteId, detalleId });
  }

  const curso = await obtenerCursoParaCarrito(detalle.curso_id);
  const precio = Number(curso.precio || 0);
  const subtotal = precio;

  await updateDetalle({
    id: detalle.id,
    cantidad: 1,
    precioUnitario: precio,
    subtotal,
  });

  await recalcularTotalPedido(carrito.id);
  return obtenerCarrito(clienteId);
}

export async function eliminarDetalleCarrito({ clienteId, detalleId }) {
  const carrito = await findCarritoActivoByCliente(clienteId);
  if (!carrito) throw new Error("No hay carrito activo");

  const [rows] = await pool.query(
    `
    SELECT *
    FROM pedido_detalles
    WHERE id = ?
      AND pedido_id = ?
  `,
    [detalleId, carrito.id]
  );

  const detalle = rows[0];
  if (!detalle) throw new Error("Detalle no encontrado en tu carrito");

  await deleteDetalle(detalle.id);
  await recalcularTotalPedido(carrito.id);

  return obtenerCarrito(clienteId);
}

export async function vaciarCarrito(clienteId) {
  const carrito = await findCarritoActivoByCliente(clienteId);
  if (!carrito) return null;

  await deleteDetallesByPedido(carrito.id);
  await updatePedidoTotal(carrito.id, 0);

  return obtenerCarrito(clienteId);
}

export async function confirmarCarrito(clienteId) {
  const carrito = await findCarritoActivoByCliente(clienteId);
  if (!carrito) throw new Error("No hay carrito activo");

  const detalles = await findDetallesConCursoByPedido(carrito.id);
  if (!detalles.length) {
    throw new Error("No puedes confirmar un carrito vacío");
  }

  const total = await recalcularTotalPedido(carrito.id);

  await updatePedidoEstado(carrito.id, "COMPLETADO");
  const pedidoFinal = await findPedidoById(carrito.id);

  return {
    pedido: { ...pedidoFinal, total },
    detalles,
  };
}
