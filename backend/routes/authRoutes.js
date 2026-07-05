const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// POST /api/auth/registrar
router.post('/registrar', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(contrasena, saltRounds);
    const fechaReg = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol, fecha_reg) VALUES (?, ?, ?, "cliente", ?)',
      [nombre, correo, hashedPass, fechaReg]
    );

    res.status(201).json({ message: "Registro exitoso." });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    res.status(200).json({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});



module.exports = router;