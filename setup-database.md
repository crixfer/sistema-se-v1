# Configuración de Base de Datos Supabase

## Problema
Las tablas necesarias no existen en tu proyecto de Supabase, causando errores de "Failed to fetch".

## Solución
Necesitas ejecutar las migraciones SQL en tu proyecto de Supabase para crear las tablas requeridas.

## Pasos a seguir:

### 1. Acceder al Editor SQL de Supabase
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto `cmcjouvarrvittejgnaq`
3. En el menú lateral, haz clic en "SQL Editor"

### 2. Ejecutar las migraciones
Ejecuta los siguientes scripts SQL en orden:

#### Primera migración - Crear tablas principales:
```sql
/*
  # Sistema de Administración de Solicitudes Estudiantiles

  1. Nuevas Tablas
    - `solicitudes` - Tabla principal para registrar todas las solicitudes estudiantiles
    - `etapas_solicitud` - Etapas del proceso de cada solicitud
    - `tipos_servicio` - Catálogo de tipos de servicios

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios autenticados

  3. Índices
    - Índices para mejorar el rendimiento de consultas frecuentes
*/

-- Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text UNIQUE NOT NULL,
  estudiante_nombre text NOT NULL,
  estudiante_apellido text NOT NULL,
  estudiante_cedula text NOT NULL,
  estudiante_matricula text NOT NULL,
  estudiante_carrera text NOT NULL,
  estudiante_telefono text,
  estudiante_email text,
  tipo_servicio text NOT NULL,
  descripcion text NOT NULL,
  fecha_solicitud timestamptz DEFAULT now(),
  fecha_limite_esperada timestamptz,
  fecha_completada timestamptz,
  estado text DEFAULT 'recibida' CHECK (estado IN ('recibida', 'en_proceso', 'en_revision', 'pendiente_documentos', 'aprobada', 'completada', 'entregada', 'rechazada', 'cancelada')),
  prioridad text DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente')),
  tiempo_respuesta integer,
  observaciones text,
  documentos_requeridos jsonb DEFAULT '[]'::jsonb,
  documentos_entregados jsonb DEFAULT '[]'::jsonb,
  responsable_asignado text,
  costo_servicio decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de etapas de solicitud
CREATE TABLE IF NOT EXISTS etapas_solicitud (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id uuid REFERENCES solicitudes(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  completada boolean DEFAULT false,
  tiempo_estimado integer,
  tiempo_real integer,
  responsable text,
  comentarios text,
  orden integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de tipos de servicio
CREATE TABLE IF NOT EXISTS tipos_servicio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  tiempo_estimado integer DEFAULT 5,
  costo decimal(10,2) DEFAULT 0,
  documentos_requeridos jsonb DEFAULT '[]'::jsonb,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insertar tipos de servicio predefinidos
INSERT INTO tipos_servicio (codigo, nombre, descripcion, tiempo_estimado, costo, documentos_requeridos) VALUES
('record_notas', 'Récord de Notas', 'Documento oficial con el historial de calificaciones del estudiante', 3, 150.00, '["Cédula de identidad", "Recibo de pago"]'),
('certificado_estudios', 'Certificado de Estudios', 'Certificado que acredita los estudios realizados', 5, 200.00, '["Cédula de identidad", "Recibo de pago", "Foto 2x2"]'),
('constancia_estudiante', 'Constancia de Estudiante', 'Documento que certifica la condición de estudiante activo', 2, 100.00, '["Cédula de identidad", "Recibo de pago"]'),
('carta_presentacion', 'Carta de Presentación', 'Carta oficial de presentación del estudiante', 3, 75.00, '["Cédula de identidad", "Recibo de pago"]'),
('certificado_conducta', 'Certificado de Conducta', 'Certificado de buena conducta estudiantil', 5, 125.00, '["Cédula de identidad", "Recibo de pago", "Foto 2x2"]'),
('historial_academico', 'Historial Académico', 'Historial completo de materias cursadas', 7, 300.00, '["Cédula de identidad", "Recibo de pago", "Solicitud firmada"]'),
('titulo_bachiller', 'Título de Bachiller', 'Título oficial de bachiller', 15, 500.00, '["Cédula de identidad", "Acta de nacimiento", "Fotos 2x2", "Recibo de pago"]'),
('legalizacion_documentos', 'Legalización de Documentos', 'Legalización de documentos académicos', 10, 250.00, '["Documentos originales", "Cédula de identidad", "Recibo de pago"]'),
('cambio_carrera', 'Cambio de Carrera', 'Solicitud de cambio de carrera', 20, 1000.00, '["Cédula de identidad", "Récord de notas", "Carta de motivos", "Recibo de pago"]'),
('retiro_asignatura', 'Retiro de Asignatura', 'Solicitud de retiro de asignatura', 3, 50.00, '["Cédula de identidad", "Justificación", "Recibo de pago"]'),
('solicitud_beca', 'Solicitud de Beca', 'Solicitud de beca estudiantil', 30, 0.00, '["Cédula de identidad", "Récord de notas", "Declaración de ingresos", "Carta de motivos"]'),
('reposicion_carnet', 'Reposición de Carnet', 'Reposición de carnet estudiantil', 5, 200.00, '["Cédula de identidad", "Foto 2x2", "Recibo de pago", "Declaración jurada"]')
ON CONFLICT (codigo) DO NOTHING;

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_solicitudes_updated_at BEFORE UPDATE ON solicitudes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_etapas_solicitud_updated_at BEFORE UPDATE ON etapas_solicitud FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tipos_servicio_updated_at BEFORE UPDATE ON tipos_servicio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear función para calcular tiempo de respuesta
CREATE OR REPLACE FUNCTION calcular_tiempo_respuesta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_completada IS NOT NULL AND OLD.fecha_completada IS NULL THEN
        NEW.tiempo_respuesta = EXTRACT(DAY FROM (NEW.fecha_completada - NEW.fecha_solicitud));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para calcular tiempo de respuesta automáticamente
CREATE TRIGGER calcular_tiempo_respuesta_trigger 
    BEFORE UPDATE ON solicitudes 
    FOR EACH ROW 
    EXECUTE FUNCTION calcular_tiempo_respuesta();

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_tipo_servicio ON solicitudes(tipo_servicio);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_solicitud ON solicitudes(fecha_solicitud);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estudiante_cedula ON solicitudes(estudiante_cedula);
CREATE INDEX IF NOT EXISTS idx_solicitudes_numero ON solicitudes(numero);
CREATE INDEX IF NOT EXISTS idx_etapas_solicitud_solicitud_id ON etapas_solicitud(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_etapas_solicitud_orden ON etapas_solicitud(solicitud_id, orden);

-- Habilitar Row Level Security
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapas_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_servicio ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para solicitudes
CREATE POLICY "Usuarios autenticados pueden ver todas las solicitudes"
  ON solicitudes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear solicitudes"
  ON solicitudes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar solicitudes"
  ON solicitudes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas de seguridad para etapas_solicitud
CREATE POLICY "Usuarios autenticados pueden ver etapas"
  ON etapas_solicitud
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear etapas"
  ON etapas_solicitud
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar etapas"
  ON etapas_solicitud
  FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas de seguridad para tipos_servicio
CREATE POLICY "Usuarios autenticados pueden ver tipos de servicio"
  ON tipos_servicio
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear tipos de servicio"
  ON tipos_servicio
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar tipos de servicio"
  ON tipos_servicio
  FOR UPDATE
  TO authenticated
  USING (true);
```

#### Segunda migración - Sistema de autenticación:
```sql
/*
  # Sistema de Autenticación y Roles

  1. Nuevas Tablas
    - `perfiles` - Perfiles de usuario con roles y permisos
    - `sesiones_usuario` - Registro de sesiones

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
```

### 3. Verificar la configuración
Después de ejecutar ambos scripts, verifica que las tablas se crearon correctamente:
- Ve a "Table Editor" en tu dashboard de Supabase
- Deberías ver las tablas: `solicitudes`, `etapas_solicitud`, `tipos_servicio`, `perfiles`, `sesiones_usuario`

### 4. Probar la aplicación
Una vez completados estos pasos, tu aplicación debería funcionar correctamente y podrás:
- Acceder al dashboard
- Registrar nuevas solicitudes
- Ver los tipos de servicio disponibles
- Usar el sistema de autenticación

## Notas importantes:
- Asegúrate de ejecutar ambos scripts en orden
- Si ya tienes algunas tablas creadas, los scripts usarán `IF NOT EXISTS` para evitar errores
- Los datos de ejemplo se insertarán automáticamente en la tabla `tipos_servicio`