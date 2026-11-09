# Historia clínica optométrica

Aplicación web para que un optómetra registre pacientes y sus historias clínicas: antecedentes, agudeza visual, examen clínico, diagnóstico y firma del profesional. Cada profesional ve solo sus propios datos.

**Demo:** https://historia-clinica-two.vercel.app

> Primera versión del sistema, generada como prototipo con v0 y conectada a Supabase. La versión que evolucionó de aquí, con roles, gestión de usuarios y PDF, es [Mega Óptica](https://github.com/Ang3lRamos/mega-optica).

## Funcionalidades

- **Cuentas:** registro, inicio de sesión y confirmación por correo con Supabase Auth. Un middleware renueva la sesión y protege las rutas.
- **Pacientes:** lista con búsqueda, ficha de cada paciente y su historial de consultas.
- **Historia clínica en 5 pestañas:**
  1. Datos generales de la consulta.
  2. Antecedentes.
  3. Agudeza visual sin y con corrección, de lejos y de cerca, por ojo (OD, OI y AO).
  4. Examen clínico.
  5. Diagnóstico y conducta, con la firma del profesional.
- **Firma digital:** se guarda en Supabase Storage y queda asociada a la historia.
- **Panel de inicio** con el resumen de pacientes e historias recientes.
- Tema claro y oscuro, diseño adaptable a celular.

## Seguridad de los datos

Las historias clínicas son datos sensibles, así que el aislamiento entre profesionales vive en la base de datos, no solo en la interfaz:

- Las tablas `profiles`, `patients` y `clinical_histories` tienen **Row Level Security** activado.
- Las políticas solo permiten leer, crear, editar o borrar filas donde `auth.uid()` coincide con el dueño.

## Stack

- **Next.js 16** (App Router) con React 19 y TypeScript
- **Supabase:** Postgres, Auth, Storage y RLS, con `@supabase/ssr` para la sesión en el servidor
- **Tailwind CSS v4** y componentes de **shadcn/ui** (Radix)
- **React Hook Form** y **zod** para formularios y validación
- Despliegue en **Vercel**

## Estructura

```
app/
  auth/                 login, registro y confirmación
  dashboard/            panel, pacientes y historias (nueva y detalle)
components/
  clinical-history/     formulario de la historia y una pestaña por sección
  ui/                   componentes de shadcn/ui
lib/supabase/           clientes de Supabase (navegador, servidor y middleware)
scripts/                migraciones SQL: perfiles, pacientes, historias y bucket de firmas
middleware.ts           renovación de sesión y protección de rutas
```

## Correr en local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. En un proyecto de Supabase, ejecuta en orden los archivos de `scripts/` (001 a 004) desde el SQL Editor.
3. Crea un archivo `.env.local` con las variables de tu proyecto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. Arranca el servidor:

   ```bash
   npm run dev
   ```

   Abre http://localhost:3000.
