import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoMonstera from '../assets/log_monstera.png';
import iconoSol from '../assets/icono_sol.png';
import iconoLuna from '../assets/icono_luna.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Catalogo() {
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  const manejarCierreSesion = () => {
    localStorage.removeItem('rol'); 
    navigate('/'); 
  };

  // ESTADO Y LÓGICA DE MODO OSCURO
  const [modoOscuro, setModoOscuro] = useState(() => {
    // Revisa si el usuario ya tenía una preferencia guardada
    return localStorage.getItem('tema') === 'oscuro';
  });

  useEffect(() => {
    // Guarda la preferencia cada vez que cambie
    localStorage.setItem('tema', modoOscuro ? 'oscuro' : 'claro');
  }, [modoOscuro]);

  // Paleta de colores dinámica según el modo activo
  const tema = {
    bgPrincipal: modoOscuro ? '#121212' : '#fbfaf7',
    bgHeader: modoOscuro ? '#1e1e1e' : '#ffffff',
    bgBuscador: modoOscuro ? '#2d2d2d' : '#eae5dd',
    bgTarjeta: modoOscuro ? '#1e1e1e' : '#eae5dd',
    textoPrincipal: modoOscuro ? '#e0e0e0' : '#19381f',
    textoHeaderLogo: modoOscuro ? '#ffffff' : '#1d3b24',
    textoSecundario: modoOscuro ? '#b0b0b0' : '#555555',
    textoDestacado: modoOscuro ? '#e5a47e' : '#8b5a42', // Para títulos de filtros / científico
    bordeHeader: modoOscuro ? 'rgba(255, 255, 255, 0.1)' : 'rgba(230, 227, 221, 0.6)',
    bordeSeparador: modoOscuro ? '#2d2d2d' : '#e6e3dd',
    bgTagLuz: modoOscuro ? '#2e3d30' : '#ced7cc',
    bgTagRiego: modoOscuro ? '#3a332a' : '#f0e6d2'
  };

  // 1. ESTADOS PRINCIPALES
  const [carritoCount, setCarritoCount] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ESTADO DEL MENÚ HAMBURGUESA (navegación / filtros en pantallas pequeñas)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  // ESTADO DEL HEADER "INTELIGENTE": se oculta al bajar, reaparece al subir
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    let ultimoScrollY = window.scrollY;

    const manejarScroll = () => {
      const scrollActual = window.scrollY;
      const bajando = scrollActual > ultimoScrollY;
      const diferencia = Math.abs(scrollActual - ultimoScrollY);

      // Si el menú hamburguesa está abierto, mantenemos el header visible
      if (menuMovilAbierto) {
        setHeaderVisible(true);
      } else if (scrollActual <= 0) {
        // Siempre visible hasta arriba del todo
        setHeaderVisible(true);
      } else if (diferencia > 5) {
        setHeaderVisible(!bajando);
      }

      ultimoScrollY = scrollActual;
    };

    window.addEventListener('scroll', manejarScroll, { passive: true });
    return () => window.removeEventListener('scroll', manejarScroll);
  }, [menuMovilAbierto]);

  // ESTADO DEL COLOR DE CONTORNO PERSONALIZABLE (hover en tarjetas)
  const [colorContorno, setColorContorno] = useState(() => {
    return localStorage.getItem('colorContorno') || '#e5a47e';
  });

  useEffect(() => {
    localStorage.setItem('colorContorno', colorContorno);
  }, [colorContorno]);

  // 2. ESTADOS DE FILTROS
  const [filtrosCategoria, setFiltrosCategoria] = useState({ Interior: false, Exterior: false, Herramientas: false, Abono: false });
  const [filtrosRiego, setFiltrosRiego] = useState({ Bajo: false, Moderado: false, Frecuente: false });
  const [filtrosLuz, setFiltrosLuz] = useState({ 'Sol Directo': false, 'Luz Indirecta': false, Sombra: false });

  // 3. PETICIÓN AL BACKEND
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/productos');
        
        if (respuesta.data && Array.isArray(respuesta.data)) {
          const productosMapeados = respuesta.data.map(prod => {
            const rutaImagen = prod.imagen && prod.imagen.startsWith('http')
              ? prod.imagen
              : `http://localhost:5000/images/${prod.imagen || 'default_plant.png'}`;

            return {
              id: prod.id_producto,
              nombre: prod.nombre_comun || 'Sin nombre',
              nombreCientifico: prod.nombre_cienti || '',
              categoria: prod.categoria || 'Interior',
              riego: prod.nivel_riego === 'Alto' ? 'Frecuente' : (prod.nivel_riego === 'Medio' ? 'Moderado' : prod.nivel_riego),
              luz: prod.nivel_luz || 'Luz Indirecta',
              precio: parseFloat(prod.precio) || 0,
              stock: prod.stock || 0,
              imagen: rutaImagen,
              descripcion: prod.descripcion || ''
            };
          });
          setPlantas(productosMapeados);
        }
      } catch (error) {
        console.error("Error conectando al backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // 4. MANEJADORES DE COMPORTAMIENTO
  const manejarCambioCategoria = (e) => {
    setFiltrosCategoria({ ...filtrosCategoria, [e.target.name]: e.target.checked });
  };

  const manejarCambioRiego = (e) => {
    setFiltrosRiego({ ...filtrosRiego, [e.target.name]: e.target.checked });
  };

  const manejarCambioLuz = (e) => {
    setFiltrosLuz({ ...filtrosLuz, [e.target.name]: e.target.checked });
  };

  // 5. LÓGICA DE FILTRADO LIMPIA
  const productosFiltrados = plantas.filter((planta) => {
    const coincideBusqueda = 
      (planta.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (planta.nombreCientifico || '').toLowerCase().includes(busqueda.toLowerCase());

    const algunaCategoriaActiva = filtrosCategoria.Interior || filtrosCategoria.Exterior || filtrosCategoria.Herramientas || filtrosCategoria.Abono;
    const coincideCategoria = !algunaCategoriaActiva || filtrosCategoria[planta.categoria];

    const algunRiegoActivo = filtrosRiego.Bajo || filtrosRiego.Moderado || filtrosRiego.Frecuente;
    const coincideRiego = !algunRiegoActivo || (planta.riego && filtrosRiego[planta.riego]);

    const algunaLuzActiva = filtrosLuz['Sol Directo'] || filtrosLuz['Luz Indirecta'] || filtrosLuz.Sombra;
    const coincideLuz = !algunaLuzActiva || (planta.luz && filtrosLuz[planta.luz]);

    return coincideBusqueda && coincideCategoria && coincideRiego && coincideLuz;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tema.bgPrincipal, color: tema.textoPrincipal, fontFamily: 'system-ui, sans-serif', transition: 'background-color 0.3s ease, color 0.3s ease' }}>

      {/* ESTILOS GLOBALES: hover de tarjetas, menú hamburguesa y responsive */}
      <style>{`
        .tarjeta-planta {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          border: 2px solid transparent;
        }
        .tarjeta-planta:hover,
        .tarjeta-planta:focus-within {
          transform: scale(1.04);
          border-color: var(--color-contorno);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 2;
        }

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
          background: ${tema.bgHeader};
          border: 1px solid ${tema.bordeHeader};
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 220px;
          transform: translateY(${menuMovilAbierto ? '0' : '-8px'});
          opacity: ${menuMovilAbierto ? 1 : 0};
          visibility: ${menuMovilAbierto ? 'visible' : 'hidden'};
          transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
          z-index: 20;
        }

        @media (max-width: 900px) {
          .contenedor-principal {
            flex-direction: column;
          }
          .aside-filtros {
            width: 100% !important;
            position: static !important;
            max-height: none !important;
          }
          .buscador-central {
            flex: 1 1 auto !important;
            margin: 0 12px !important;
          }
        }
      `}</style>

      {/* HEADER ACCESIBLE */}
      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: tema.bgHeader, borderBottom: `1px solid ${tema.bordeHeader}`, position: 'fixed', top: 0, left: 0, right: 0, gap: '20px', zIndex: 30, transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.3s ease, background-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <img src={logoMonstera} alt="Monstera - Logotipo de la tienda de plantas" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: tema.textoHeaderLogo }} aria-hidden="true">Monstera</span>
        </div>

        {/* Input de búsqueda centrado */}
        <div className="buscador-central" style={{ flex: '0 1 420px', position: 'relative' }}>
          <label htmlFor="buscador-plantas" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
            {t('buscar')}
          </label>
          <input 
            id="buscador-plantas"
            type="search" 
            placeholder={t('buscar')} 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 15px 10px 15px', backgroundColor: tema.bgBuscador, border: 'none', borderRadius: '8px', fontSize: '14px', color: tema.textoPrincipal, transition: 'background-color 0.3s ease' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {/* Botón de carrito */}
          <button 
            aria-label={`${t('carrito')}, contiene ${carritoCount} artículos`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#19381f', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >
            <span>{t('carro')} ({carritoCount})</span>
          </button>

          {/* BOTÓN HAMBURGUESA: agrupa color de enfoque, idioma, modo y salir */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-hamburguesa"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú de opciones'}
              aria-expanded={menuMovilAbierto}
              aria-haspopup="true"
              style={{
                border: menuMovilAbierto ? `2px solid ${colorContorno}` : '2px solid transparent',
                borderRadius: '10px'
              }}
            >
              {menuMovilAbierto ? (
                <span style={{ fontSize: '18px', lineHeight: 1, color: tema.textoPrincipal, background: 'none', width: 'auto', height: 'auto' }} aria-hidden="true">✕</span>
              ) : (
                <>
                  <span className="linea-hamburguesa" />
                  <span className="linea-hamburguesa" />
                  <span className="linea-hamburguesa" />
                </>
              )}
            </button>

            {menuMovilAbierto && (
              <div className="menu-overlay" onClick={() => setMenuMovilAbierto(false)} aria-hidden="true" />
            )}

            <div className="menu-desplegable" role="menu" aria-label="Opciones de interfaz">

              {/* COLOR DE ENFOQUE */}
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: tema.textoSecundario, marginBottom: '12px' }}>
                  {t('color') || 'Color de enfoque'}
                </span>
                <label
                  htmlFor="color-contorno"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  title="Elige el color de contorno al pasar el cursor sobre una tarjeta"
                >
                  <span style={{ position: 'relative', width: '32px', height: '32px', flexShrink: 0 }}>
                    <input
                      id="color-contorno"
                      type="color"
                      value={colorContorno}
                      onChange={(e) => setColorContorno(e.target.value)}
                      style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                      aria-label="Seleccionar color de contorno de las tarjetas"
                    />
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, textTransform: 'uppercase' }}>
                    {colorContorno}
                  </span>
                </label>
              </div>

              <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeSeparador, margin: 0 }} aria-hidden="true" />

              {/* IDIOMA */}
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: tema.textoSecundario, marginBottom: '12px' }}>
                  {t('idioma') || 'Idioma'}
                </span>
                <div
                  role="navigation"
                  aria-label="Selección de idioma"
                  style={{ display: 'inline-flex', backgroundColor: tema.bgBuscador, borderRadius: '8px', padding: '4px', gap: '4px' }}
                >
                  <button
                    onClick={() => cambiarIdioma('es')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                      background: i18n.language === 'es' ? tema.bgTarjeta : 'none',
                      border: 'none', borderRadius: '6px', padding: '6px 10px',
                      color: tema.textoPrincipal, fontSize: '13px', fontWeight: i18n.language === 'es' ? '700' : '400'
                    }}
                  >
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>MX</span> ES
                  </button>
                  <button
                    onClick={() => cambiarIdioma('en')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                      background: i18n.language === 'en' ? tema.bgTarjeta : 'none',
                      border: 'none', borderRadius: '6px', padding: '6px 10px',
                      color: tema.textoPrincipal, fontSize: '13px', fontWeight: i18n.language === 'en' ? '700' : '400'
                    }}
                  >
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>US</span> EN
                  </button>
                  <button
                    onClick={() => cambiarIdioma('ja')}
                    aria-label="日本語に言語を変更"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                      background: i18n.language === 'ja' ? tema.bgTarjeta : 'none',
                      border: 'none', borderRadius: '6px', padding: '6px 10px',
                      color: tema.textoPrincipal, fontSize: '13px', fontWeight: i18n.language === 'ja' ? '700' : '400'
                    }}
                  >
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>JP</span> JA
                  </button>
                </div>
              </div>

              <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeSeparador, margin: 0 }} aria-hidden="true" />

              {/* MODO OSCURO / CLARO */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: tema.textoPrincipal }}>
                  {modoOscuro ? (t('ModoClaro') || 'Modo Claro') : (t('ModoOscuro') || 'Modo Oscuro')}
                </span>
                <button
                  onClick={() => setModoOscuro(!modoOscuro)}
                  aria-label={modoOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                  style={{
                    background: tema.bgBuscador,
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={modoOscuro ? iconoSol : iconoLuna}
                    alt=""
                    style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                  />
                </button>
              </div>

              <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeSeparador, margin: 0 }} aria-hidden="true" />

              {/* SALIR */}
              <button
                onClick={manejarCierreSesion}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '12px 0',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {t('Salir')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="contenedor-principal" style={{ display: 'flex', padding: '110px 60px 40px', gap: '50px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* FILTROS LATERALES */}
        <aside
          className="aside-filtros"
          aria-label={t('filtros')}
          style={{
            width: '220px',
            flexShrink: 0,
            alignSelf: 'flex-start',
            position: 'sticky',
            top: '90px',
            maxHeight: 'calc(100vh - 110px)',
            overflowY: 'auto',
            paddingRight: '4px'
          }}
        >
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: tema.textoDestacado, letterSpacing: '1px', marginBottom: '25px', textTransform: 'uppercase' }}>{t('filtros')}</h2>
          
          {/* TIPO DE PLANTA */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: tema.textoDestacado, marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('tipo')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: tema.textoSecundario }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Interior" checked={filtrosCategoria.Interior} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('interior')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Exterior" checked={filtrosCategoria.Exterior} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('exterior')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Herramientas" checked={filtrosCategoria.Herramientas} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('herramientas')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Abono" checked={filtrosCategoria.Abono} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('tierra_abonos')}
                </label>
            </div>
          </fieldset>

          <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeSeparador, margin: '20px 0' }} aria-hidden="true" />

          {/* NIVEL DE RIEGO */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: tema.textoDestacado, marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('riego')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: tema.textoSecundario }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Bajo" checked={filtrosRiego.Bajo} onChange={manejarCambioRiego} style={{ accentColor: '#19381f' }} /> {t('bajo')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Moderado" checked={filtrosRiego.Moderado} onChange={manejarCambioRiego} style={{ accentColor: '#19381f' }} /> {t('moderado')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Frecuente" checked={filtrosRiego.Frecuente} onChange={manejarCambioRiego} style={{ accentColor: '#19381f' }} /> {t('frecuente')}
              </label>
            </div>
          </fieldset>

          <hr style={{ border: 'none', height: '1px', backgroundColor: tema.bordeSeparador, margin: '20px 0' }} aria-hidden="true" />

          {/* ILUMINACIÓN */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: tema.textoDestacado, marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('iluminacion')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: tema.textoSecundario }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Sol Directo" checked={filtrosLuz['Sol Directo']} onChange={manejarCambioLuz} style={{ accentColor: '#19381f' }} /> {t('sol_directo')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Luz Indirecta" checked={filtrosLuz['Luz Indirecta']} onChange={manejarCambioLuz} style={{ accentColor: '#19381f' }} /> {t('luz_indirecta')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="Sombra" checked={filtrosLuz.Sombra} onChange={manejarCambioLuz} style={{ accentColor: '#19381f' }} /> {t('sombra')}
              </label>
            </div>
          </fieldset>
        </aside>

        {/* CONTENIDO CATÁLOGO */}
        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: tema.textoPrincipal, margin: '0 0 5px 0' }}>{t('titulo')}</h1>
            <p style={{ color: tema.textoDestacado, fontSize: '14px', margin: 0 }} aria-live="polite">
              {t('mostrando', { count: productosFiltrados.length })}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }} aria-busy={cargando}>
            {cargando ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: tema.textoDestacado }} aria-live="assertive">{t('cargando')}</p>
            ) : productosFiltrados.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: tema.textoDestacado }}>{t('no_encontrado')}</p>
            ) : (
              productosFiltrados.map((planta) => (
                <article
                  key={planta.id}
                  className="tarjeta-planta"
                  tabIndex={0}
                  style={{
                    background: tema.bgTarjeta,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    opacity: planta.stock === 0 ? 0.7 : 1,
                    '--color-contorno': colorContorno
                  }}
                >
                  
                  <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(25, 56, 31, 0.85)', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', zIndex: 1 }}>
                    <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>Categoría: </span>
                    {t(planta.categoria.toLowerCase())}
                  </span>

                  <div style={{ width: '100%', height: '220px' }}>
                    <img src={planta.imagen} alt={`Fotografía de una planta ${planta.nombre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h2 style={{ fontSize: '19px', margin: '0 0 4px 0', color: tema.textoPrincipal, fontWeight: '700' }}>{planta.nombre}</h2>
                    
                    {planta.nombreCientifico && planta.nombreCientifico !== 'No aplica' && (
                      <p style={{ fontStyle: 'italic', fontSize: '13px', color: tema.textoDestacado, margin: '0 0 15px 0' }}>
                        <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                          Nombre científico:
                        </span>
                        {planta.nombreCientifico}
                      </p>
                    )}
                    
                    {planta.descripcion && (
                      <p style={{ fontSize: '13px', color: tema.textoSecundario, margin: '0 0 15px 0', lineHeight: '1.4' }}>
                        {planta.descripcion}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {planta.luz && planta.luz !== 'No aplica' && (
                        <span style={{ backgroundColor: tema.bgTagLuz, color: modoOscuro ? '#aedcae' : '#19381f', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                          {t(planta.luz.toLowerCase().replace(' ', '_'))}
                        </span>
                      )}

                      {planta.riego && planta.riego !== 'No aplica' && (
                        <span style={{ backgroundColor: tema.bgTagRiego, color: modoOscuro ? '#ffcca3' : '#8b5a42', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                          {t(planta.riego.toLowerCase())}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: tema.textoPrincipal }}>
                        ${planta.precio} <span style={{ fontSize: '12px', color: tema.textoSecundario, fontWeight: 'normal' }}>{i18n.language === 'es' ? 'pesos mexicanos' : 'MXN'}</span>
                      </span>
                      <button 
                        disabled={planta.stock === 0}
                        onClick={() => setCarritoCount(prev => prev + 1)}
                        aria-label={planta.stock === 0 ? `Agotado` : `Añadir ${planta.nombre}`}
                        style={{ 
                          backgroundColor: planta.stock === 0 ? '#ccc' : '#19381f', 
                          color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', 
                          fontSize: '13px', fontWeight: '600', cursor: planta.stock === 0 ? 'not-allowed' : 'pointer' 
                        }}
                      >
                        {planta.stock === 0 ? t('agotado') : t('carrito')}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Catalogo;