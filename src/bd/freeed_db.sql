-- =========================================================
-- Proyecto: FreeEd - Plataforma de cursos digitales
-- Autor: Raúl Chavira Narváez
-- Versión: Modelo LMS + Ecommerce (un solo administrador)
-- =========================================================

-- ============= CREACIÓN DE BASE DE DATOS =============
CREATE DATABASE IF NOT EXISTS `freeed_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `freeed_db`;

-- Crear usuario del proyecto
CREATE USER IF NOT EXISTS 'Raulcn'@'localhost'
  IDENTIFIED BY 'FreeEd25';

-- Otorgar permisos al usuario
GRANT ALL PRIVILEGES ON `freeed_db`.*
  TO 'Raulcn'@'localhost';

FLUSH PRIVILEGES;

-- =========================================================
-- CLIENTES 
-- =========================================================

CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,

  -- Datos opcionales del perfil
  `telefono` VARCHAR(30) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `fecha_nacimiento` DATE NULL,
  `genero` ENUM('MASCULINO','FEMENINO','OTRO') NULL,

  `rol` ENUM('CLIENTE','ADMIN') NOT NULL DEFAULT 'CLIENTE',
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

-- =========================================================
-- CATEGORÍAS DE CURSO
-- =========================================================

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


-- =========================================================
-- CURSOS
-- =========================================================

CREATE TABLE IF NOT EXISTS `cursos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
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
  KEY `idx_cursos_categoria` (`categoria_id`),
  CONSTRAINT `fk_cursos_categoria`
    FOREIGN KEY (`categoria_id`)
    REFERENCES `categorias_curso`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- =========================================================
-- PEDIDOS
-- =========================================================

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


-- =========================================================
-- DETALLES DE PEDIDO
-- =========================================================

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


-- =========================================================
-- RESEÑAS DE CURSO
-- =========================================================

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


-- =========================================================
-- VERIFICACIÓN
-- =========================================================
SHOW TABLES FROM freeed_db;
