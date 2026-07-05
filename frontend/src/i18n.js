import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "titulo": "Catálogo de Plantas",
      "buscar": "Buscar planta por nombre...",
      "carrito": "Carrito",
      "filtros": "Filtros de Búsqueda",
      "tipo": "Tipo de Planta",
      "riego": "Nivel de Riego",
      "iluminacion": "Iluminación",
      "cargando": "Cargando tus plantas...",
      "no_encontrado": "No se encontraron plantas con los filtros seleccionados.",
      "interior": "Interior",
      "exterior": "Exterior",
      "bajo": "Bajo",
      "moderado": "Moderado",
      "frecuente": "Frecuente",
      "sol_directo": "Sol Directo",
      "luz_indirecta": "Luz Indirecta",
      "sombra": "Sombra",
      "agregar_carrito": "+ Carrito",
      "agotado": "Agotado",
      "mostrando": "Mostrando {{count}} plantas"
    }
  },
  en: {
    translation: {
      "titulo": "Plant Catalog",
      "buscar": "Search plant by name...",
      "carrito": "Cart",
      "filtros": "Search Filters",
      "tipo": "Plant Type",
      "riego": "Watering Level",
      "iluminacion": "Lighting",
      "cargando": "Loading your plants...",
      "no_encontrado": "No plants found with the selected filters.",
      "interior": "Indoor",
      "exterior": "Outdoor",
      "bajo": "Low",
      "moderado": "Moderate",
      "frecuente": "Frequent",
      "sol_directo": "Direct Sun",
      "luz_indirecta": "Indirect Light",
      "sombra": "Shade",
      "agregar_carrito": "+ Add to Cart",
      "agotado": "Out of stock",
      "mostrando": "Showing {{count}} plants"
    }
  },
  ja: {
    translation: {
      "titulo": "植物カタログ",
      "buscar": "名前で植物を検索...",
      "carrito": "買い物かご",
      "filtros": "検索フィルター",
      "tipo": "植物の種類",
      "riego": "水やりの頻度",
      "iluminacion": "日当たり",
      "cargando": "植物を読み込み中...",
      "no_encontrado": "選択したフィルターに一致する植物が見つかりませんでした。",
      "interior": "室内",
      "exterior": "屋外",
      "bajo": "控えめ",
      "moderado": "普通",
      "frecuente": "多め",
      "sol_directo": "直射日光",
      "luz_indirecta": "半日陰",
      "sombra": "日陰",
      "agregar_carrito": "+ かごに追加",
      "agotado": "売り切れ",
      "mostrando": "{{count}}個の植物を表示中"
    }
  }
}; 

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Idioma por defecto al arrancar
    interpolation: {
      escapeValue: false // React ya nos protege de ataques XSS por defecto
    }
  });

export default i18n;