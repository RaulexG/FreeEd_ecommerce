// src/repositories/curso.repository.js
import { pool } from "../utils/db.js";

export const cursoRepository = {
  // ============================
  // LISTAR TODOS LOS CURSOS
  // ============================
  async findAll() {
    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.titulo,
        c.descripcion,
        c.precio,
        c.nivel,
        c.duracion_horas     AS duracionHoras,
        c.portada_url        AS portadaUrl,
        c.estado,
        c.categoria_id       AS categoriaId,
        cat.nombre           AS categoriaNombre,
        c.created_at         AS createdAt,
        c.updated_at         AS updatedAt
      FROM cursos c
      JOIN categorias_curso cat ON cat.id = c.categoria_id
      ORDER BY c.created_at DESC
      `
    );
    return rows;
  },

  // ============================
  // OBTENER CURSO POR ID
  // ============================
  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        c.id,
        c.titulo,
        c.descripcion,
        c.precio,
        c.nivel,
        c.duracion_horas     AS duracionHoras,
        c.portada_url        AS portadaUrl,
        c.estado,
        c.categoria_id       AS categoriaId,
        cat.nombre           AS categoriaNombre,
        c.created_at         AS createdAt,
        c.updated_at         AS updatedAt
      FROM cursos c
      JOIN categorias_curso cat ON cat.id = c.categoria_id
      WHERE c.id = ?
      `,
      [id]
    );

    return rows[0] ?? null;
  },

  // ============================
  // CREAR CURSO
  // ============================
  async create({
    categoriaId,
    titulo,
    descripcion,
    nivel,
    precio,
    duracionHoras,
    portadaUrl,
    estado,
  }) {
    const [result] = await pool.query(
      `
      INSERT INTO cursos (
        categoria_id,
        titulo,
        descripcion,
        nivel,
        precio,
        duracion_horas,
        portada_url,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        categoriaId,
        titulo,
        descripcion,
        nivel,
        precio,
        duracionHoras ?? null,
        portadaUrl ?? null,
        estado,
      ]
    );

    return this.findById(result.insertId);
  },

  // ============================
  // ACTUALIZAR CURSO
  // ============================
  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.titulo !== undefined) {
      fields.push("titulo = ?");
      values.push(data.titulo);
    }
    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }
    if (data.categoriaId !== undefined) {
      fields.push("categoria_id = ?");
      values.push(data.categoriaId);
    }
    if (data.precio !== undefined) {
      fields.push("precio = ?");
      values.push(data.precio);
    }
    if (data.nivel !== undefined) {
      fields.push("nivel = ?");
      values.push(data.nivel);
    }
    if (data.duracionHoras !== undefined) {
      fields.push("duracion_horas = ?");
      values.push(data.duracionHoras);
    }
    if (data.portadaUrl !== undefined) {
      fields.push("portada_url = ?");
      values.push(data.portadaUrl);
    }
    if (data.estado !== undefined) {
      fields.push("estado = ?");
      values.push(data.estado);
    }

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE cursos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id);
  },

  // ============================
  // ELIMINAR CURSO
  // ============================
  async remove(id) {
    const [result] = await pool.query(
      `DELETE FROM cursos WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  },
};
