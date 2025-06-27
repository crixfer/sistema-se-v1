@echo off
:: Sistema SE v1 - Quick Setup Script for Windows
:: Este script automatiza la configuración inicial del proyecto

echo 🚀 Sistema SE v1 - Quick Setup
echo ================================

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

:: Verificar Angular CLI
ng version --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando Angular CLI...
    npm install -g @angular/cli
)

echo ✅ Angular CLI disponible

:: Instalar dependencias
echo 📦 Instalando dependencias del proyecto...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente

:: Crear archivo de entorno si no existe
if not exist "src\environments\environment.ts" (
    echo 📝 Creando archivo de configuración de entorno...
    (
        echo export const environment = {
        echo   production: false,
        echo   supabaseUrl: 'TU_SUPABASE_URL_AQUI',
        echo   supabaseKey: 'TU_SUPABASE_ANON_KEY_AQUI',
        echo };
    ) > src\environments\environment.ts
    echo ⚠️  IMPORTANTE: Actualiza las credenciales de Supabase en src\environments\environment.ts
)

:: Mostrar comandos útiles
echo.
echo 🎉 ¡Configuración completada!
echo.
echo 📋 Comandos disponibles:
echo   npm run start      - Servidor de desarrollo
echo   npm run build:prod - Construcción de producción
echo   npm run test       - Ejecutar pruebas
echo.
echo 🔧 Próximos pasos:
echo   1. Configura Supabase en src\environments\environment.ts
echo   2. Ejecuta: npm run start
echo   3. Visita: http://localhost:4200
echo.
echo 📖 Documentación completa en README.md y OPTIMIZATION.md

pause
