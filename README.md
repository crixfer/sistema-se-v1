# Sistema SE v1 - Sistema de Seguimiento Empresarial

Un sistema administrativo moderno construido con Angular 17 y Supabase para la gestión de solicitudes empresariales.

## 🚀 Características

- **Dashboard** interactivo con métricas en tiempo real
- **Gestión de Solicitudes** con diferentes estados y seguimiento
- **Sistema de Usuarios** con roles y permisos
- **Reportes** y análisis de datos
- **Interfaz Moderna** con Tailwind CSS
- **Base de Datos** Supabase con autenticación

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/en/) (versión 18 o superior)
- [Angular CLI](https://angular.io/cli) (versión 17)
- Cuenta de [Supabase](https://supabase.com/)

## 🛠️ Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/crixfer/sistema-se-v1.git
cd sistema-se-v1
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
   - Copia `src/environments/environment.ts.example` a `src/environments/environment.ts`
   - Actualiza las credenciales de Supabase

4. **Configura la base de datos:**
```bash
# Revisa las migraciones en supabase/migrations/
# Ejecuta las migraciones en tu proyecto de Supabase
```

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm run start         # Servidor de desarrollo (http://localhost:4200)
npm run dev          # Alias para start
npm run watch        # Construcción en modo watch
```

### Producción
```bash
npm run build:prod   # Construcción optimizada para producción
npm run serve:prod   # Servidor con configuración de producción
```

### Testing
```bash
npm run test         # Ejecutar pruebas unitarias
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/               # Servicios centrales, guards, modelos
│   │   ├── guards/         # Guards de autenticación y roles
│   │   ├── models/         # Interfaces y tipos TypeScript
│   │   └── services/       # Servicios de negocio
│   ├── pages/              # Páginas principales
│   │   ├── dashboard/      # Panel principal
│   │   ├── login/          # Autenticación
│   │   ├── solicitudes/    # Gestión de solicitudes
│   │   ├── reportes/       # Reportes y análisis
│   │   └── usuarios/       # Administración de usuarios
│   └── shared/             # Componentes compartidos
│       ├── components/     # Componentes reutilizables
│       └── services/       # Servicios utilitarios
├── environments/          # Configuraciones de entorno
└── styles.scss           # Estilos globales
```

## 🌐 Despliegue

### Netlify / Vercel
```bash
npm run build:prod
# Sube la carpeta dist/ al servicio de hosting
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/sistema-se-v1 /usr/share/nginx/html
```

## 🔧 Configuración de Supabase

1. **Crea un nuevo proyecto** en Supabase
2. **Ejecuta las migraciones** de `supabase/migrations/`
3. **Configura las políticas RLS** (Row Level Security)
4. **Actualiza las variables** en `environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY',
};
```

## 🎨 Personalización

### Temas y Estilos
- Los estilos están en `src/styles.scss`
- Configuración de Tailwind en `tailwind.config.js`
- Componentes con clases utilitarias de Tailwind

### Agregar Nuevas Páginas
1. Generar componente: `ng generate component pages/nueva-pagina`
2. Agregar ruta en `app.routes.ts`
3. Actualizar navegación en `sidebar.component.ts`

## 🐛 Solución de Problemas

### Error de Cache
```bash
ng cache clean
rm -rf node_modules package-lock.json
npm install
```

### Problemas de Build
```bash
npm run build:prod -- --verbose
# Revisa los errores específicos
```

### Base de Datos
- Verifica las credenciales de Supabase
- Confirma que las tablas existen
- Revisa las políticas RLS

## 📄 Documentación Adicional

- [OPTIMIZATION.md](./OPTIMIZATION.md) - Guía de optimización
- [setup-database.md](./setup-database.md) - Configuración de base de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico:
- 📧 Email: soporte@sistema-se.com
- 🐛 Issues: [GitHub Issues](https://github.com/crixfer/sistema-se-v1/issues)
- 📖 Wiki: [Documentación completa](https://github.com/crixfer/sistema-se-v1/wiki)
