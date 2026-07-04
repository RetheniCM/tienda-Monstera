const db = require('../config/db');

// Obtener todas las plantas del catálogo
exports.obtenerProductos = async (req, res) => {
  try {
    // Hacer la consulta a la base
    const [rows] = await db.query('SELECT * FROM productos');
    
    // Responde con los datos en formato JSON
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos del servidor' });
  }
};