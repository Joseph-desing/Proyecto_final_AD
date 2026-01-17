-- =============================================
-- Script de Inicialización de Base de Datos
-- Proyecto: Sistema de Gestión de Salas
-- =============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS salas;
USE salas;

-- =============================================
-- Tabla: usuarios
-- Almacena la información de los usuarios del sistema
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tabla: salas
-- Almacena la información de las salas creadas
-- =============================================
CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    capacidad INT NOT NULL,
    userid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES usuarios(userid) ON DELETE CASCADE
);

-- =============================================
-- Índices para mejorar el rendimiento
-- =============================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_salas_codigo ON salas(codigo);
CREATE INDEX idx_salas_userid ON salas(userid);
