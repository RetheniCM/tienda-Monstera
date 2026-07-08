import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import logoMonstera from '../assets/log_monstera.png';
import { Link } from 'react-router-dom';
import iconoSol from '../assets/icono_sol.png';
import iconoLuna from '../assets/icono_luna.png';

function Registro() {
  const { t, i18n } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  // ==========================================
  // ESTADO Y LÓGICA DE MODO OSCURO (Sincronizado)
  // ==========================================
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro';
  });

  useEffect(() => {
    localStorage.setItem('tema', modoOscuro ? 'oscuro' : 'claro');
  }, [modoOscuro]);

  // Paleta de colores dinámica para el Registro
  const tema = {
    bgPrincipal: modoOscuro ? '#121212' : '#fbfaf7',
    bgTarjeta: modoOscuro ? '#1e1e1e' : '#ffffff',
    bgInput: modoOscuro ? '#2d2d2d' : '#eae7e1',
    textoPrincipal: modoOscuro ? '#e0e0e0' : '#19381f',
    textoLabel: modoOscuro ? '#aedcae' : '#2d4a30',
    textoSecundario: modoOscuro ? '#b0b0b0' : '#555555',
    textoDestacado: modoOscuro ? '#e5a47e' : '#8b5a42', // Mensajes informativos
    bordeTarjeta: modoOscuro ? 'rgba(255, 255, 255, 0.1)' : 'rgba(230, 227, 221, 0.6)',
    bordeDivisor: modoOscuro ? '#333333' : '#e0dbd3',
    bgBotónTema: modoOscuro ? '#2d2d2d' : '#eae5dd',
    textoExito: modoOscuro ? '#81c784' : '#2e7d32', // Verde más amigable para el modo oscuro
    textoError: modoOscuro ? '#ff6b6b' : '#b71c1c'  // Rojo más brillante para modo oscuro
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setErrorStatus(false);
    try {
      const respuesta = await axios.post('http://localhost:5000/api/auth/registrar', {
        nombre,
        correo,
        contrasena
      });
      setErrorStatus(false);
      setMensaje('¡Registro exitoso! Ya puedes iniciar sesión.');
      setNombre('');
      setCorreo('');
      setContrasena('');
    } catch (error) {
      setErrorStatus(true);
      if (error.response && error.response.data) {
        setMensaje(error.response.data.error || 'Error al registrar usuario');
      } else {
        setMensaje('No se pudo conectar con el servidor backend');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: tema.bgPrincipal, color: tema.textoPrincipal, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* BARRA DE NAVEGACIÓN */}
      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', background: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoMonstera} 
            alt="Logo Monstera - Plants & Gardening" 
            style={{ height: '40px', width: 'auto' }} 
          />
          <span className="serif-font" style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px', color: tema.textoPrincipal }}>Monstera</span>
        </div>

        {/* SELECTOR DE IDIOMAS Y BOTÓN MODO OSCURO */}
        <div style={{ position: 'absolute', top: '20px', right: '40px', display: 'flex', gap: '12px', alignItems: 'center' }} role="navigation" aria-label="Configuración de interfaz">
          <button 
            onClick={() => i18n.changeLanguage('es')} 
            style={{ fontWeight: i18n.language === 'es' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px', padding: '5px' }}
          >
            🇲🇽 ES
          </button>
          <span style={{ color: '#ccc' }} aria-hidden="true">|</span>
          <button 
            onClick={() => i18n.changeLanguage('en')} 
            style={{ fontWeight: i18n.language === 'en' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px', padding: '5px' }}
          >
            🇺🇸 EN
          </button>
          <span style={{ color: '#ccc' }} aria-hidden="true">|</span>
          <button 
            onClick={() => i18n.changeLanguage('ja')} 
            style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px', padding: '5px' }}
          >
            🇯🇵 JA
          </button>

          <span style={{ color: '#ccc' }} aria-hidden="true">|</span>

          {/* BOTÓN INTERACTIVO MODO OSCURO CON IMAGEN */}
          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            aria-label={modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            style={{ 
              background: tema.bgBotónTema, 
              border: 'none', 
              cursor: 'pointer', 
              padding: '6px', 
              borderRadius: '50%', 
              display: 'inline-flex', 
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
              width: '34px',       
              height: '34px'       
            }}
          >
            <img 
              src={modoOscuro ? iconoSol : iconoLuna} 
              alt={modoOscuro ? "Icono de Sol" : "Icono de Luna"} 
              style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
            />
          </button>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '60px' }}>
        
        {/* Divisor decorativo adaptivo */}
        <div style={{ display: 'flex', alignItems: 'center', width: '200px', margin: '0 auto 20px auto' }} aria-hidden="true">
          <div style={{ flex: 1, height: '1px', backgroundColor: tema.bordeDivisor }}></div>
          <span style={{ margin: '0 10px', color: modoOscuro ? '#aedcae' : '#12331b', fontSize: '14px' }}>🌱</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: tema.bordeDivisor }}></div>
        </div>

        {/* TARJETA DE REGISTRO */}
        <section aria-labelledby="registro-title" style={{ background: tema.bgTarjeta, width: '100%', maxWidth: '460px', padding: '40px 45px', borderRadius: '16px', boxShadow: modoOscuro ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.04)', border: `1px solid ${tema.bordeTarjeta}`, transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
          
          <h2 id="registro-title" style={{ textAlign: 'center', fontSize: '32px', marginBottom: '6px', fontWeight: '700', color: tema.textoPrincipal }}>{t('registro')}</h2>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: tema.textoDestacado, textAlign: 'center', marginBottom: '30px', fontSize: '15px' }}>{t('men_bienvenida') || 'Únete a nuestra comunidad botánica'}</p>

          <form onSubmit={manejarRegistro}>
            
            {/* Campo Nombre completo */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="nombre-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: tema.textoLabel }}>
                {t('nombre_usuario')}
              </label>
              <input 
                id="nombre-input"
                type="text" 
                placeholder={t('nombre_aqui')}
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                autoComplete="name"
                style={{ width: '100%', padding: '14px 16px', backgroundColor: tema.bgInput, border: 'none', borderRadius: '8px', fontSize: '15px', color: tema.textoPrincipal, transition: 'background-color 0.3s ease' }}
              />
            </div>

            {/* Campo Correo electrónico */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="correo-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: tema.textoLabel }}>
                {t('correo')}
              </label>
              <input 
                id="correo-input"
                type="email" 
                placeholder={t('correo_aqui')}
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
                autoComplete="email"
                style={{ width: '100%', padding: '14px 16px', backgroundColor: tema.bgInput, border: 'none', borderRadius: '8px', fontSize: '15px', color: tema.textoPrincipal, transition: 'background-color 0.3s ease' }}
              />
            </div>

            {/* Campo Contraseña */}
            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="contrasena-input" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: tema.textoLabel }}>
                {t('contrasena')}
              </label>
              <input 
                id="contrasena-input"
                type="password" 
                placeholder="••••••••"
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                required 
                autoComplete="new-password"
                style={{ width: '100%', padding: '14px 16px', backgroundColor: tema.bgInput, border: 'none', borderRadius: '8px', fontSize: '15px', color: tema.textoPrincipal, transition: 'background-color 0.3s ease' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#19381f', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' }}>
              {t('boton_crear')}
            </button>
          </form>

          {/* MENSAJE DE ESTADO CON ALERTAS ADAPTIVAS */}
          <div 
            id="registro-status" 
            role={errorStatus ? "alert" : "status"} 
            aria-live="polite" 
            style={{ 
              marginTop: '20px', 
              color: errorStatus ? tema.textoError : tema.textoExito, 
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
              <div style={{ flex: 1, height: '1px', backgroundColor: tema.bgInput }}></div>
              <span style={{ margin: '0 8px', color: '#ccc', fontSize: '10px' }}>✦</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: tema.bgInput }}></div>
            </div>
            <p style={{ fontSize: '14px', color: tema.textoSecundario }}>
              {t('pregunta_login')}
              <Link to="/" style={{ color: modoOscuro ? '#aedcae' : '#19381f', fontWeight: '700', textDecoration: 'underline', marginLeft: '5px' }}>
                {t('boton_ingresar')}
              </Link>
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Registro;