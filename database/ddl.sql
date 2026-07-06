-- =========================================================
-- 1. SCRIPTS DDL (DATA DEFINITION LANGUAGE)
-- Creación de la estructura de la base de datos
-- =========================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS monstera_db;
USE monstera_db;

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
    fecha_reg DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comun VARCHAR(100) NOT NULL,
    nombre_cienti VARCHAR(150),
    categoria VARCHAR(50) NOT NULL DEFAULT 'Interior',
    nivel_riego VARCHAR(30) NOT NULL DEFAULT 'Moderado',
    nivel_luz VARCHAR(30) NOT NULL DEFAULT 'Media',
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
