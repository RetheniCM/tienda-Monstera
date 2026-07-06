# tienda-Monstera
Monstera es una plataforma web, dedicada a la gestión y catálogo de plantas. 
El sistema cuenta con un módulo de autenticación de usuarios con redirección dinámica por roles (Clientes y Administradores) y un panel de control (Dashboard) con operaciones CRUD completas para el inventario de productos.

# Características principales

--Auetenticacion segura
--Control de acceso por roles
--dashboard
--soporte de tres idiomas: ESP, ENG y JA, solo en el login, registro y catalogo
--Cierre de Sesión Seguro:** Limpieza de datos en localStorage y protección de rutas

# Tecnologías utilizadas

--Frontend: React, React Router DOM, i18next (idiomas)
--Backend: Node.js, Express
--Base de Datos: MySQL (con arquitectura InnoDB y codificación UTF-8)

# Estructura del Proyecto

monstera/
|--- backend/       # Servidor Node.js y API REST
|--- frontend/      # Aplicación en React (UI y Dashboard)
|--- database/      # Scripts DDL y DML de la Base de Datos
|--- README.md      # Documentación del proyecto

# Base de Datos

-- Importa y ejecuta el script de inicialización ubicado en /database/monstera_db.sql, esto creara la estructura y los datos

# Configurar el Backend
-- Ingresa a la carpeta del backend e instala las dependencias, pije, con npm install
-- Ejecuta en la terminal DENTRO de la carpeta backend node server.js, en esa pq si no, no se va correr

# Configurar el frontend
-- Abre la terminal dentro de frontend e instala sus dependencias correspondientes con npm install
-- Para correrte ahi mismo, dentro de la carpeta ejecuta npm run dev

-- Ya con eso jala, la neta se ve bien para mi