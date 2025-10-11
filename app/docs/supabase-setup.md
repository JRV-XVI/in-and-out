# Configuración de Supabase Auth

## 1. Modificar la tabla `users`

Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Modificar la tabla users para usar UUID en lugar de serial
ALTER TABLE users ALTER COLUMN id TYPE UUID USING gen_random_uuid();
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Eliminar la columna password ya que Supabase Auth la maneja automáticamente
ALTER TABLE users DROP COLUMN IF EXISTS password;

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
```

## 2. Crear función para sincronizar usuarios

```sql
-- Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, userType)
  VALUES (new.id, new.email, '', 0, 1);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se cree un nuevo usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 3. Configuración de Email Templates (Opcional)

En el panel de Supabase, ve a Authentication > Templates y personaliza los templates de email para:
- Confirmación de cuenta
- Recuperación de contraseña
- Cambio de email

## 4. Configuración de URL de Redirección

En Authentication > URL Configuration, agrega las URLs de tu app:
- Site URL: `exp://localhost:19000` (para desarrollo)
- Redirect URLs: `exp://localhost:19000/**`

## 5. Verificar variables de entorno

Asegúrate de tener en tu archivo `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=tu_supabase_anon_key
```