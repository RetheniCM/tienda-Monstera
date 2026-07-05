import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [plantas, setPlantas] = useState([]);
  
  // Estados para el formulario del CRUD
  const [nombre, setNombre] = useState('');
  const [nombreCientifico, setNombreCientifico] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Aquí irían tus funciones useEffect, fetch para traer datos de MySQL,
  // y las funciones para manejar el POST, PUT y DELETE en tu backend...

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#fbfaf7', padding: '40px 60px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* SELECTOR DE IDIOMAS */}
      <div style={{ position: 'absolute', top: '20px', right: '60px', display: 'flex', gap: '12px' }}>
        <button onClick={() => i18n.changeLanguage('es')} style={{ fontWeight: i18n.language === 'es' ? '700' : '400', border: 'none', background: 'none', cursor: 'pointer' }}>🇲🇽 ES</button>
        <span>|</span>
        <button onClick={() => i18n.changeLanguage('en')} style={{ fontWeight: i18n.language === 'en' ? '700' : '400', border: 'none', background: 'none', cursor: 'pointer' }}>🇺🇸 EN</button>
        <span>|</span>
        <button onClick={() => i18n.changeLanguage('ja')} style={{ fontWeight: i18n.language === 'ja' ? '700' : '400', border: 'none', background: 'none', cursor: 'pointer' }}>🇯🇵 JA</button>
      </div>

      <h1 style={{ color: '#19381f', marginBottom: '30px' }}>{t('panel_admin')}</h1>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* FORMULARIO PARA AGREGAR / EDITAR */}
        <form style={{ flex: '0 0 350px', background: '#eae5dd', padding: '25px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px', height: 'fit-content' }}>
          <h3>{t('nueva_planta')}</h3>
          
          <label>{t('nombre_planta')}</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />

          <label>{t('nombre_cientifico')}</label>
          <input type="text" value={nombreCientifico} onChange={(e) => setNombreCientifico(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />

          <label>{t('precio')}</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />

          <label>{t('stock')}</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />

          <button type="submit" style={{ backgroundColor: '#19381f', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {t('boton_guardar')}
          </button>
        </form>

        {/* TABLA DEL CRUD */}
        <div style={{ flex: 1, background: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eae5dd', color: '#8b5a42' }}>
                <th style={{ padding: '12px' }}>{t('nombre_planta')}</th>
                <th style={{ padding: '12px' }}>{t('precio')}</th>
                <th style={{ padding: '12px' }}>{t('stock')}</th>
                <th style={{ padding: '12px' }}>{t('acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí mapearás las plantas de tu BD con plantas.map() */}
              {plantas.map((planta) => (
                <tr key={planta.id} style={{ borderBottom: '1px solid #eae5dd' }}>
                  <td style={{ padding: '12px' }}>{planta.nombre}</td>
                  <td style={{ padding: '12px' }}>${planta.precio}</td>
                  <td style={{ padding: '12px' }}>{planta.stock}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                    <button style={{ backgroundColor: '#8b5a42', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>{t('boton_editar')}</button>
                    <button style={{ backgroundColor: '#d93025', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>{t('boton_eliminar')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;