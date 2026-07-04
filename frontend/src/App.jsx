import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el Inicio de Sesión */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el Registro de Usuarios */}
        <Route path="/registro" element={<Registro />} />
        
        {/* Si entran a la raíz (/) los mandamos automáticamente al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;