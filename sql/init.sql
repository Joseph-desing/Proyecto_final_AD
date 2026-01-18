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

-- =============================================
-- Crear usuario administrador por defecto
-- Email: admin@salas.com | Contraseña: abc123
-- =============================================
INSERT INTO usuarios (username, email, password)
    SELECT 'admin', 'admin@salas.com', 'scrypt:32768:8:1$FbZJ2nick9iXAlxV$f60918f713a4a6b04b8dababe28878ef46b2f5c03dfe87ac73d7f002ce020c6ceb642aab3297bf3e5440c5e17eded529622bc2da6c8c101a240e22f4483260ea'
    WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@salas.com');

-- =============================================
-- Crear salas por defecto
-- =============================================
INSERT INTO salas (nombre, codigo, capacidad, userid)
    SELECT 'Sala de Conferencias A', 'SC-001', 20, (SELECT userid FROM usuarios WHERE email = 'admin@salas.com')
    WHERE NOT EXISTS (SELECT 1 FROM salas WHERE codigo = 'SC-001');

INSERT INTO salas (nombre, codigo, capacidad, userid)
    SELECT 'Sala de Reuniones B', 'SR-002', 15, (SELECT userid FROM usuarios WHERE email = 'admin@salas.com')
    WHERE NOT EXISTS (SELECT 1 FROM salas WHERE codigo = 'SR-002');

INSERT INTO salas (nombre, codigo, capacidad, userid)
    SELECT 'Auditorio Principal', 'AP-003', 100, (SELECT userid FROM usuarios WHERE email = 'admin@salas.com')
    WHERE NOT EXISTS (SELECT 1 FROM salas WHERE codigo = 'AP-003');

