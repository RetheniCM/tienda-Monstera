const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());
// Reemplaza tus líneas de código estático por esto:
app.use('/images', express.static(path.resolve(__dirname, 'public/images')));

// Enlazar las rutas de la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor de Monstera corriendo en http://localhost:${PORT}`);
});
