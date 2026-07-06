import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logoMonstera from '../assets/log_monstera.png';

function Dashboard() {
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

  // Estados para el control de los Modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  // Estado para el producto que se está editando o agregando
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id_producto: '',
    nombre_comun: '',
    nombre_cienti: '',
    categoria: 'Interior',
    precio: 0,
    stock: 0,
    imagen: '',
    nivel_riego: 'No aplica',
    nivel_luz: 'No aplica'
  });

  // 2. CARGA DE DATOS DE LA BD
  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:5000/api/productos'); 
      const datos = await respuesta.json();
      setProductos(datos);

      // Calcular métricas reales basadas en tus columnas de la BD
      setTotalProductos(datos.length);
      setTotalStock(datos.reduce((acc, p) => acc + Number(p.stock || 0), 0));
      setValorInventario(datos.reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.stock || 0)), 0));
      setStockBajo(datos.filter(p => Number(p.stock || 0) <= 7).length); // Alerta si es menor o igual a 7 unidades
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // 3. OPERACIONES CRUD (SUBMIT)
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

  // 4. FILTRADO PARA EL BUSCADOR
    const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = 
        (p.nombre_comun || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.nombre_cienti || '').toLowerCase().includes(busqueda.toLowerCase());
        
    const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || 
        (p.categoria && p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase());

    return coincideBusqueda && coincideCategoria;
    });

  // Funciones auxiliares para abrir modales limpian o cargan el estado
  const abrirModalAgregar = () => {
    setProductoSeleccionado({
      nombre_comun: '',
      nombre_cienti: '',
      categoria: 'Interior',
      precio: 0,
      stock: 0,
      imagen: '',
      nivel_riego: 'No aplica',
      nivel_luz: 'No aplica'
    });
    setModalAgregarOpen(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditarOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER SUPERIOR */}
      <header style={{color: 'black', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoMonstera} alt="Monstera - Logotipo de la tienda de plantas" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d3b24' }} aria-hidden="true">Monstera</span>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
          <span></span> Salir
        </button>
      </header>

      {/* CONTENIDO DEL PANEL */}
      <main style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '36px', color: '#132c15', margin: '0 0 5px 0', fontFamily: 'serif', fontWeight: '700' }}>Panel de Control</h1>
        <p style={{ color: '#85735d', margin: '0 0 30px 0', fontSize: '15px' }}>Gestión de inventario del vivero</p>

        {/* CONTENEDORES DE MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eae6df' }}>
            <div style={{ fontSize: '12px', color: '#85735d', fontWeight: '600', textTransform: 'uppercase' }}>Productos</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#132c15', margin: '5px 0' }}>{totalProductos}</div>
            <div style={{ fontSize: '12px', color: '#85735d' }}>registrados</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eae6df' }}>
            <div style={{ fontSize: '12px', color: '#85735d', fontWeight: '600', textTransform: 'uppercase' }}>Unidades en stock</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2b5c31', margin: '5px 0' }}>{totalStock}</div>
            <div style={{ fontSize: '12px', color: '#85735d' }}>disponibles</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eae6df' }}>
            <div style={{ fontSize: '12px', color: '#85735d', fontWeight: '600', textTransform: 'uppercase' }}>Valor del inventario</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#805333', margin: '5px 0' }}>${valorInventario.toLocaleString('es-MX')} MXN</div>
            <div style={{ fontSize: '12px', color: '#85735d' }}>valor total</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eae6df' }}>
            <div style={{ fontSize: '12px', color: '#85735d', fontWeight: '600', textTransform: 'uppercase' }}>Stock Bajo</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#b83b1d', margin: '5px 0' }}>{stockBajo}</div>
            <div style={{ fontSize: '12px', color: '#85735d' }}>productos críticos</div>
          </div>
        </div>

        {/* ACCIONES Y FILTROS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre o especie..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', border: '1px solid #eae6df', backgroundColor: '#eae6df', opacity: 0.6 }}
          />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
                type="button"
                onClick={() => setMenuCategoriasOpen(!menuCategoriasOpen)}
                style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #1e4620', background: 'white', color: '#1e4620', cursor: 'pointer', fontWeight: '500', height: '100%', minWidth: '120px' }}
            >
                {categoriaSeleccionada === 'Todas' ? 'Categorías' : categoriaSeleccionada} ▾
            </button>

            {/* MENÚ DESPLEGABLE DINÁMICO */}
            {menuCategoriasOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '5px', backgroundColor: 'white', border: '1px solid #eae6df', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, width: '160px', overflow: 'hidden' }}>
                
                {/* Opción por defecto para limpiar el filtro */}
                <button
                    type="button"
                    onClick={() => {
                    setCategoriaSeleccionada('Todas');
                    setMenuCategoriasOpen(false);
                    }}
                    style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: categoriaSeleccionada === 'Todas' ? '#e2ece4' : 'white', color: '#132c15', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: categoriaSeleccionada === 'Todas' ? '600' : '400' }}
                >
                    Todas
                </button>

                {[...new Set(productos.map(p => p.categoria))].filter(Boolean).map((cat) => (
                    <button
                    key={cat}
                    type="button"
                    onClick={() => {
                        setCategoriaSeleccionada(cat);
                        setMenuCategoriasOpen(false);
                    }}
                    style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: categoriaSeleccionada === cat ? '#e2ece4' : 'white', color: '#132c15', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: categoriaSeleccionada === cat ? '600' : '400' }}
                    >
                    {cat}
                    </button>
                ))}

                </div>
            )}
            </div>
          <button style={{ padding: '10px 15px', borderRadius: '8px', backgroundColor: '#132c15', color: 'white', border: 'none', cursor: 'pointer' }}>Tabla</button>
          <button style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #eae6df', background: 'white', cursor: 'pointer' }}>Tarjetas</button>
          <button onClick={abrirModalAgregar} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#1e4620', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            + Agregar Producto
          </button>
        </div>

        {/* TABLA PRINCIPAL DE INVENTARIO */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eae6df', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eae6df', color: '#85735d', backgroundColor: '#faf9f5', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>Producto</th>
                <th style={{ padding: '15px' }}>Categoría</th>
                <th style={{ padding: '15px' }}>Precio</th>
                <th style={{ padding: '15px' }}>Stock</th>
                <th style={{ padding: '15px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto, index) => (
                <tr key={producto.id_producto || index} style={{ borderBottom: '1px solid #faf9f5' }}>
                  <td style={{ padding: '15px', color: '#85735d' }}>
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
                        <div style={{ fontWeight: '600', color: '#132c15' }}>{producto.nombre_comun}</div>
                        {producto.nombre_cienti && producto.nombre_cienti !== 'No aplica' && (
                          <div style={{ fontSize: '12px', color: '#85735d', fontStyle: 'italic' }}>{producto.nombre_cienti}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ backgroundColor: '#e2ece4', color: '#1e4620', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontWeight: '600', color: '#132c15' }}>
                    ${Number(producto.precio).toLocaleString('es-MX')} <span style={{ fontSize: '11px', color: '#85735d', fontWeight: '400' }}>MXN</span>
                  </td>
                  <td style={{ padding: '15px', color: producto.stock <= 7 ? '#b83b1d' : '#132c15', fontWeight: producto.stock <= 7 ? '700' : '400' }}>
                    {producto.stock} uds. {producto.stock <= 7 && '(Crítico)'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => abrirModalEditar(producto)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px' }}>✏️</button>
                    <button onClick={() => manejarEliminar(producto.id_producto)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ==================== MODAL DE AGREGAR / EDITAR PRODUCTO ==================== */}
      {(modalAgregarOpen || modalEditarOpen) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(19, 44, 21, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#faf9f5', padding: '35px', borderRadius: '20px', width: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative', border: '1px solid #eae6df' }}>
            
            <button 
              onClick={() => { setModalAgregarOpen(false); setModalEditarOpen(false); }} 
              style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#85735d' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '24px', fontFamily: 'serif', color: '#132c15', marginTop: 0, marginBottom: '25px' }}>
              {modalAgregarOpen ? 'Agregar Nuevo Producto' : 'Editar Producto'}
            </h2>

            <form onSubmit={modalAgregarOpen ? manejarAgregar : manejarEditar}>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>Nombre común</label>
                <input 
                  type="text" 
                  value={productoSeleccionado.nombre_comun}
                  placeholder="ej. Monstera Deliciosa"
                  onChange={(e) => setProductoSeleccionado({...productoSeleccionado, nombre_comun: e.target.value})}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7 }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>Nombre científico</label>
                <input 
                  type="text" 
                  value={productoSeleccionado.nombre_cienti}
                  placeholder="ej. Monstera deliciosa"
                  onChange={(e) => setProductoSeleccionado({...productoSeleccionado, nombre_cienti: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>Categoría</label>
                  <select 
                    value={productoSeleccionado.categoria}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, categoria: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7, height: '42px' }}
                  >
                    <option value="Interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Tierra/Abonos">Abono</option>
                    <option value="Macetas">Macetas</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>Precio (MXN)</label>
                  <input 
                    type="number" 
                    value={productoSeleccionado.precio}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, precio: Number(e.target.value)})}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>Stock</label>
                  <input 
                    type="number" 
                    value={productoSeleccionado.stock}
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, stock: Number(e.target.value)})}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#132c15', marginBottom: '6px' }}>URL de imagen</label>
                  <input 
                    type="text" 
                    value={productoSeleccionado.imagen}
                    placeholder="https://..."
                    onChange={(e) => setProductoSeleccionado({...productoSeleccionado, imagen: e.target.value})}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#eae6df', opacity: 0.7 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => { setModalAgregarOpen(false); setModalEditarOpen(false); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #132c15', backgroundColor: 'transparent', color: '#132c15', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#132c15', color: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                  {modalAgregarOpen ? 'Agregar producto' : 'Guardar cambios'}
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