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

  // ==========================================
  // ESTADO Y LÓGICA DE COLOR DE ACENTO PERSONALIZABLE
  // ==========================================
  const [colorAcento, setColorAcento] = useState(() => {
    return localStorage.getItem('colorAcento') || '#19381f';
  });

  // PALETA DE 7 COLORES DISPONIBLES PARA ELEGIR
  const coloresDisponibles = ['#e5a47e', '#19381f', '#8b5a42', '#2d6a4f', '#c1443c', '#457b9d', '#d4a017'];

  useEffect(() => {
    localStorage.setItem('colorAcento', colorAcento);
  }, [colorAcento]);

  // ESTADO DEL MENÚ HAMBURGUESA (agrupa idioma, color y modo oscuro)
  const [menuAbierto, setMenuAbierto] = useState(false);

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

  // ==========================================
  // ESTILOS RESPONSIVOS (media queries)
  // No alteran la paleta ni la estructura visual,
  // solo ajustan espaciados/tamaños en pantallas chicas.
  // ==========================================
  const estilosResponsivos = `
    .m-header {
      padding: 20px 60px;
    }
    .m-main {
      padding: 0 20px 60px 20px;
    }
    .m-card {
      width: 100%;
      max-width: 460px;
      padding: 40px 45px;
      border-radius: 16px;
    }
    .m-title {
      font-size: 32px;
    }
    .m-divider {
      width: 200px;
    }
    .m-logo-text {
      font-size: 22px;
    }

    /* Botón hamburguesa */
    .btn-hamburguesa {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      position: relative;
      border-radius: 8px;
    }
    .btn-hamburguesa .linea-hamburguesa {
      display: block;
      width: 24px;
      height: 2px;
      background-color: ${tema.textoPrincipal};
      border-radius: 2px;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    .menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 15;
    }

    .menu-desplegable {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: ${tema.bgTarjeta};
      border: 1px solid ${tema.bordeTarjeta};
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.18);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 220px;
      transform: translateY(${menuAbierto ? '0' : '-8px'});
      opacity: ${menuAbierto ? 1 : 0};
      visibility: ${menuAbierto ? 'visible' : 'hidden'};
      transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
      z-index: 20;
    }

    /* Borde de los campos al hacer clic / enfocarlos */
    .m-input {
      border: 2px solid transparent !important;
      box-sizing: border-box;
      transition: border-color 0.2s ease, background-color 0.3s ease;
    }
    .m-input:focus {
      outline: none;
      border-color: ${colorAcento} !important;
    }

    /* Botón "Crear cuenta" */
    .m-btn-crear {
      transition: background-color 0.2s ease;
    }
    .m-btn-crear:hover,
    .m-btn-crear:focus-visible {
      background-color: ${colorAcento} !important;
    }

    /* Enlace "Inicia sesión" */
    .m-link-login:hover,
    .m-link-login:focus-visible {
      color: ${colorAcento} !important;
    }

    @media (max-width: 640px) {
      .m-header {
        padding: 16px 20px;
      }
      .m-main {
        padding: 0 16px 40px 16px;
      }
      .m-card {
        padding: 28px 22px;
        border-radius: 12px;
      }
      .m-title {
        font-size: 24px;
      }
      .m-divider {
        width: 140px;
      }
      .m-logo-text {
        font-size: 19px;
      }
    }

    @media (max-width: 380px) {
      .m-card {
        padding: 22px 16px;
      }
      .m-title {
        font-size: 21px;
      }
    }
  `;

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
      <style>{estilosResponsivos}</style>

      {/* BARRA DE NAVEGACIÓN */}
      <header role="banner" className="m-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoMonstera} 
            alt="Logo Monstera - Plants & Gardening" 
            style={{ height: '40px', width: 'auto' }} 
          />
          <span className="serif-font m-logo-text" style={{ fontWeight: 'bold', letterSpacing: '0.5px', color: tema.textoPrincipal }}>Monstera</span>
        </div>

        {/* MENÚ DE OPCIONES: color, idioma y modo oscuro */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-hamburguesa"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú de opciones'}
            aria-expanded={menuAbierto}
            aria-haspopup="true"
          >
            {menuAbierto ? (
              <span style={{ fontSize: '18px', lineHeight: 1, color: tema.textoPrincipal }} aria-hidden="true">✕</span>
            ) : (
              <>
                <span className="linea-hamburguesa" />
                <span className="linea-hamburguesa" />
                <span className="linea-hamburguesa" />
              </>
            )}
          </button>

          {menuAbierto && (
            <div className="menu-overlay" onClick={() => setMenuAbierto(false)} aria-hidden="true" />
          )}

          <div className="menu-desplegable" role="menu" aria-label="Opciones de interfaz">

            {/* COLOR DE ACENTO */}
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: tema.textoSecundario, marginBottom: '12px' }}>
                {t('color') || 'Color de acento'}
              </span>
              <div role="group" aria-label="Paleta de colores de acento" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {coloresDisponibles.map((color) => {
                  const seleccionado = colorAcento.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorAcento(color)}
                      aria-label={`Color de acento ${color}`}
                      aria-pressed={seleccionado}
                      title={color}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: seleccionado ? `2px solid ${tema.textoPrincipal}` : '2px solid transparent',
                        boxShadow: seleccionado ? `0 0 0 2px ${tema.bgTarjeta}, 0 0 0 4px ${color}` : 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {seleccionado && (
                        <span aria-hidden="true" style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeDivisor, margin: 0 }} aria-hidden="true" />

            {/* IDIOMA */}
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: tema.textoSecundario, marginBottom: '12px' }}>
                {t('idioma') || 'Idioma'}
              </span>
              <div role="navigation" aria-label="Selección de idioma" style={{ display: 'inline-flex', backgroundColor: tema.bgInput, borderRadius: '8px', padding: '4px', gap: '4px' }}>
                <button
                  onClick={() => i18n.changeLanguage('es')}
                  style={{ fontWeight: i18n.language === 'es' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'es' ? tema.bgTarjeta : 'none', border: 'none', borderRadius: '6px', color: tema.textoPrincipal, fontSize: '13px', padding: '6px 10px' }}
                >
                  🇲🇽 ES
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  style={{ fontWeight: i18n.language === 'en' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'en' ? tema.bgTarjeta : 'none', border: 'none', borderRadius: '6px', color: tema.textoPrincipal, fontSize: '13px', padding: '6px 10px' }}
                >
                  🇺🇸 EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ja')}
                  style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'ja' ? tema.bgTarjeta : 'none', border: 'none', borderRadius: '6px', color: tema.textoPrincipal, fontSize: '13px', padding: '6px 10px' }}
                >
                  🇯🇵 JA
                </button>
              </div>
            </div>

            <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeDivisor, margin: 0 }} aria-hidden="true" />

            {/* MODO OSCURO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: tema.textoPrincipal }}>
                {modoOscuro ? (t('ModoClaro') || 'Modo Claro') : (t('ModoOscuro') || 'Modo Oscuro')}
              </span>
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

          </div>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main role="main" className="m-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Divisor decorativo adaptivo */}
        <div className="m-divider" style={{ display: 'flex', alignItems: 'center', margin: '0 auto 20px auto' }} aria-hidden="true">
          <div style={{ flex: 1, height: '1px', backgroundColor: tema.bordeDivisor }}></div>
          <span style={{ margin: '0 10px', color: modoOscuro ? '#aedcae' : '#12331b', fontSize: '14px' }}>🌱</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: tema.bordeDivisor }}></div>
        </div>

        {/* TARJETA DE REGISTRO */}
        <section aria-labelledby="registro-title" className="m-card" style={{ background: tema.bgTarjeta, boxShadow: modoOscuro ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.04)', border: `1px solid ${tema.bordeTarjeta}`, transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>
          
          <h2 id="registro-title" className="m-title" style={{ textAlign: 'center', marginBottom: '6px', fontWeight: '700', color: tema.textoPrincipal }}>{t('registro')}</h2>
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
                className="m-input"
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
                className="m-input"
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
                className="m-input"
                placeholder="••••••••"
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)} 
                required 
                autoComplete="new-password"
                style={{ width: '100%', padding: '14px 16px', backgroundColor: tema.bgInput, border: 'none', borderRadius: '8px', fontSize: '15px', color: tema.textoPrincipal, transition: 'background-color 0.3s ease' }}
              />
            </div>

            <button type="submit" className="m-btn-crear" style={{ width: '100%', padding: '14px', backgroundColor: '#19381f', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' }}>
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
              <Link to="/" className="m-link-login" style={{ color: modoOscuro ? '#aedcae' : '#19381f', fontWeight: '700', textDecoration: 'underline', marginLeft: '5px' }}>
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