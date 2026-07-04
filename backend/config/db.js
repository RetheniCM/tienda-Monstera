const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '', 
  database: 'tienda_monstera',
  waitForConnections: true,
  connectionLimit: 10
});

// Exportamos en modo promesa para usar async/await
module.exports = pool.promise();