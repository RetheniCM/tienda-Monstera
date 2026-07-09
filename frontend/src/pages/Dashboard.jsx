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
  
  // Estados para métricas
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [valorInventario, setValorInventario] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);

  // Estados para los Modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id_producto: '',
    nombre_comun: '',
    nombre_cienti: '',
    categoria: 'Interior',
    precio: 0,
    stock: 0,
    imagen: '',
    nivel_riego: 'Moderado', 
    nivel_luz: 'Media'
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

  // Lista fija de categorías del vivero mapeadas para traducción interna
  const listaCategoriasSoportadas = ['Interior', 'Exterior', 'Herramientas', 'Tierra/Abonos'];

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
        
    const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || 
        (p.categoria && p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase());

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
      nivel_luz: 'Media'
    });
    setModalAgregarOpen(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditarOpen(true);
  };

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
  };

  const traducirCategoria = (categoria) => {
    if (!categoria) return '';
    const formato = categoria.toLowerCase();
    if (formato === 'interior') return t('cat_interior');
    if (formato === 'exterior') return t('cat_exterior');
    if (formato === 'herramientas') return t('cat_herramientas');
    if (formato === 'tierra/abonos' || formato === 'abono') return t('cat_abono');
    return categoria;
  };

  return (
    <div style={{ backgroundColor: tema.bgPrincipal, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: tema.textoPrincipal, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* HEADER SUPERIOR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: `1px solid ${tema.borde}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoMonstera} alt="Monstera" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: modoOscuro ? '#aedcae' : '#1d3b24' }}>Monstera</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => cambiarIdioma('es')} 
            style={{ fontWeight: i18n.language === 'es' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px' }}
          >
            🇲🇽 ES
          </button>
          <span style={{ color: '#ccc' }}>|</span>
          <button 
            onClick={() => cambiarIdioma('en')} 
            style={{ fontWeight: i18n.language === 'en' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px' }}
          >
            🇺🇸 EN
          </button>
          <span style={{ color: '#ccc' }}>|</span>
          <button 
            onClick={() => cambiarIdioma('ja')} 
            style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', cursor: 'pointer', background: 'none', border: 'none', color: tema.textoPrincipal, fontSize: '14px' }}
          >
            🇯🇵 JA
          </button>

          <span style={{ color: '#ccc' }}>|</span>

          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            aria-label="Cambiar tema"
            style={{ background: tema.bgBotónTema, border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px' }}
          >
            <img src={modoOscuro ? iconoSol : iconoLuna} alt="Tema" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
          </button>

          <span style={{ color: '#ccc' }}>|</span>

          <button style={{ background: 'none', border: 'none', color: tema.textoPrincipal, cursor: 'pointer', fontSize: '14px' }} onClick={manejarCierreSesion}>
            {t('salir')}
          </button>
        </div>
      </header>

      {/* PANEL PRINCIPAL */}
      <main style={{ padding: '40px' }}>
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

        {/* BUSCADOR Y FILTROS CORREGIDOS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' }}>
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

          <button onClick={abrirModalAgregar} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: modoOscuro ? '#2d4a30' : '#1e4620', color: modoOscuro ? '#aedcae' : 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            {t('agregar_producto')}
          </button>
        </div>

        {/* TABLA PRINCIPAL */}
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
                <tr key={producto.id_producto || index} style={{ borderBottom: `1px solid ${tema.borde}` }}>
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
                    <button onClick={() => abrirModalEditar(producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px', color: modoOscuro ? '#6ba4e8' : '#0066cc' }}>{t('editar')}✏️</button>
                    <button onClick={() => manejarEliminar(producto.id_producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: tema.metricaCritico }}>{t('eliminar')}🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE AGREGAR / EDITAR PRODUCTO */}
      {(modalAgregarOpen || modalEditarOpen) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: modoOscuro ? 'rgba(0, 0, 0, 0.7)' : 'rgba(19, 44, 21, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: tema.bgTarjeta, padding: '35px', borderRadius: '20px', width: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative', border: `1px solid ${tema.borde}` }}>
            
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
                    <option value="Tierra/Abonos">{t('cat_abono')}</option>
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
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
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