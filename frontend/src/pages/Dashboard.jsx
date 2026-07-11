import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logoMonstera from '../assets/log_monstera.png';
import { useNavigate } from 'react-router-dom';
import iconoSol from '../assets/icono_sol.png';
import iconoLuna from '../assets/icono_luna.png';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 1. ESTADOS PRINCIPALES
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuCategoriasOpen, setMenuCategoriasOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  
  // CONTROL DE VISTA ('tabla' o 'tarjetas')
  const [vistaLayout, setVistaLayout] = useState('tabla');

  // ESTADO PARA MENÚ DE HAMBURGUESA
  const [menuHamburguesaOpen, setMenuHamburguesaOpen] = useState(false);

  // ESTADO PARA COLOR DE HOVER PERSONALIZADO (Por defecto usa el verde institucional)
  const [colorHoverUsuario, setColorHoverUsuario] = useState(() => {
    return localStorage.getItem('colorHoverPersonalizado') || '#1e4620';
  });

  // Guardar preferencia de color del usuario
  useEffect(() => {
    localStorage.setItem('colorHoverPersonalizado', colorHoverUsuario);
  }, [colorHoverUsuario]);

  // Estados para métricas
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [valorInventario, setValorInventario] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);

  // Estados para los Modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [headerSticky, setHeaderSticky] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    // Si el scroll es mayor a 50px, activamos el modo sticky
    setHeaderSticky(window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id_producto: '',
    nombre_comun: '',
    nombre_cienti: '',
    categoria: 'Interior',
    precio: 0,
    stock: 0,
    imagen: '',
    nivel_riego: 'Moderado', 
    nivel_luz: 'Media',
    descripcion: ''
  });

  // MODO OSCURO
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro';
  });

  useEffect(() => {
    localStorage.setItem('tema', modoOscuro ? 'oscuro' : 'claro');
  }, [modoOscuro]);

  const tema = {
    bgPrincipal: modoOscuro ? '#121212' : '#faf9f5',
    bgTarjeta: modoOscuro ? '#1e1e1e' : 'white',
    bgInput: modoOscuro ? '#2d2d2d' : '#eae6df',
    bgTablaHeader: modoOscuro ? '#252525' : '#faf9f5',
    borde: modoOscuro ? '#333333' : '#eae6df',
    textoPrincipal: modoOscuro ? '#e0e0e0' : '#132c15',
    textoSecundario: modoOscuro ? '#a0a0a0' : '#85735d',
    textoTitulo: modoOscuro ? '#ffffff' : '#132c15',
    bgBotónTema: modoOscuro ? '#2d2d2d' : '#eae5dd',
    metricaStock: modoOscuro ? '#81c784' : '#2b5c31',
    metricaValor: modoOscuro ? '#ffb74d' : '#805333',
    metricaCritico: modoOscuro ? '#ff6b6b' : '#b83b1d',
    badgeBg: modoOscuro ? '#2d4a30' : '#e2ece4',
    badgeTexto: modoOscuro ? '#aedcae' : '#1e4620'
  };

  const listaCategoriasSoportadas = ['Interior', 'Exterior', 'Herramientas', 'Abono'];

  // 2. CARGA DE DATOS
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/productos');
      const datos = await respuesta.json();
      setProductos(datos);

      setTotalProductos(datos.length);
      setTotalStock(datos.reduce((acc, p) => acc + Number(p.stock || 0), 0));
      setValorInventario(datos.reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.stock || 0)), 0));
      setStockBajo(datos.filter(p => Number(p.stock || 0) <= 7).length);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // 3. OPERACIONES CRUD
  const manejarAgregar = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoSeleccionado)
      });
      if (respuesta.ok) {
        setModalAgregarOpen(false);
        obtenerProductos();
      }
    } catch (error) {
      console.error("Error al agregar:", error);
    }
  };

  const manejarEditar = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`http://localhost:5000/api/productos/${productoSeleccionado.id_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoSeleccionado)
      });
      if (respuesta.ok) {
        setModalEditarOpen(false);
        obtenerProductos();
      }
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const manejarEliminar = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        const respuesta = await fetch(`http://localhost:5000/api/productos/${id}`, {
          method: 'DELETE'
        });
        if (respuesta.ok) {
          obtenerProductos();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = 
        (p.nombre_comun || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.nombre_cienti || '').toLowerCase().includes(busqueda.toLowerCase());
        
    const catProducto = (p.categoria || '').toLowerCase().trim();
    const catSeleccionada = categoriaSeleccionada.toLowerCase().trim();

    const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || 
        catProducto === catSeleccionada ||
        (catSeleccionada === 'abono' && catProducto.includes('abono')) ||
        (catProducto === 'abono' && catSeleccionada.includes('abono'));

    return coincideBusqueda && coincideCategoria;
  });

  const manejarCierreSesion = () => {
    localStorage.removeItem('rol');
    navigate('/');
  };

  const abrirModalAgregar = () => {
    setProductoSeleccionado({
      nombre_comun: '',
      nombre_cienti: '',
      categoria: 'Interior',
      precio: 0,
      stock: 0,
      imagen: '',
      nivel_riego: 'Moderado', 
      nivel_luz: 'Media',
      descripcion: ''
    });
    setModalAgregarOpen(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoSeleccionado({
      ...producto,
      descripcion: producto.descripcion || ''
    });
    setModalEditarOpen(true);
  };

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
  };

  const traducirCategoria = (categoria) => {
    if (!categoria) return '';
    const formato = categoria.toLowerCase().trim();
    if (formato === 'interior') return t('cat_interior');
    if (formato === 'exterior') return t('cat_exterior');
    if (formato === 'herramientas') return t('cat_herramientas');
    if (formato === 'tierra/abonos' || formato === 'abono' || formato === 'abonos') return t('cat_abono');
    return categoria;
  };

  const traducirRiego = (riego) => {
    if (!riego) return '';
    const formato = riego.toLowerCase().trim();
    if (formato === 'bajo') return t('riego_bajo');
    if (formato === 'moderado') return t('riego_moderado');
    if (formato === 'frecuente') return t('riego_frecuente');
    return riego;
  };

  const traducirLuz = (luz) => {
    if (!luz) return '';
    const formato = luz.toLowerCase().trim();
    if (formato === 'sombra') return t('luz_sombra');
    if (formato === 'luz indirecta' || formato === 'indirecta') return t('luz_indirecta');
    if (formato === 'sol directo' || formato === 'directo') return t('luz_directo');
    return luz;
  };

  return (
    <div style={{ backgroundColor: tema.bgPrincipal, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: tema.textoPrincipal, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* ESTILOS CSS DINÁMICOS CON HOVER CONFIGURABLE */}
      <style>{`
        .fila-tabla {
          transition: background-color 0.15s ease;
        }
        .fila-tabla:hover {
          background-color: ${colorHoverUsuario}1F !important; /* Opacidad ligera de fondo */
          outline: 2px solid ${colorHoverUsuario};
        }
        .tarjeta-producto {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        .tarjeta-producto:hover {
          transform: translateY(-6px);
          border-color: ${colorHoverUsuario} !important;
          border-width: 2px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25) !important;
        }
      `}</style>
      
      {/* HEADER SUPERIOR */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: headerSticky ? '10px 40px' : '20px 40px', // Se vuelve más compacto al bajar
          borderBottom: `1px solid ${tema.borde}`, 
          position: 'fixed', // Cambiamos a fixed
          top: 0, 
          left: 0,
          right: 0,
          backgroundColor: tema.bgTarjeta, 
          zIndex: 1000, // Asegura que siempre esté encima
          transition: 'padding 0.3s ease, box-shadow 0.3s ease',
          boxShadow: headerSticky ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoMonstera} alt="Monstera" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: modoOscuro ? '#aedcae' : '#1d3b24' }}>Monstera</span>
        </div>
        
        {/* BOTÓN HAMBURGUESA INTERACTIVO */}
        <button 
          onClick={() => setMenuHamburguesaOpen(!menuHamburguesaOpen)}
          style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: tema.textoPrincipal, display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', alignItems: 'center', width: '40px', height: '40px', borderRadius: '8px', padding: 0 }}
          aria-label="Menú de opciones"
        >
          <div style={{ width: '25px', height: '3px', backgroundColor: tema.textoPrincipal, borderRadius: '2px', transition: '0.3s', transform: menuHamburguesaOpen ? 'rotate(45deg) translate(6px, 5px)' : 'none' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: tema.textoPrincipal, borderRadius: '2px', transition: '0.3s', opacity: menuHamburguesaOpen ? 0 : 1 }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: tema.textoPrincipal, borderRadius: '2px', transition: '0.3s', transform: menuHamburguesaOpen ? 'rotate(-45deg) translate(6px, -5px)' : 'none' }}></div>
        </button>

        {/* MENÚ DESPLEGABLE DE HAMBURGUESA */}
        {menuHamburguesaOpen && (
          <div style={{ position: 'absolute', top: '100%', right: '40px', marginTop: '10px', backgroundColor: tema.bgTarjeta, border: `1px solid ${tema.borde}`, borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.25)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 200, minWidth: '240px' }}>
            
            {/* SECCIÓN 1: PERSONALIZADOR DE COLOR (HOVER) */}
            <div style={{ borderBottom: `1px solid ${tema.borde}`, paddingBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: tema.textoSecundario, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>{t('color')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="color" 
                  value={colorHoverUsuario}
                  onChange={(e) => setColorHoverUsuario(e.target.value)}
                  style={{ border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', backgroundColor: 'transparent' }}
                  title=" Elige tu color interactivo"
                />
                <span style={{ fontSize: '13px', fontFamily: 'monospace', color: tema.textoPrincipal }}>{colorHoverUsuario.toUpperCase()}</span>
              </div>
            </div>

            {/* SECCIÓN 2: CAMBIAR IDIOMA */}
            <div style={{ borderBottom: `1px solid ${tema.borde}`, paddingBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: tema.textoSecundario, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>{t('idioma')}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => cambiarIdioma('es')} style={{ fontWeight: i18n.language === 'es' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'es' ? tema.bgInput : 'none', border: 'none', color: tema.textoPrincipal, fontSize: '13px', padding: '5px 8px', borderRadius: '6px' }}>🇲🇽 ES</button>
                <button onClick={() => cambiarIdioma('en')} style={{ fontWeight: i18n.language === 'en' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'en' ? tema.bgInput : 'none', border: 'none', color: tema.textoPrincipal, fontSize: '13px', padding: '5px 8px', borderRadius: '6px' }}>🇺🇸 EN</button>
                <button onClick={() => cambiarIdioma('ja')} style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', cursor: 'pointer', background: i18n.language === 'ja' ? tema.bgInput : 'none', border: 'none', color: tema.textoPrincipal, fontSize: '13px', padding: '5px 8px', borderRadius: '6px' }}>🇯🇵 JA</button>
              </div>
            </div>

            {/* SECCIÓN 3: INTERRUPTOR DE TEMA (CLARO/OSCURO) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${tema.borde}`, paddingBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: tema.textoPrincipal }}>
                {modoOscuro ? t('ModoClaro') : t('ModoOscuro')}
              </span>
              <button
                onClick={() => setModoOscuro(!modoOscuro)}
                aria-label="Cambiar tema"
                style={{ background: tema.bgBotónTema, border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }}
              >
                <img src={modoOscuro ? iconoSol : iconoLuna} alt="Tema" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
              </button>
            </div>

            {/* SECCIÓN 4: BOTÓN SALIR */}
            <button 
              onClick={manejarCierreSesion}
              style={{ background: modoOscuro ? '#442222' : '#fde8e8', border: 'none', color: tema.metricaCritico, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', width: '100%', textAlign: 'center' }}
            >
              {t('salir')}
            </button>
          </div>
        )}
      </header>

      {/* PANEL PRINCIPAL */}
      <main style={{ padding: '40px', paddingTop: '100px' }}>
        <h1 style={{ fontSize: '36px', color: tema.textoTitulo, margin: '0 0 5px 0', fontFamily: 'serif', fontWeight: '700' }}>
          {t('panel_control')}
        </h1>
        <p style={{ color: tema.textoSecundario, margin: '0 0 30px 0', fontSize: '15px' }}>
          {t('gestion_inventario')}
        </p>

        {/* MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: tema.bgTarjeta, padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borde}` }}>
            <div style={{ fontSize: '12px', color: tema.textoSecundario, fontWeight: '600', textTransform: 'uppercase' }}>{t('productos')}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: tema.textoTitulo, margin: '5px 0' }}>{totalProductos}</div>
            <div style={{ fontSize: '12px', color: tema.textoSecundario }}>{t('registrados')}</div>
          </div>
          <div style={{ background: tema.bgTarjeta, padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borde}` }}>
            <div style={{ fontSize: '12px', color: tema.textoSecundario, fontWeight: '600', textTransform: 'uppercase' }}>{t('unidades_stock')}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: tema.metricaStock, margin: '5px 0' }}>{totalStock}</div>
            <div style={{ fontSize: '12px', color: tema.textoSecundario }}>{t('disponibles')}</div>
          </div>
          <div style={{ background: tema.bgTarjeta, padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borde}` }}>
            <div style={{ fontSize: '12px', color: tema.textoSecundario, fontWeight: '600', textTransform: 'uppercase' }}>{t('valor_inventario')}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: tema.metricaValor, margin: '5px 0' }}>${valorInventario.toLocaleString('es-MX')} MXN</div>
            <div style={{ fontSize: '12px', color: tema.textoSecundario }}>{t('valor_total')}</div>
          </div>
          <div style={{ background: tema.bgTarjeta, padding: '20px', borderRadius: '12px', border: `1px solid ${tema.borde}` }}>
            <div style={{ fontSize: '12px', color: tema.textoSecundario, fontWeight: '600', textTransform: 'uppercase' }}>{t('stock_bajo')}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: tema.metricaCritico, margin: '5px 0' }}>{stockBajo}</div>
            <div style={{ fontSize: '12px', color: tema.textoSecundario }}>{t('productos_criticos')}</div>
          </div>
        </div>

        {/* BUSCADOR Y FILTROS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px', alignItems: 'stretch' }}>
          <input 
            type="text" 
            placeholder={t('buscar_placeholder')}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', border: `1px solid ${tema.borde}`, backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
          />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                type="button"
                onClick={() => setMenuCategoriasOpen(!menuCategoriasOpen)}
                style={{ padding: '10px 15px', borderRadius: '8px', border: `1px solid ${modoOscuro ? '#aedcae' : '#1e4620'}`, background: tema.bgTarjeta, color: modoOscuro ? '#aedcae' : '#1e4620', cursor: 'pointer', fontWeight: '500', height: '100%', minWidth: '120px' }}
            >
                {categoriaSeleccionada === 'Todas' ? t('categorias') : traducirCategoria(categoriaSeleccionada)} ▾
            </button>

            {menuCategoriasOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px', backgroundColor: tema.bgTarjeta, border: `1px solid ${tema.borde}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 100, width: '160px', overflow: 'hidden' }}>
                  <button
                      type="button"
                      onClick={() => {
                        setCategoriaSeleccionada('Todas');
                        setMenuCategoriasOpen(false);
                      }}
                      style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: categoriaSeleccionada === 'Todas' ? tema.bgInput : 'transparent', color: tema.textoPrincipal, textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: categoriaSeleccionada === 'Todas' ? '600' : '400' }}
                  >
                      {t('todas')}
                  </button>

                  {listaCategoriasSoportadas.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                            setCategoriaSeleccionada(cat);
                            setMenuCategoriasOpen(false);
                        }}
                        style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: categoriaSeleccionada === cat ? tema.bgInput : 'transparent', color: tema.textoPrincipal, textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: categoriaSeleccionada === cat ? '600' : '400' }}
                      >
                        {traducirCategoria(cat)}
                      </button>
                  ))}
                </div>
            )}
          </div>

          {/* INTERRUPTOR DE VISTAS (Tabla vs Tarjetas) */}
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${tema.borde}`, backgroundColor: tema.bgTarjeta }}>
            <button
              onClick={() => setVistaLayout('tabla')}
              title="Vista de Tabla"
              style={{ padding: '0 15px', border: 'none', background: vistaLayout === 'tabla' ? tema.bgInput : 'transparent', color: tema.textoPrincipal, cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '16px' }}
            >
              ☰
            </button>
            <button
              onClick={() => setVistaLayout('tarjetas')}
              title="Vista de Tarjetas"
              style={{ padding: '0 15px', border: 'none', background: vistaLayout === 'tarjetas' ? tema.bgInput : 'transparent', color: tema.textoPrincipal, cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '16px' }}
            >
              ⊞
            </button>
          </div>

          <button onClick={abrirModalAgregar} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: modoOscuro ? '#2d4a30' : '#1e4620', color: modoOscuro ? '#aedcae' : 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            {t('agregar_producto')}
          </button>
        </div>

        {/* CONTENEDOR DINÁMICO LAYOUT */}
        {vistaLayout === 'tabla' ? (
          /* VISTA DE TABLA */
          <div style={{ backgroundColor: tema.bgTarjeta, borderRadius: '12px', border: `1px solid ${tema.borde}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tema.borde}`, color: tema.textoSecundario, backgroundColor: tema.bgTablaHeader, fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '15px' }}>{t('id')}</th>
                  <th style={{ padding: '15px' }}>{t('producto')}</th>
                  <th style={{ padding: '15px' }}>{t('categoria')}</th>
                  <th style={{ padding: '15px' }}>{t('precio')}</th>
                  <th style={{ padding: '15px' }}>{t('stock')}</th>
                  <th style={{ padding: '15px' }}>{t('acciones')}</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto, index) => (
                  <tr key={producto.id_producto || index} className="fila-tabla" style={{ borderBottom: `1px solid ${tema.borde}` }}>
                    <td style={{ padding: '15px', color: tema.textoSecundario }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={producto.imagen || 'https://via.placeholder.com/40'} 
                          alt={producto.nombre_comun} 
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: tema.textoTitulo }}>{producto.nombre_comun}</div>
                          {producto.nombre_cienti && producto.nombre_cienti !== 'No aplica' && (
                            <div style={{ fontSize: '12px', color: tema.textoSecundario, fontStyle: 'italic' }}>{producto.nombre_cienti}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: tema.badgeBg, color: tema.badgeTexto, padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                        {traducirCategoria(producto.categoria)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontWeight: '600', color: tema.textoTitulo }}>
                      ${Number(producto.precio).toLocaleString('es-MX')} <span style={{ fontSize: '11px', color: tema.textoSecundario, fontWeight: '400' }}>MXN</span>
                    </td>
                    <td style={{ padding: '15px', color: producto.stock <= 7 ? tema.metricaCritico : tema.textoPrincipal, fontWeight: producto.stock <= 7 ? '700' : '400' }}>
                      {producto.stock} uds. {producto.stock <= 7 && `(${t('critico')})`}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => abrirModalEditar(producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px', color: modoOscuro ? '#6ba4e8' : '#0066cc' }}>{t('editar')}</button>
                      <button onClick={() => manejarEliminar(producto.id_producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: tema.metricaCritico }}>{t('eliminar')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* VISTA DE TARJETAS */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {productosFiltrados.map((producto, index) => (
              <div 
                key={producto.id_producto || index} 
                className="tarjeta-producto"
                style={{ backgroundColor: tema.bgTarjeta, borderRadius: '16px', border: `1px solid ${tema.borde}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
              >
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#eae6df' }}>
                  <img 
                    src={producto.imagen || 'https://via.placeholder.com/200'} 
                    alt={producto.nombre_comun} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: tema.badgeBg, color: tema.badgeTexto, padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    {traducirCategoria(producto.categoria)}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: tema.textoTitulo, margin: 0 }}>{producto.nombre_comun}</h3>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: modoOscuro ? '#81c784' : '#1e4620' }}>
                        ${Number(producto.precio).toLocaleString('es-MX')}
                      </span>
                    </div>

                    {producto.nombre_cienti && producto.nombre_cienti !== 'No aplica' && (
                      <p style={{ fontSize: '13px', color: tema.textoSecundario, fontStyle: 'italic', margin: '0 0 12px 0' }}>{producto.nombre_cienti}</p>
                    )}

                    {producto.descripcion && (
                      <p style={{ fontSize: '13px', color: tema.textoSecundario, margin: '0 0 15px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {producto.descripcion}
                      </p>
                    )}

                    {producto.categoria?.toLowerCase().trim() !== 'herramientas' && 
                    producto.categoria?.toLowerCase().trim() !== 'abono' && (
                      <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: tema.textoSecundario, marginBottom: '15px' }}>
                        {producto.nivel_riego && producto.nivel_riego !== 'No aplica' && (
                          <span> {traducirRiego(producto.nivel_riego)}</span>
                        )}
                        {producto.nivel_luz && producto.nivel_luz !== 'No aplica' && (
                          <span> {traducirLuz(producto.nivel_luz)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${tema.borde}`, paddingTop: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: tema.textoSecundario }}>Stock:</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: producto.stock <= 7 ? tema.metricaCritico : tema.textoPrincipal }}>
                        {producto.stock} uds. {producto.stock <= 7 && `(${t('critico')})`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => abrirModalEditar(producto)} 
                        style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${tema.borde}`, background: 'transparent', color: modoOscuro ? '#6ba4e8' : '#0066cc', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                      >
                        {t('editar')} 
                      </button>
                      <button 
                        onClick={() => manejarEliminar(producto.id_producto)} 
                        style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: modoOscuro ? '#442222' : '#fde8e8', color: tema.metricaCritico, cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                      >
                        {t('eliminar')} 
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL AGREGAR / EDITAR */}
      {(modalAgregarOpen || modalEditarOpen) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: modoOscuro ? 'rgba(0, 0, 0, 0.7)' : 'rgba(19, 44, 21, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: tema.bgTarjeta, padding: '35px', borderRadius: '20px', width: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative', border: `1px solid ${tema.borde}` }}>
            
            <button 
              onClick={() => { setModalAgregarOpen(false); setModalEditarOpen(false); }} 
              style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: tema.textoSecundario }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '24px', fontFamily: 'serif', color: tema.textoTitulo, marginTop: 0, marginBottom: '25px' }}>
              {modalAgregarOpen ? t('titulo_agregar') : t('titulo_editar')}
            </h2>

            <form onSubmit={modalAgregarOpen ? manejarAgregar : manejarEditar}>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('lbl_nombre_comun')}</label>
                <input 
                  type="text" 
                  value={productoSeleccionado.nombre_comun}
                  placeholder="ej. Monstera Deliciosa"
                  onChange={(e) => setProductoSeleccionado({...productoSeleccionado, nombre_comun: e.target.value})}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('lbl_nombre_cientifico')}</label>
                <input 
                  type="text" 
                  value={productoSeleccionado.nombre_cienti}
                  placeholder="ej. Monstera deliciosa"
                  onChange={(e) => setProductoSeleccionado({...productoSeleccionado, nombre_cienti: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('lbl_descripcion')}</label>
                <textarea 
                  value={productoSeleccionado.descripcion}
                  placeholder={t('ph_descripcion')}
                  onChange={(e) => setProductoSeleccionado({...productoSeleccionado, descripcion: e.target.value})}
                  rows="3"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('categoria')}</label>
                  <select 
                    value={productoSeleccionado.categoria}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, categoria: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal, height: '42px' }}
                  >
                    <option value="Interior">{t('cat_interior')}</option>
                    <option value="Exterior">{t('cat_exterior')}</option>
                    <option value="Herramientas">{t('cat_herramientas')}</option>
                    <option value="Abono">{t('cat_abono')}</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('lbl_precio')}</label>
                  <input 
                    type="number" 
                    value={productoSeleccionado.precio}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, precio: Number(e.target.value)})}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('stock')}</label>
                  <input 
                    type="number" 
                    value={productoSeleccionado.stock}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, stock: Number(e.target.value)})}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: tema.textoPrincipal, marginBottom: '6px' }}>{t('lbl_url_imagen')}</label>
                  <input 
                    type="text" 
                    value={productoSeleccionado.imagen}
                    placeholder="https://..."
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, imagen: e.target.value})}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: tema.textoPrincipal, marginBottom: '5px' }}>
                    {t('lbl_nivel_riego')}
                  </label>
                  <select
                    value={productoSeleccionado.nivel_riego || 'Moderado'}
                    onChange={(e) => setProductoSeleccionado({
                      ...productoSeleccionado,
                      nivel_riego: e.target.value
                    })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal, fontSize: '14px', height: '45px' }}
                  >
                    <option value="Bajo">{t('riego_bajo')}</option>
                    <option value="Moderado">{t('riego_moderado')}</option>
                    <option value="Frecuente">{t('riego_frecuente')}</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: tema.textoPrincipal, marginBottom: '5px' }}>
                    {t('lbl_nivel_luz')}
                  </label>
                  <select
                    value={productoSeleccionado.nivel_luz || 'Media'}
                    onChange={(e) => setProductoSeleccionado({
                      ...productoSeleccionado,
                      nivel_luz: e.target.value
                    })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: tema.bgInput, color: tema.textoPrincipal, fontSize: '14px', height: '45px' }}
                  >
                    <option value="Sombra">{t('luz_sombra')}</option>
                    <option value="Luz Indirecta">{t('luz_indirecta')}</option>
                    <option value="Sol Directo">{t('luz_directo')}</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => { setModalAgregarOpen(false); setModalEditarOpen(false); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1px solid ${modoOscuro ? '#aedcae' : '#132c15'}`, backgroundColor: 'transparent', color: modoOscuro ? '#aedcae' : '#132c15', cursor: 'pointer', fontWeight: '600' }}
                >
                  {t('btn_cancelar')}
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: modoOscuro ? '#2d4a30' : '#132c15', color: modoOscuro ? '#aedcae' : 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                  {modalAgregarOpen ? t('agregar_producto') : t('btn_guardar')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;