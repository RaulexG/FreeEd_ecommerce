// src/repositories/categoria.repository.js
import { pool } from "../utils/db.js";

export const categoriaRepository = {
  async findAll({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.query(
      `SELECT 
         id, 
         nombre, 
         descripcion, 
         activo
       FROM categorias_curso
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
         id, 
         nombre, 
         descripcion, 
         activo
       FROM categorias_curso
       WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  },

  async create({ nombre, descripcion = null, activo = true }) {
    const [result] = await pool.query(
      `INSERT INTO categorias_curso (nombre, descripcion, activo)
       VALUES (?, ?, ?)`,
      [nombre, descripcion, activo ? 1 : 0]
    );

    const [rows] = await pool.query(
      `SELECT 
         id, 
         nombre, 
         descripcion, 
         activo
       FROM categorias_curso
       WHERE id = ?`,
      [result.insertId]
    );
    return rows[0] ?? null;
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }

    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }

    if (data.activo !== undefined) {
      fields.push("activo = ?");
      values.push(data.activo ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE categorias_curso SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id);
  },

  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM categorias_curso WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },
};
