import React, { useState } from 'react';
import axios from 'axios';
import logoMonstera from '../assets/log_monstera.png';
import { Link } from 'react-router-dom';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setErrorStatus(false);
    try {
      // Apuntamos al endpoint de registro en tu backend
      const respuesta = await axios.post('http://localhost:5000/api/auth/registrar', {
        nombre,
        correo,
        contrasena
      });
      setErrorStatus(false);
      setMensaje('¡Registro exitoso! Ya puedes iniciar sesión.');
      // Limpiamos los campos después de registrar con éxito
      setNombre('');
      setCorreo('');
      setContrasena('');
    } catch (error) {
      setErrorStatus(true);
      if (error.response && error.response.data) {
        setMensaje(error.response.data.error || 'Error al registrar usuario');
      } else {
        setMensaje('No se pudo conectar con el servidor');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* BARRA DE NAVEGACIÓN */}
      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', background: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoMonstera} 
            alt="Logo Monstera - Plants & Gardening" 
            style={{ height: '40px', width: 'auto' }} 
          />
          <span className="serif-font" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Monstera</span>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '60px' }}>
        
        {/* Divisor decorativo */}
        <div style={{ display: 'flex', alignItems: 'center', width: '200px', margin: '0 auto 20px auto' }} aria-hidden="true">
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd3' }}></div>
          <span style={{ margin: '0 10px', color: '#12331b', fontSize: '14px' }}>🍃</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0dbd3' }}></div>
        </div>

        {/* TARJETA DE REGISTRO */}
        <section aria-labelledby="registro-title" style={{ background: '#ffffff', width: '100%', maxWidth: '460px', padding: '40px 45px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)', border: '1px solid rgba(230, 227, 221, 0.6)' }}>
          
          <h2 id="registro-title" style={{ textAlign: 'center', fontSize: '32px', marginBottom: '6px', fontWeight: '700' }}>Crear Cuenta</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#8b5a42', textAlign: 'center', marginBottom: '30px', fontSize: '15px' }}>Únete a nuestro santuario</p>

          <form onSubmit={manejarRegistro}>
            
            {/* Campo Nombre */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="nombre-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d4a30' }}>
                Nombre Completo
              </label>
              <input 
                id="nombre-input"
                type="text" 
                placeholder="Tu nombre completo"
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                autoComplete="name"
                style={{ width: '100%', padding: '14px 16px', backgroundColor: '#eae7e1', border: 'none', borderRadius: '8px', fontSize: '15px', color: '#444' }}
              />
            </div>

            {/* Campo Correo */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="correo-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d4a30' }}>
                Correo Electrónico
              </label>
              <input 
                id="correo-input"
                type="email" 
                placeholder="tu@correo.com"
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
                autoComplete="email"
                aria-invalid={errorStatus}
                aria-describedby={errorStatus ? "registro-status" : undefined}
                style={{ width: '100%', padding: '14px 16px', backgroundColor: '#eae7e1', border: 'none', borderRadius: '8px', fontSize: '15px', color: '#444' }}
              />
            </div>

            {/* Campo Contraseña */}
            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="contrasena-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d4a30' }}>
                Contraseña
              </label>
              <input 
                id="contrasena-input"
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                required 
                autoComplete="new-password"
                aria-invalid={errorStatus}
                aria-describedby={errorStatus ? "registro-status" : undefined}
                style={{ width: '100%', padding: '14px 16px', backgroundColor: '#eae7e1', border: 'none', borderRadius: '8px', fontSize: '15px' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#19381f', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' }}>
              UNIRSE AL SANTUARIO
            </button>
          </form>

          {/* MENSAJE DE ESTADO */}
          <div 
            id="registro-status" 
            role={errorStatus ? "alert" : "status"} 
            aria-live="polite" 
            style={{ 
              marginTop: '20px', 
              color: errorStatus ? '#b71c1c' : '#2e7d32', /* Verde éxito o Rojo error */
              fontWeight: 'bold', 
              textAlign: 'center', 
              fontSize: '14px' 
            }}
          >
            {mensaje}
          </div>

          {/* Enlace para volver al login */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '120px', marginBottom: '20px' }} aria-hidden="true">
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eae7e1' }}></div>
              <span style={{ margin: '0 8px', color: '#ccc', fontSize: '10px' }}>✦</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#eae7e1' }}></div>
            </div>
            <p style={{ fontSize: '14px', color: '#555' }}>
              ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#19381f', fontWeight: '700', textDecoration: 'underline' }}>Inicia sesión aquí</Link>
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Registro;