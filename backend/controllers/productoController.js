const db = require('../config/db');

// Obtener todas las plantas del catálogo
exports.obtenerProductos = async (req, res) => {
  try {
    // Hacemos la consulta a la BD de Wamp
    const [rows] = await db.query('SELECT * FROM productos');
    
    // Respondemos con los datos en formato JSON
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos del servidor' });
  }
};