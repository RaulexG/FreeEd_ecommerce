-- =========================================================
-- Script de creación de base de datos: freeed_db
-- Proyecto: FreeEd - Plataforma de educación en línea
-- Autor: Raulex cn
-- =========================================================

-- 1) Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS `freeed_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 2) Usar la base
USE `freeed_db`;

-- 3) Crear usuario del proyecto
--    Este usuario es el mismo que se usa en el archivo .env
CREATE USER 'Raulcn'@'localhost'
  IDENTIFIED BY 'FreeEd25';

-- 4) Otorgar permisos al usuario sobre la base de datos del proyecto
GRANT ALL PRIVILEGES ON `freeed_db`.*
  TO 'Raulcn'@'localhost';

FLUSH PRIVILEGES;

-- 5) Crear tabla clientes (si no existe)
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_clientes_email` (`email`),
  KEY `idx_clientes_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- 6) Insertar usuario de prueba para login

INSERT INTO `clientes` (nombre, email, password_hash, activo)
VALUES (
  'raulex cn',
  'raulex@gmail.com',
  '$2a$12$gDE9u3UW5tZylwZNd7/a9.KPjz3dmh0CnfSvBfQCPeW2/2duStW8i',
  1
);

-- =========================================================
-- MODELO COMPLETO DE FREEED (ECOMMERCE DE CURSOS)
-- =========================================================


-- PERFILES DE ESTUDIANTE 
CREATE TABLE IF NOT EXISTS `perfiles_estudiante` (
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `telefono` VARCHAR(30) NULL,
  `carrera` VARCHAR(120) NULL,
  `universidad` VARCHAR(150) NULL,
  `ciudad` VARCHAR(120) NULL,
  `pais` VARCHAR(120) NULL,
  `bio` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cliente_id`),
  CONSTRAINT `fk_perfiles_estudiante_cliente`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- CATEGORÍAS DE CURSO
CREATE TABLE IF NOT EXISTS `categorias_curso` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(120) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categorias_curso_nombre` (`nombre`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- CURSOS
CREATE TABLE IF NOT EXISTS `cursos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `instructor_id` BIGINT UNSIGNED NOT NULL,
  `categoria_id` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `nivel` ENUM('BÁSICO','INTERMEDIO','AVANZADO') NOT NULL DEFAULT 'BÁSICO',
  `precio` DECIMAL(10,2) NOT NULL,
  `duracion_horas` DECIMAL(5,2) NULL,
  `portada_url` VARCHAR(255) NULL,
  `estado` ENUM('BORRADOR','PUBLICADO','PAUSADO') NOT NULL DEFAULT 'PUBLICADO',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cursos_instructor` (`instructor_id`),
  KEY `idx_cursos_categoria` (`categoria_id`),
  CONSTRAINT `fk_cursos_instructor`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `clientes`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cursos_categoria`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `categorias_curso`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- PEDIDOS
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `estado` ENUM(
    'CARRITO',
    'PENDIENTE',
    'EN_PROCESO',
    'COMPLETADO',
    'CANCELADO'
  ) NOT NULL DEFAULT 'CARRITO',
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pedidos_cliente` (`cliente_id`),
  CONSTRAINT `fk_pedidos_cliente`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- DETALLE DE PEDIDOS
CREATE TABLE IF NOT EXISTS `pedido_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` BIGINT UNSIGNED NOT NULL,
  `curso_id` BIGINT UNSIGNED NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_detalles_pedido` (`pedido_id`),
  KEY `idx_detalles_curso` (`curso_id`),
  CONSTRAINT `fk_detalles_pedido`
    FOREIGN KEY (`pedido_id`)
    REFERENCES `pedidos`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_detalles_curso`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- RESEÑAS DE CURSOS
CREATE TABLE IF NOT EXISTS `reseñas_curso` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `curso_id` BIGINT UNSIGNED NOT NULL,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `calificacion` TINYINT NOT NULL,
  `comentario` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reseñas_curso` (`curso_id`),
  KEY `idx_reseñas_cliente` (`cliente_id`),
  CONSTRAINT `fk_reseñas_curso`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_reseñas_cliente`
    FOREIGN KEY (`cliente_id`)
    REFERENCES `clientes`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;



-- CATEGORÍAS DE PRUEBA
INSERT INTO `categorias_curso` (nombre, descripcion, activo) VALUES
  ('Programación', 'Cursos de desarrollo y software', 1),
  ('Diseño y multimedia', 'Cursos de diseño gráfico y edición', 1),
  ('Idiomas', 'Cursos de idiomas', 1),
  ('Habilidades académicas', 'Lectura, redacción y más', 1)
ON DUPLICATE KEY UPDATE
  descripcion = VALUES(descripcion),
  activo      = VALUES(activo);

SHOW TABLES FROM freeed_db;