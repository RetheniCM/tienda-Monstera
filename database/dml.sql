-- =========================================================
-- 2. SCRIPTS DML (DATA MANIPULATION LANGUAGE)
-- Inserción de datos iniciales para pruebas
-- =========================================================

-- Insertar usuarios semilla (El administrador inicial y un cliente de prueba)
-- Nota: Las contraseñas están encriptadas con bcrypt correspondientes a 'password123'
INSERT INTO usuarios (nombre, correo, contrasena, rol, fecha_reg) 
VALUES 
('Uriel Resendiz', 'uriel@monstera.com', '$2b$10$BDpdJNApiypzwjaf...', 'admin', '2026-07-06'),
('Juan Pérez', 'juan.perez@gmail.com', '$2b$10$EixzaoVK1ZkM396...', 'cliente', '2026-07-06')
ON DUPLICATE KEY UPDATE correo=correo;

-- Insertar productos semilla (Catálogo inicial con los nuevos campos incluidos)
INSERT INTO productos (nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen)
VALUES
('Monstera Deliciosa', 'Monstera deliciosa', 'Interior', 'Moderado', 'Luz Indirecta', 450.00, 15, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b'),
('Cactus de Asiento', 'Echinocactus grusonii', 'Exterior', 'Bajo', 'Sol Directo', 180.00, 30, 'https://images.unsplash.com/photo-1509440159596-0249088772ff'),
('Cuna de Moisés', 'Spathiphyllum', 'Interior', 'Frecuente', 'Sombra', '220.00', 12, 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921')
ON DUPLICATE KEY UPDATE nombre_comun=nombre_comun;
