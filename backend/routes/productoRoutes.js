const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/productos (Búsqueda, Filtrado y Catálogo completo)
router.get('/', async (req, res) => {
  const { buscar, riego, luz } = req.query;
  
  let query = 'SELECT * FROM productos WHERE 1=1';
  let params = [];

  if (buscar) {
    query += ' AND nombre_comun LIKE ?';
    params.push(`%${buscar}%`);
  }
  if (riego) {
    query += ' AND nivel_riego = ?';
    params.push(riego);
  }
  if (luz) {
    query += ' AND nivel_luz = ?';
    params.push(luz);
  }

  try {
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// POST /api/productos (CRUD - Alta de planta)
router.post('/', async (req, res) => {
  //Añade "descripcion"
  const { nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen, descripcion } = req.body;

  try {
    // Agrega la columna 'descripcion'
    await db.query(
      'INSERT INTO productos (nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen || 'default_planta.png', descripcion || 'Sin descripción']
    );
    res.status(201).json({ message: "Producto guardado con éxito." });
  } catch (error) {
    res.status(500).json({ error: "Error al insertar producto" });
  }
});

// PUT /api/productos/:id (CRUD - Modificar planta)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // Añade "descripcion" al req.body
  const { nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen, descripcion } = req.body;

  try {
    // Agrega 'descripcion=?' al SET de la consulta sql
    const [result] = await db.query(
      'UPDATE productos SET nombre_comun=?, nombre_cienti=?, categoria=?, nivel_riego=?, nivel_luz=?, precio=?, stock=?, imagen=?, descripcion=? WHERE id_producto=?',
      [nombre_comun, nombre_cienti, categoria, nivel_riego, nivel_luz, precio, stock, imagen, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "El identificador proporcionado no existe." });
    }

    res.status(200).json({ message: "Cambios guardados correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// DELETE /api/productos/:id (CRUD - Eliminar planta)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    res.status(200).json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

router.get('/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en la consulta de MySQL:", error);
    res.status(500).json({ error: "Error al obtener los productos de la base de datos" });
  }
});

module.exports = router;