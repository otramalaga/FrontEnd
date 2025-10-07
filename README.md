# 🌿 Otra Málaga

Otra Málaga es una plataforma de mapeo colaborativo que permite descubrir, documentar y compartir marcadores ciudadanos, espacios colectivos y prácticas sociales transformadoras en la ciudad de Málaga. La aplicación conecta a los usuarios con iniciativas comunitarias que representan la verdadera esencia de la ciudad desde una perspectiva ciudadana y participativa.

## 🌟 Características Principales

### 🗺️ Exploración Interactiva
- **Mapa colaborativo** con marcadores geolocalizados
- **Búsqueda avanzada** por ubicación y términos específicos
- **Filtrado dinámico** por categorías y etiquetas
- **Vista previa** de marcadores sin necesidad de registro

### 📍 Gestión de Marcadores
- **Creación de marcadores** con geolocalización precisa
- **Categorización** por tipos de iniciativas (Conflictos, Propuestas, Iniciativas)
- **Etiquetado** temático (Medio Ambiente, Feminismos, Servicios Públicos, etc.)
- **Subida de imágenes** y descripciones detalladas
- **Edición y eliminación** de marcadores propios

### 👥 Experiencia de Usuario
- **Sistema de autenticación** seguro con JWT
- **Interfaz responsive** optimizada para todos los dispositivos
- **Tema personalizado** "caramellatte" con DaisyUI
- **Navegación intuitiva** con React Router
- **Caché inteligente** para mejor rendimiento

## 🛠 Stack Tecnológico

### Frontend
- **React 19.1.0** + **Vite 6.3.5** - Framework y bundler
- **React Router DOM 6.30.1** - Navegación SPA
- **React Leaflet 5.0.0** + **Leaflet 1.9.4** - Mapas interactivos
- **Tailwind CSS 4.1.12** + **DaisyUI 5.0.37** - Estilos y componentes
- **Cloudinary** - Gestión de imágenes
- **React Hook Form 7.56.4** - Manejo de formularios
- **JWT Decode 4.0.0** - Autenticación
- **Axios 1.10.0** - Cliente HTTP

### Backend
- **Spring Boot** - Framework Java
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación y autorización
- **API RESTful** - Comunicación frontend-backend

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** o **yarn**

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/otramalaga/FrontEnd.git
cd FrontEnd
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=https://backend-prod-towy.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
```

4. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 📁 Estructura del Proyecto

```
FrontEnd/
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, iconos)
│   ├── components/          # Componentes reutilizables
│   │   ├── Alert/          # Componentes de alertas
│   │   ├── BookmarkMap/    # Componentes relacionados con mapas
│   │   ├── Buttons/        # Botones personalizados
│   │   ├── Cards/          # Tarjetas de marcadores
│   │   ├── DropDown/       # Menús desplegables
│   │   ├── Forms/          # Formularios (añadir, editar, eliminar)
│   │   ├── Header/         # Cabeceras de navegación
│   │   ├── ImageUpload/    # Subida de imágenes
│   │   ├── Layout/         # Layouts de la aplicación
│   │   ├── LocationAutocomplete/ # Autocompletado de ubicaciones
│   │   ├── MapInteractive/ # Componentes del mapa interactivo
│   │   └── VideoUpload/    # Subida de videos
│   ├── config/             # Configuraciones
│   │   ├── apiConfig.js    # Configuración de la API
│   │   ├── categoryIcons.js # Iconos y colores de categorías
│   │   └── router/         # Configuración de rutas
│   ├── constants/          # Constantes de la aplicación
│   ├── context/            # Contextos de React (AuthContext)
│   ├── hooks/              # Hooks personalizados
│   ├── pages/              # Páginas de la aplicación
│   │   ├── AddBookmark/    # Añadir nuevo marcador
│   │   ├── BookmarkDetails/ # Detalles de marcador
│   │   ├── EditBookmark/   # Editar marcador
│   │   ├── HomePage/       # Página principal (privada)
│   │   ├── LandingPage/    # Página de bienvenida
│   │   ├── Login/          # Inicio de sesión
│   │   ├── MapView/        # Vista del mapa
│   │   ├── MyBookmark/     # Mis marcadores
│   │   └── Register/       # Registro de usuario
│   ├── service/            # Servicios y API
│   ├── styles/             # Estilos personalizados
│   └── utils/              # Utilidades y helpers
├── test/                   # Tests unitarios
├── public/                 # Archivos públicos
└── dist/                   # Build de producción
```

## 🎯 Funcionalidades Detalladas

### Categorías de Marcadores
- **Conflictos** - Problemas urbanos y sociales
- **Propuestas** - Soluciones y alternativas
- **Iniciativas** - Proyectos en marcha

### Etiquetas Temáticas
- Medio Ambiente
- Feminismos
- Servicios Públicos
- Vivienda
- Urbanismo
- Movilidad
- Cultura
- Economía y empleo
- Deporte
- Memoria democrática

### Características del Mapa
- **Centro por defecto**: Málaga (36.7213, -4.4214)
- **Zoom inicial**: 13
- **Tiles**: CartoDB Voyager
- **Marcadores personalizados** con iconos por categoría
- **Búsqueda de ubicaciones** con autocompletado
- **Filtros dinámicos** en tiempo real

## 🌐 Despliegue

### Frontend (Netlify)
1. Conectar con repositorio de GitHub
2. Configurar variables de entorno de producción
3. Build command: `npm run build`
4. Publish directory: `dist`

### Backend (Railway)
1. Configurar base de datos PostgreSQL
2. Establecer variables de entorno del backend
3. Conectar con repositorio de GitHub

## 🔧 Configuración Avanzada

### Tema Personalizado
La aplicación utiliza un tema personalizado "caramellatte" configurado en `tailwind.config.js` con colores OKLCH para mejor consistencia visual.

### Caché de Datos
Sistema de caché inteligente con expiración de 5 minutos para:
- Marcadores
- Categorías
- Etiquetas
- Datos de usuario

### Autenticación
- Tokens JWT almacenados en localStorage
- Decodificación automática de tokens
- Headers de autorización automáticos
- Protección de rutas privadas

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit de cambios (`git commit -m 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [DaisyUI](https://daisyui.com/) por los componentes de UI
- [Leaflet](https://leafletjs.com/) por la integración de mapas
- [Cloudinary](https://cloudinary.com/) por el manejo de imágenes
- [Railway](https://railway.app/) por el hosting del backend
- [Netlify](https://www.netlify.com/) por el hosting del frontend
- [CartoDB](https://carto.com/) por los tiles de mapas
- [FontAwesome](https://fontawesome.com/) por los iconos

---

**Otra Málaga** - Construyendo juntas una ciudad más justa, inclusiva y descentralizada 🏙️✨