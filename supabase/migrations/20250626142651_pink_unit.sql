/*
  # Sistema de Administración de Solicitudes Estudiantiles

  1. Nuevas Tablas
    - `solicitudes` - Tabla principal para registrar todas las solicitudes estudiantiles
      - `id` (uuid, primary key)
      - `numero` (text, unique) - Número único de solicitud
      - `estudiante_nombre` (text) - Nombre del estudiante
      - `estudiante_apellido` (text) - Apellido del estudiante
      - `estudiante_cedula` (text) - Cédula del estudiante
      - `estudiante_matricula` (text) - Matrícula del estudiante
      - `estudiante_carrera` (text) - Carrera del estudiante
      - `estudiante_telefono` (text) - Teléfono del estudiante
      - `estudiante_email` (text) - Email del estudiante
      - `tipo_servicio` (text) - Tipo de servicio solicitado
      - `descripcion` (text) - Descripción de la solicitud
      - `fecha_solicitud` (timestamptz) - Fecha de la solicitud
      - `fecha_limite_esperada` (timestamptz) - Fecha límite esperada
      - `fecha_completada` (timestamptz) - Fecha de completado
      - `estado` (text) - Estado actual de la solicitud
      - `prioridad` (text) - Prioridad de la solicitud
      - `tiempo_respuesta` (integer) - Tiempo de respuesta en días
      - `observaciones` (text) - Observaciones adicionales
      - `documentos_requeridos` (jsonb) - Lista de documentos requeridos
      - `documentos_entregados` (jsonb) - Lista de documentos entregados
      - `responsable_asignado` (text) - Responsable asignado
      - `costo_servicio` (decimal) - Costo del servicio
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización

    - `etapas_solicitud` - Etapas del proceso de cada solicitud
      - `id` (uuid, primary key)
      - `solicitud_id` (uuid, foreign key)
      - `nombre` (text) - Nombre de la etapa
      - `descripcion` (text) - Descripción de la etapa
      - `fecha_inicio` (timestamptz) - Fecha de inicio
      - `fecha_fin` (timestamptz) - Fecha de finalización
      - `completada` (boolean) - Si está completada
      - `tiempo_estimado` (integer) - Tiempo estimado en días
      - `tiempo_real` (integer) - Tiempo real en días
      - `responsable` (text) - Responsable de la etapa
      - `comentarios` (text) - Comentarios
      - `orden` (integer) - Orden de la etapa

    - `tipos_servicio` - Catálogo de tipos de servicios
      - `id` (uuid, primary key)
      - `codigo` (text, unique) - Código del servicio
      - `nombre` (text) - Nombre del servicio
      - `descripcion` (text) - Descripción del servicio
      - `tiempo_estimado` (integer) - Tiempo estimado en días
      - `costo` (decimal) - Costo del servicio
      - `documentos_requeridos` (jsonb) - Documentos requeridos
      - `activo` (boolean) - Si está activo

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