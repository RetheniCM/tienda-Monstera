import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      //CATALOGO
      "titulo": "Catálogo de Plantas",
      "buscar": "Buscar planta por nombre...",
      "carro": "Carrito",
      "filtros": "Filtros de Búsqueda",
      "tipo": "Tipo de Planta",
      "riego": "Nivel de Riego",
      "iluminacion": "Iluminación",
      "cargando": "Cargando tus plantas...",
      "no_encontrado": "No se encontraron plantas con los filtros seleccionados.",
      "interior": "Interior",
      "abono" :"Abono",
      "exterior": "Exterior",
      "bajo": "Bajo",
      "moderado": "Moderado",
      "frecuente": "Frecuente",
      "sol_directo": "Sol Directo",
      "luz_indirecta": "Luz Indirecta",
      "sombra": "Sombra",
      "agregar_carrito": "+ Carrito",
      "agotado": "Agotado",
      "mostrando": "Mostrando {{count}} plantas",
      // LOGIN Y REGISTRO
      "saludo" : "Cultiva tu mundo",
      "iniciar_sesion": "Iniciar Sesión",
      "registrarse": "Registrarse",
      "correo": "Correo Electrónico",
      "contrasena": "Contraseña",
      "confirmar_contrasena": "Confirmar Contraseña",
      "nombre_usuario": "Nombre de Usuario",
      "boton_ingresar": "Ingresar",
      "boton_crear": "Registrar",
      "crear" : "Crear Cuenta",
      "men_bienvenida" : "Únete a nuestro vivero",
      "pregunta_registro": "¿No tienes cuenta? ",
      "registro" : "Registrate Aquí",
      "pregunta_login": "¿Ya tienes cuenta?",
      "Iniciar" : "Inicia sesión aquí",

      //PLACEHOLDERS
      "nombre_aqui" : "Tu nombre completo",
      "correo_aqui" : "tu@correo.com",
      "men_cont" : "Minimo 6 caracteres",


      // ... anteriores ...
      "monstera_admin": "Monstera Admin",
      "salir": "Salir",
      "panel_control": "Panel de Control",
      "subtitulo_vivero": "Gestión de inventario del vivero",
      
      // MÁTRICAS CARD
      "card_productos": "PRODUCTOS",
      "card_registrados": "registrados",
      "card_unidades": "UNIDADES EN STOCK",
      "card_disponibles": "disponibles",
      "card_valor": "VALOR DEL INVENTARIO",
      "card_total": "valor total",
      "card_stock_bajo": "STOCK BAJO",
      "card_criticos": "productos críticos",
      
      // CONTROLES Y BUSCADOR
      "placeholder_buscar_dashboard": "Buscar por nombre o especie...",
      "btn_categorias": "Categorías",
      "btn_tabla": "Tabla",
      "btn_tarjetas": "Tarjetas",
      "btn_agregar_producto": "+ Agregar Producto",
      
      // COLUMNAS TABLA
      "col_id": "ID",
      "col_producto": "PRODUCTO",
      "col_categoria": "CATEGORÍA",
      "col_precio": "PRECIO",
      "col_stock": "STOCK",
      "col_acciones": "ACCIONES",
      "uds": "uds.",
      
      // CATEGORÍAS ADICIONALES DEL CRUD
      "herramientas": "Herramientas",
      "tierra_abonos": "Tierra/Abonos",
      "Salir" : "Salir",
      "agotado": "Agotado",
      "carrito": "+ Carrito",

      //DASHBOARD
      "panel_control": "Panel de Control",
      "gestion_inventario": "Gestión de inventario del vivero",
      "productos": "Productos",
      "registrados": "registrados",
      "unidades_stock": "Unidades en stock",
      "disponibles": "disponibles",
      "valor_inventario": "Valor del inventario",
      "valor_total": "valor total",
      "stock_bajo": "Stock Bajo",
      "productos_criticos": "productos críticos",
      "buscar_placeholder": "Buscar por nombre o especie...",
      "categorias": "Categorías",
      "todas": "Todas",
      "agregar_producto": "Agregar Producto",
      "id": "ID",
      "producto": "Producto",
      "categoria": "Categoría",
      "precio": "Precio",
      "stock": "Stock",
      "acciones": "Acciones",
      "critico": "Crítico",
      "editar": "Editar",
      "eliminar": "Eliminar",

      //VENTANA DASHBOARD
      "cat_interior": "Interior",
      "cat_exterior": "Exterior",
      "cat_herramientas": "Herramientas",
      "cat_abono": "Abono",
      "lbl_nombre_comun": "Nombre común",
      "lbl_nombre_cientifico": "Nombre científico",
      "lbl_precio": "Precio (MXN)",
      "lbl_url_imagen": "URL de imagen",
      "lbl_nivel_riego": "Nivel de riego",
      "lbl_nivel_luz": "Nivel de luz",
      "riego_bajo": "Bajo",
      "riego_moderado": "Moderado",
      "riego_frecuente": "Frecuente",
      "luz_sombra": "Sombra",
      "luz_indirecta": "Luz Indirecta",
      "luz_directo": "Sol Directo",
      "btn_cancelar": "Cancelar",
      "btn_guardar": "Guardar cambios",
      "titulo_agregar": "Agregar Nuevo Producto",
      "titulo_editar": "Editar Producto"
    }
  },

  en: {
    translation: {
      //CATALOGO
      "titulo": "Plant Catalog",
      "buscar": "Search plant by name...",
      "carro": "Cart",
      "filtros": "Search Filters",
      "tipo": "Plant Type",
      "riego": "Watering Level",
      "iluminacion": "Lighting",
      "cargando": "Loading your plants...",
      "no_encontrado": "No plants found with the selected filters.",
      "interior": "Indoor",
      "abono" :"Fertilizer",
      "exterior": "Outdoor",
      "bajo": "Low",
      "moderado": "Moderate",
      "frecuente": "Frequent",
      "sol_directo": "Direct Sun",
      "luz_indirecta": "Indirect Light",
      "sombra": "Shade",
      "agregar_carrito": "+ Add to Cart",
      "agotado": "Out of stock",
      "mostrando": "Showing {{count}} plants",
      //LOGIN Y REGISTRO
      "saludo" : "Cultivate your world",
      "iniciar_sesion": "Sign In",
      "registrarse": "Sign Up",
      "correo": "Email Address",
      "contrasena": "Password",
      "confirmar_contrasena": "Confirm Password",
      "nombre_usuario": "Username",
      "boton_ingresar": "Login",
      "boton_crear": "Create Account",
      "crear" : "Create Account",
      "men_bienvenida" : "Join our nursery",
      "pregunta_registro": "Don't have an account?",
      "registro" : "Register here",
      "pregunta_login": "Already have an account? ",
      "Iniciar" : "Sign in",

      //PLACEHOLDERS
      "nombre_aqui" : "Your full name",
      "correo_aqui" : "your@email.com",
      "men_cont" : "Minimum of 6 characters",


      // ... anteriores ...
      "monstera_admin": "Monstera Admin",
      "salir": "Log Out",
      "panel_control": "Dashboard",
      "subtitulo_vivero": "Nursery inventory management",
      
      // MÁTRICAS CARD
      "card_productos": "PRODUCTS",
      "card_registrados": "registered",
      "card_unidades": "UNIDADES IN STOCK",
      "card_disponibles": "available",
      "card_valor": "INVENTORY VALUE",
      "card_total": "total value",
      "card_stock_bajo": "LOW STOCK",
      "card_criticos": "critical items",
      
      // CONTROLES Y BUSCADOR
      "placeholder_buscar_dashboard": "Search by name or species...",
      "btn_categorias": "Categories",
      "btn_tabla": "Table",
      "btn_tarjetas": "Cards",
      "btn_agregar_producto": "+ Add Product",
      
      // COLUMNAS TABLA
      "col_id": "ID",
      "col_producto": "PRODUCTO",
      "col_categoria": "CATEGORY",
      "col_precio": "PRICE",
      "col_stock": "STOCK",
      "col_acciones": "ACTIONS",
      "uds": "units",
      
      // CATEGORÍAS ADICIONALES DEL CRUD
      "herramientas": "Tools",
      "tierra_abonos": "Soil/Fertilizer",
      "Salir" : "Log Out",
      "agotado": "Out of stock",
      "carrito": "+ Cart",

      //DASHBOARD 
      "panel_control": "Control Panel",
      "gestion_inventario": "Nursery inventory management",
      "productos": "Products",
      "registrados": "registered",
      "unidades_stock": "Units in stock",
      "disponibles": "available",
      "valor_inventario": "Inventory value",
      "valor_total": "total value",
      "stock_bajo": "Low Stock",
      "productos_criticos": "critical products",
      "buscar_placeholder": "Search by name or species...",
      "categorias": "Categories",
      "todas": "All",
      "agregar_producto": "Add Product",
      "id": "ID",
      "producto": "Product",
      "categoria": "Category",
      "precio": "Price",
      "stock": "Stock",
      "acciones": "Actions",
      "critico": "Critical",
      "editar": "Edit",
      "eliminar": "Delete",

      //VENTANA DASHBOARD
      "cat_interior": "Indoor",
      "cat_exterior": "Outdoor",
      "cat_herramientas": "Tools",
      "cat_abono": "Fertilizer",
      "lbl_nombre_comun": "Common name",
      "lbl_nombre_cientifico": "Scientific name",
      "lbl_precio": "Price (MXN)",
      "lbl_url_imagen": "Image URL",
      "lbl_nivel_riego": "Watering level",
      "lbl_nivel_luz": "Light level",
      "riego_bajo": "Low",
      "riego_moderado": "Moderate",
      "riego_frecuente": "Frequent",
      "luz_sombra": "Shade",
      "luz_indirecta": "Indirect Light",
      "luz_directo": "Direct Sun",
      "btn_cancelar": "Cancel",
      "btn_guardar": "Save changes",
      "titulo_agregar": "Add New Product",
      "titulo_editar": "Edit Product"
    }
  },

  ja: {
    translation: {
      //CATALOGO
      "titulo": "植物カタログ",
      "buscar": "名前で植物を検索...",
      "carro": "買い物かご",
      "filtros": "検索フィルター",
      "tipo": "植物の種類",
      "riego": "水やりの頻度",
      "iluminacion": "日当たり",
      "cargando": "植物を読み込み中...",
      "no_encontrado": "選択したフィルターに一致する植物が見つかりませんでした。",
      "interior": "室内",
      "abono" :"肥料",
      "exterior": "屋外",
      "bajo": "控えめ",
      "moderado": "普通",
      "frecuente": "多め",
      "sol_directo": "直射日光",
      "luz_indirecta": "半日陰",
      "sombra": "日陰",
      "agregar_carrito": "+ かごに追加",
      "agotado": "売り切れ",
      "mostrando": "{{count}}個の植物を表示中",
      //LOGIN Y REGISTRO
      "saludo" : "あなたの世界を育む",
      "iniciar_sesion": "ログイン",
      "registrarse": "新規登録",
      "correo": "メールアドレス",
      "contrasena": "パスワード",
      "confirmar_contrasena": "パスワード再入力",
      "nombre_usuario": "ユーザー名",
      "boton_ingresar": "ログインする",
      "boton_crear": "アカウント作成",
      "crear" : "アカウントを作成する",
      "men_bienvenida" : "当園への入園をご検討ください",
      "pregunta_registro": "アカウントをお持ちでないですか？",
      "registro": "新規登録へ",
      "pregunta_login": "既にアカウントをお持ちですか？",
      "Iniciar" : "ログインへ",

      //PLACEHOLDERS
      "nombre_aqui" : "氏名（フルネーム）",
      "correo_aqui" : "your@email.com",
      "men_cont" : "6文字以上",

      // ... anteriores ...
      "monstera_admin": "Monstera 管理",
      "salir": "ログアウト",
      "panel_control": "管理パネル",
      "subtitulo_vivero": "苗木屋の在庫管理",
      
      // MÁTRICAS CARD
      "card_productos": "製品数",
      "card_registrados": "登録済み",
      "card_unidades": "総在庫数",
      "card_disponibles": "利用可能",
      "card_valor": "在庫総資産",
      "card_total": "総額",
      "card_stock_bajo": "在庫僅少",
      "card_criticos": "危険水準の製品",
      
      // CONTROLES Y BUSCADOR
      "placeholder_buscar_dashboard": "名前または種類で検索...",
      "btn_categorias": "カテゴリ",
      "btn_tabla": "テーブル",
      "btn_tarjetas": "カード表示",
      "btn_agregar_producto": "+ 製品を追加",
      
      // COLUMNAS TABLA
      "col_id": "ID",
      "col_producto": "製品名",
      "col_categoria": "カテゴリ",
      "col_precio": "価格",
      "col_stock": "在庫",
      "col_acciones": "操作",
      "uds": "個",
      
      // CATEGORÍAS ADICIONALES DEL CRUD
      "herramientas": "工具・道具",
      "tierra_abonos": "土・肥料",
      "Salir" : "外出",
      "agotado": "売り切れ",
      "carrito": "+ カート",

      //DASHBOARD
      "panel_control": "コントロールパネル",
      "gestion_inventario": "苗木屋の在庫管理",
      "productos": "商品数",
      "registrados": "登録済み",
      "unidades_stock": "在庫数",
      "disponibles": "利用可能",
      "valor_inventario": "在庫資産価値",
      "valor_total": "総額",
      "stock_bajo": "品薄商品",
      "productos_criticos": "危険水準",
      "buscar_placeholder": "名前または学名で検索...",
      "categorias": "カテゴリー",
      "todas": "すべて",
      "agregar_producto": "商品を追加",
      "id": "ID",
      "producto": "商品",
      "categoria": "カテゴリー",
      "precio": "価格",
      "stock": "在庫",
      "acciones": "操作",
      "critico": "危険水準",
      "editar": "編集",
      "eliminar": "削除",

      //VENTANA DASHBOARD
      "cat_interior": "室内用",
      "cat_exterior": "屋外用",
      "cat_herramientas": "道具",
      "cat_abono": "肥料",
      "lbl_nombre_comun": "一般的な名前",
      "lbl_nombre_cientifico": "学名",
      "lbl_precio": "価格 (MXN)",
      "lbl_url_imagen": "画像のURL",
      "lbl_nivel_riego": "水やりの頻度",
      "lbl_nivel_luz": "日照条件",
      "riego_bajo": "控えめ",
      "riego_moderado": "普通",
      "riego_frecuente": "多め",
      "luz_sombra": "日陰",
      "luz_indirecta": "半日陰",
      "luz_directo": "直射日光",
      "btn_cancelar": "キャンセル",
      "btn_guardar": "変更を保存",
      "titulo_agregar": "新規商品追加",
      "titulo_editar": "商品を編集"
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