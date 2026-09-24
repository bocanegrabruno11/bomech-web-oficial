-- =============================================================================
-- SISTEMA DE CATÁLOGO Y GESTIÓN DE STOCK DE LICORES (MVP SIN PRECIOS)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `bomech_db` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `bomech_db`;

-- -----------------------------------------------------------------------------
-- 1. TABLA: categorias
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `descripcion` TEXT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. TABLA: productos (Sin campos de precio o costo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `categoria_id` INT UNSIGNED NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `sku` VARCHAR(50) NOT NULL UNIQUE,
    `descripcion` TEXT NULL,
    `cepa` VARCHAR(100) NULL COMMENT 'Tipo de uva o destilado (ej. Cabernet Sauvignon, Blue Agave)',
    `pais_origen` VARCHAR(80) NULL,
    `grado_alcohol` DECIMAL(4, 2) NULL COMMENT 'Porcentaje de alcohol ej. 13.50',
    `volumen_ml` INT UNSIGNED NOT NULL COMMENT 'Contenido en mililitros ej. 750',
    `stock_actual` INT NOT NULL DEFAULT 0,
    `stock_minimo` INT NOT NULL DEFAULT 5,
    `imagen_url` VARCHAR(500) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_productos_categoria` 
        FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_productos_categoria` (`categoria_id`),
    INDEX `idx_productos_activo_stock` (`activo`, `stock_actual`),
    INDEX `idx_productos_sku` (`sku`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. TABLA: movimientos_stock
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimientos_stock` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `producto_id` INT UNSIGNED NOT NULL,
    `tipo` ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL,
    `cantidad` INT NOT NULL COMMENT 'Positivo para entrada/ajuste al alza, negativo o delta',
    `stock_anterior` INT NOT NULL,
    `stock_nuevo` INT NOT NULL,
    `motivo` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_movimientos_producto` 
        FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_movimientos_producto_fecha` (`producto_id`, `created_at`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. TABLA: usuarios (Administración y control)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(255) NOT NULL,
    `rol` ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    `activo` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Datos semilla iniciales (Opcional)
-- -----------------------------------------------------------------------------
INSERT INTO `categorias` (`nombre`, `slug`, `descripcion`) VALUES
('Vinos Tintos', 'vinos-tintos', 'Vinos elaborados a partir de mostos de uvas tintas.'),
('Vinos Blancos', 'vinos-blancos', 'Vinos ligeros y frescos obtenidos de uvas blancas o tintas de pulpa blanca.'),
('Piscos y Destilados', 'piscos-y-destilados', 'Destilados puros y aguardientes tradicionales.'),
('Espumantes', 'espumantes', 'Vinos con gas disuelto natural.');
