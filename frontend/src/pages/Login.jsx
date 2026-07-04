import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('http://localhost:5000/api/auth/login', {
        correo,
        contrasena
      });
      setMensaje(`¡Bienvenido! Acceso correcto.`);
      console.log('Datos:', respuesta.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setMensaje(error.response.data.error || 'Error al iniciar sesión');
      } else {
        setMensaje('No se pudo conectar con el servidor backend');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', background: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo simulado de la hojita */}
          <span style={{ fontSize: '24px', color: '#12331b' }}>🍃</span>
          <span className="serif-font" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Monstera</span>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '60px' }}>
        
        {/* Divisor decorativo superior (Hojita / Gota) */}
        <div style={{ display: 'flex', alignItems: 'center', width: '200px', margin: '0 auto 20px auto' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd3' }}></div>
          <span style={{ margin: '0 10px', color: '#12331b', fontSize: '14px' }}>💧</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd3' }}></div>
        </div>

        {/* TARJETA DE LOGIN */}
        <div style={{ 
          background: '#ffffff', 
          width: '100%', 
          maxWidth: '460px', 
          padding: '40px 45px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(230, 227, 221, 0.6)'
        }}>
          
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '6px', fontWeight: '700' }}>Iniciar Sesión</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8b5a42', textAlign: 'center', marginBottom: '30px', fontSize: '15px' }}>
            Cultiva tu mundo
          </p>

          <form onSubmit={manejarLogin}>
            {/* Campo Correo */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d4a30' }}>
                Correo Electrónico
              </label>
              <input 
                type="email" 
                placeholder="tu@correo.com"
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  backgroundColor: '#eae7e1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '15px',
                  color: '#444'
                }}
              />
            </div>

            {/* Campo Contraseña */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#2d4a30' }}>Contraseña</label>
                <a href="#olvide" style={{ fontSize: '13px', color: '#8b5a42', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  backgroundColor: '#eae7e1', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Botón de Entrada */}
            <button type="submit" style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#19381f', /* El verde oscuro del santuario */
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}>
              ENTRAR AL SANTUARIO
            </button>
          </form>

          {mensaje && (
            <p style={{ marginTop: '20px', color: '#8b5a42', fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>
              {mensaje}
            </p>
          )}

          {/* Registro inferior */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '120px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eae7e1' }}></div>
              <span style={{ margin: '0 8px', color: '#ccc', fontSize: '10px' }}>✦</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eae7e1' }}></div>
            </div>
            <p style={{ fontSize: '14px', color: '#555' }}>
              ¿No tienes cuenta? <a href="#registro" style={{ color: '#19381f', fontWeight: '700', textDecoration: 'underline' }}>Regístrate aquí</a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;