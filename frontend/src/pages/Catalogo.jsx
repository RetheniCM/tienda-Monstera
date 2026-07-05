import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoMonstera from '../assets/log_monstera.png';
import { useTranslation } from 'react-i18next';

function Catalogo() {
  const { t, i18n } = useTranslation();
  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  // 1. ESTADOS PRINCIPALES
  const [carritoCount, setCarritoCount] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. ESTADOS DE FILTROS
  const [filtrosCategoria, setFiltrosCategoria] = useState({ Interior: false, Exterior: false });
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
              imagen: rutaImagen
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

    const algunaCategoriaActiva = filtrosCategoria.Interior || filtrosCategoria.Exterior;
    const coincideCategoria = !algunaCategoriaActiva || filtrosCategoria[planta.categoria];

    const algunRiegoActivo = filtrosRiego.Bajo || filtrosRiego.Moderado || filtrosRiego.Frecuente;
    const coincideRiego = !algunRiegoActivo || filtrosRiego[planta.riego];

    const algunaLuzActiva = filtrosLuz['Sol Directo'] || filtrosLuz['Luz Indirecta'] || filtrosLuz.Sombra;
    const coincideLuz = !algunaLuzActiva || filtrosLuz[planta.luz];

    return coincideBusqueda && coincideCategoria && coincideRiego && coincideLuz;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fbfaf7', color: '#19381f', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER ACCESIBLE */}
      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 60px', background: '#ffffff', borderBottom: '1px solid rgba(230, 227, 221, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoMonstera} alt="Monstera - Logotipo de la tienda de plantas" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d3b24' }} aria-hidden="true">Monstera</span>
        </div>
        
        {/* SELECTOR DE IDIOMAS ACCESIBLE */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} role="navigation" aria-label="Selección de idioma">
          <button 
            onClick={() => cambiarIdioma('es')} 
            style={{ fontWeight: i18n.language === 'es' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: '#19381f', fontSize: '14px' }}
          >
          🇲🇽 ES
        </button>
        <span style={{ color: '#ccc' }} aria-hidden="true">|</span>
          <button 
          onClick={() => cambiarIdioma('en')} 
          style={{ fontWeight: i18n.language === 'en' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: '#19381f', fontSize: '14px' }}
        >
        🇺🇸 EN
        </button>
        <span style={{ color: '#ccc' }} aria-hidden="true">|</span>
        {/* NUEVO BOTÓN PARA JAPONÉS */}
        <button 
          onClick={() => cambiarIdioma('ja')} 
          aria-label="日本語に言語を変更"
          style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: '#19381f', fontSize: '14px' }}
        >
        🇯🇵 JA
      </button>
    </div>
        
        {/* Input de búsqueda traducido */}
        <div style={{ flex: '0 1 500px', position: 'relative' }}>
          <label htmlFor="buscador-plantas" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
            {t('buscar')}
          </label>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} aria-hidden="true"></span>
          <input 
            id="buscador-plantas"
            type="search" 
            placeholder={t('buscar')} // <-- Traduce el placeholder dinámicamente
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 15px 10px 40px', backgroundColor: '#eae5dd', border: 'none', borderRadius: '8px', fontSize: '14px', color: '#444' }}
          />
        </div>

        {/* Botón de carrito traducido */}
        <button 
          aria-label={`${t('carrito')}, contiene ${carritoCount} artículos`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#19381f', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
        >
          <span aria-hidden="true"></span> <span>{t('carrito')} ({carritoCount})</span>
        </button>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ display: 'flex', padding: '40px 60px', gap: '50px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* FILTROS LATERALES TRADUCIDOS */}
        <aside aria-label={t('filtros')} style={{ width: '220px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#8b5a42', letterSpacing: '1px', marginBottom: '25px', textTransform: 'uppercase' }}>{t('filtros')}</h2>
          
          {/* TIPO DE PLANTA */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: '#8b5a42', marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('tipo')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#555' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Interior" checked={filtrosCategoria.Interior} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('interior')}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="Exterior" checked={filtrosCategoria.Exterior} onChange={manejarCambioCategoria} style={{ accentColor: '#19381f' }} /> {t('exterior')}
                </label>
            </div>
          </fieldset>

          <hr style={{ border: 'none', height: '1px', backgroundColor: '#e6e3dd', margin: '20px 0' }} aria-hidden="true" />

          {/* NIVEL DE RIEGO */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: '#8b5a42', marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('riego')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#555' }}>
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

          <hr style={{ border: 'none', height: '1px', backgroundColor: '#e6e3dd', margin: '20px 0' }} aria-hidden="true" />

          {/* ILUMINACIÓN */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 30px 0' }}>
            <legend style={{ fontSize: '13px', fontWeight: '700', color: '#8b5a42', marginBottom: '15px', textTransform: 'uppercase', width: '100%' }}>
              {t('iluminacion')}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#555' }}>
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

        {/* CONTENIDO CATÁLOGO TRADUCIDO */}
        <main style={{ flex: 1 }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#19381f', margin: '0 0 5px 0' }}>{t('titulo')}</h1>
            <p style={{ color: '#8b5a42', fontSize: '14px', margin: 0 }} aria-live="polite">
              {/* AQUÍ ES DONDE DEBES BORRAR LOS "i18n.language == ..." VIEJOS Y PONER LA LÍNEA NUEVA: */}
              {t('mostrando', { count: productosFiltrados.length })}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }} aria-busy={cargando}>
            {cargando ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#8b5a42' }} aria-live="assertive">{t('cargando')}</p>
            ) : productosFiltrados.length === 0 ? (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#8b5a42' }}>{t('no_encontrado')}</p>
            ) : (
              productosFiltrados.map((planta) => (
                <article key={planta.id} style={{ background: '#eae5dd', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', position: 'relative', opacity: planta.stock === 0 ? 0.7 : 1 }}>
                  
                  <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(25, 56, 31, 0.85)', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', zIndex: 1 }}>
                    <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>Categoría: </span>
                    {planta.categoria}
                  </span>

                  <div style={{ width: '100%', height: '220px' }}>
                    <img src={planta.imagen} alt={`Fotografía de una planta ${planta.nombre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h2 style={{ fontSize: '19px', margin: '0 0 4px 0', color: '#19381f', fontWeight: '700' }}>{planta.nombre}</h2>
                    <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#8b5a42', margin: '0 0 15px 0' }}>
                      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>Nombre científico: </span>
                      {planta.nombreCientifico}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#ced7cc', color: '#19381f', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                        {planta.luz}
                      </span>
                      <span style={{ backgroundColor: '#f0e6d2', color: '#8b5a42', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                        {planta.riego}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#19381f' }}>
                        ${planta.precio} <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>{i18n.language === 'es' ? 'pesos mexicanos' : 'MXN'}</span>
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
                        {planta.stock === 0 ? (i18n.language === 'es' ? 'Agotado' : 'Out of stock') : '+ Carrito'}
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