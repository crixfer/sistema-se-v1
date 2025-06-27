#!/bin/bash

# Sistema SE v1 - Quick Setup Script
# Este script automatiza la configuración inicial del proyecto

echo "🚀 Sistema SE v1 - Quick Setup"
echo "================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar Angular CLI
if ! command -v ng &> /dev/null; then
    echo "📦 Instalando Angular CLI..."
    npm install -g @angular/cli
fi

echo "✅ Angular CLI encontrado: $(ng version --version)"

# Instalar dependencias
echo "📦 Instalando dependencias del proyecto..."
npm install

# Verificar instalación
if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Crear archivo de entorno si no existe
if [ ! -f "src/environments/environment.ts" ]; then
    echo "📝 Creando archivo de configuración de entorno..."
    cat > src/environments/environment.ts << EOL
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL_AQUI',
  supabaseKey: 'TU_SUPABASE_ANON_KEY_AQUI',
};
EOL
    echo "⚠️  IMPORTANTE: Actualiza las credenciales de Supabase en src/environments/environment.ts"
fi

# Mostrar comandos útiles
echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Comandos disponibles:"
echo "  npm run start      - Servidor de desarrollo"
echo "  npm run build:prod - Construcción de producción"
echo "  npm run test       - Ejecutar pruebas"
echo ""
echo "🔧 Próximos pasos:"
echo "  1. Configura Supabase en src/environments/environment.ts"
echo "  2. Ejecuta: npm run start"
echo "  3. Visita: http://localhost:4200"
echo ""
echo "📖 Documentación completa en README.md y OPTIMIZATION.md"
