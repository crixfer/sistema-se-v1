/*
  # Sistema de Autenticación y Roles

  1. Nuevas Tablas
    - `perfiles` - Perfiles de usuario con roles y permisos
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `nombre_completo` (text)
      - `rol` (text) - administrador, supervisor, operador, consultor
      - `activo` (boolean)
      - `permisos` (jsonb) - Permisos específicos
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sesiones_usuario` - Registro de sesiones
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, references perfiles)
      - `fecha_inicio` (timestamptz)
      - `fecha_fin` (timestamptz)
      - `ip_address` (text)
      - `user_agent` (text)

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas basadas en roles
    - Función para verificar permisos

  3. Roles del Sistema
    - Administrador: Acceso completo
    - Supervisor: Gestión de solicitudes y reportes
    - Operador: Registro y seguimiento de solicitudes
    - Consultor: Solo lectura de reportes
*/

-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nombre_completo text NOT NULL,
  rol text NOT NULL DEFAULT 'operador' CHECK (rol IN ('administrador', 'supervisor', 'operador', 'consultor')),
  activo boolean DEFAULT true,
  permisos jsonb DEFAULT '{
    "dashboard": {"leer": true},
    "solicitudes": {"leer": true, "crear": false, "editar": false, "eliminar": false},
    "reportes": {"leer": false, "exportar": false},
    "usuarios": {"leer": false, "crear": false, "editar": false, "eliminar": false},
    "configuracion": {"leer": false, "editar": false}
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS sesiones_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES perfiles(id) ON DELETE CASCADE,
  fecha_inicio timestamptz DEFAULT now(),
  fecha_fin timestamptz,
  ip_address text,
  user_agent text,
  activa boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION crear_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, email, nombre_completo, rol, permisos)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'operador'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'rol', 'operador') = 'administrador' THEN
        '{
          "dashboard": {"leer": true},
          "solicitudes": {"leer": true, "crear": true, "editar": true, "eliminar": true},
          "reportes": {"leer": true, "exportar": true},
          "usuarios": {"leer": true, "crear": true, "editar": true, "eliminar": true},
          "configuracion": {"leer": true, "editar": true}
        }'::jsonb
      WHEN COALESCE(NEW.raw_user_meta_data->>'rol', 'operador') = 'supervisor' THEN
        '{
          "dashboard": {"leer": true},
          "solicitudes": {"leer": true, "crear": true, "editar": true, "eliminar": false},
          "reportes": {"leer": true, "exportar": true},
          "usuarios": {"leer": true, "crear": false, "editar": false, "eliminar": false},
          "configuracion": {"leer": false, "editar": false}
        }'::jsonb
      WHEN COALESCE(NEW.raw_user_meta_data->>'rol', 'operador') = 'operador' THEN
        '{
          "dashboard": {"leer": true},
          "solicitudes": {"leer": true, "crear": true, "editar": true, "eliminar": false},
          "reportes": {"leer": false, "exportar": false},
          "usuarios": {"leer": false, "crear": false, "editar": false, "eliminar": false},
          "configuracion": {"leer": false, "editar": false}
        }'::jsonb
      ELSE
        '{
          "dashboard": {"leer": true},
          "solicitudes": {"leer": true, "crear": false, "editar": false, "eliminar": false},
          "reportes": {"leer": true, "exportar": false},
          "usuarios": {"leer": false, "crear": false, "editar": false, "eliminar": false},
          "configuracion": {"leer": false, "editar": false}
        }'::jsonb
    END
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE TRIGGER crear_perfil_usuario_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION crear_perfil_usuario();

-- Función para verificar permisos
CREATE OR REPLACE FUNCTION verificar_permiso(usuario_id uuid, modulo text, accion text)
RETURNS boolean AS $$
DECLARE
  usuario_permisos jsonb;
  usuario_activo boolean;
BEGIN
  SELECT permisos, activo INTO usuario_permisos, usuario_activo
  FROM perfiles 
  WHERE id = usuario_id;
  
  IF NOT usuario_activo THEN
    RETURN false;
  END IF;
  
  RETURN COALESCE((usuario_permisos->modulo->>accion)::boolean, false);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Función para obtener rol del usuario
CREATE OR REPLACE FUNCTION obtener_rol_usuario(usuario_id uuid)
RETURNS text AS $$
DECLARE
  usuario_rol text;
BEGIN
  SELECT rol INTO usuario_rol
  FROM perfiles 
  WHERE id = usuario_id AND activo = true;
  
  RETURN COALESCE(usuario_rol, 'consultor');
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Crear trigger para updated_at en perfiles
CREATE TRIGGER update_perfiles_updated_at 
  BEFORE UPDATE ON perfiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON perfiles(email);
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON perfiles(rol);
CREATE INDEX IF NOT EXISTS idx_perfiles_activo ON perfiles(activo);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_usuario_id ON sesiones_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_activa ON sesiones_usuario(activa);

-- Habilitar RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON perfiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los perfiles"
  ON perfiles
  FOR SELECT
  TO authenticated
  USING (obtener_rol_usuario(auth.uid()) = 'administrador');

CREATE POLICY "Los administradores pueden actualizar perfiles"
  ON perfiles
  FOR UPDATE
  TO authenticated
  USING (obtener_rol_usuario(auth.uid()) = 'administrador');

CREATE POLICY "Los administradores pueden crear perfiles"
  ON perfiles
  FOR INSERT
  TO authenticated
  WITH CHECK (obtener_rol_usuario(auth.uid()) = 'administrador');

-- Políticas para sesiones
CREATE POLICY "Los usuarios pueden ver sus propias sesiones"
  ON sesiones_usuario
  FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

CREATE POLICY "Los administradores pueden ver todas las sesiones"
  ON sesiones_usuario
  FOR SELECT
  TO authenticated
  USING (obtener_rol_usuario(auth.uid()) = 'administrador');

CREATE POLICY "Los usuarios pueden crear sus propias sesiones"
  ON sesiones_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- Actualizar políticas de solicitudes para usar roles
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver todas las solicitudes" ON solicitudes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear solicitudes" ON solicitudes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar solicitudes" ON solicitudes;

CREATE POLICY "Usuarios pueden ver solicitudes según permisos"
  ON solicitudes
  FOR SELECT
  TO authenticated
  USING (verificar_permiso(auth.uid(), 'solicitudes', 'leer'));

CREATE POLICY "Usuarios pueden crear solicitudes según permisos"
  ON solicitudes
  FOR INSERT
  TO authenticated
  WITH CHECK (verificar_permiso(auth.uid(), 'solicitudes', 'crear'));

CREATE POLICY "Usuarios pueden actualizar solicitudes según permisos"
  ON solicitudes
  FOR UPDATE
  TO authenticated
  USING (verificar_permiso(auth.uid(), 'solicitudes', 'editar'));

CREATE POLICY "Usuarios pueden eliminar solicitudes según permisos"
  ON solicitudes
  FOR DELETE
  TO authenticated
  USING (verificar_permiso(auth.uid(), 'solicitudes', 'eliminar'));

-- Crear usuario administrador por defecto (se debe cambiar la contraseña)
-- Nota: Esto se debe hacer manualmente en Supabase Auth Dashboard