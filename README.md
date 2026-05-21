# El Diario de Tola

Portal de noticias moderno construido con tecnologías web de última generación, enfocado en la publicación, gestión y lectura de artículos con sistema de autenticación y control de roles.

**Sitio en vivo:** https://el-diario-de-tola.vercel.app

## 📋 Descripción del Proyecto

El Diario de Tola es una aplicación web fullstack que permite a los usuarios registrarse, autenticarse y gestionar artículos. Los administradores pueden moderar el contenido, mientras que los usuarios regulares pueden publicar artículos (opcionalmente de forma anónima).

### Características principales

- ✅ Autenticación y autorización segura con NextAuth
- ✅ Sistema de roles (USER y ADMIN)
- ✅ Publicación de artículos con editor rich text
- ✅ Soporte para artículos anónimos
- ✅ Gestión completa de artículos (crear, editar, eliminar)
- ✅ Dashboard personalizado por usuario
- ✅ Panel administrativo para moderación
- ✅ Base de datos relacional con PostgreSQL
- ✅ Interfaz responsiva con Tailwind CSS
- ✅ TypeScript para seguridad de tipos

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend:        React 19 + Next.js 16
UI Framework:    Tailwind CSS 4
Backend:         Next.js API Routes + Node.js
Autenticación:   NextAuth 5 (beta)
Base de Datos:   PostgreSQL
ORM:             Prisma 6
Seguridad:       bcryptjs
Lenguaje:        TypeScript 5
Linting:         ESLint 9
```

### Estructura del Proyecto

```
El-Diario-de-Tola/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/          # Panel de usuario
│   │   ├── admin/              # Panel administrativo
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── articles/
│   │   │   └── users/
│   │   └── page.tsx            # Página de inicio
│   └── components/             # Componentes reutilizables
├── prisma/
│   ├── schema.prisma           # Definición del modelo de datos
│   └── seed.ts                 # Script de seed para datos iniciales
├── public/                     # Archivos estáticos
├── auth.ts                     # Configuración de NextAuth
├── auth.config.ts              # Configuración de autenticación
├── middleware.ts               # Middleware de protección de rutas
├── next.config.ts              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
├── tailwind.config.js          # Configuración de Tailwind CSS
└── package.json                # Dependencias del proyecto
```

---

## 📊 Modelo de Datos

### Usuarios (User)

```typescript
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password_hash String
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  articles      Article[]  // Relación: un usuario puede tener muchos artículos
}

enum Role {
  USER
  ADMIN
}
```

### Artículos (Article)

```typescript
model Article {
  id            String   @id @default(cuid())
  title         String
  excerpt       String   @db.VarChar(300)
  content       String   @db.VarChar(2000)
  category      String
  imageUrl      String?
  is_anonymous  Boolean  @default(false)
  published     Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  author        User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId      String
}
```

### Relaciones

- **Usuario → Artículos:** Relación uno-a-muchos. Un usuario puede crear múltiples artículos.
- **Eliminación en cascada:** Al eliminar un usuario, se eliminan todos sus artículos.

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. **Registro:** El usuario se registra con email y contraseña
2. **Hash de Contraseña:** Se utiliza bcryptjs para hashear las contraseñas
3. **Sesión JWT:** NextAuth genera un JWT que se almacena en una cookie segura
4. **Validación:** Las rutas protegidas se validan a través del middleware

### Estrategia de Protección

```typescript
// Middleware: middleware.ts
// Protege rutas /dashboard/* - requiere autenticación
// Protege rutas /admin/* - requiere rol ADMIN
```

### Roles y Permisos

| Rol  | Descripción | Permisos |
|------|-------------|----------|
| USER | Usuario regular | Crear, editar y eliminar sus propios artículos. Leer todos los artículos publicados. |
| ADMIN | Administrador | Acceso total. Moderar artículos, gestionar usuarios y ver estadísticas. |

---

## 🚀 Instrucciones de Instalación

### Requisitos previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL 12+

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/colomer510-netizen/El-Diario-de-Tola.git
   cd El-Diario-de-Tola
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local` en la raíz del proyecto:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tola_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secreto-seguro-aqui"
   ```

4. **Configurar la base de datos**
   ```bash
   npm run db:push
   ```

5. **Seed de datos (opcional)**
   ```bash
   npm run db:seed
   ```

6. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📦 Scripts Disponibles

```json
{
  "dev": "next dev",                    // Servidor de desarrollo
  "build": "next build",                // Build para producción
  "start": "next start",                // Inicia servidor de producción
  "lint": "eslint",                     // Validación de código
  "db:push": "prisma db push",          // Sincroniza BD sin migraciones
  "db:migrate": "prisma migrate dev",   // Crear migración y aplicarla
  "db:studio": "prisma studio",         // GUI para gestionar la BD
  "db:seed": "tsx prisma/seed.ts"       // Seed de datos iniciales
}
```

---

## 🔄 Flujos de Usuario

### 1. Registro e Inicio de Sesión

```
Usuario Nuevo → Página /register → Ingresa email y contraseña 
→ Contraseña se hashea con bcryptjs → Se crea User en BD 
→ Redirige a /login → Usuario inicia sesión 
→ NextAuth valida credenciales y genera JWT → Sesión activa
```

### 2. Publicación de Artículo

```
Usuario autenticado → Accede a /dashboard/create-article 
→ Rellena formulario (título, contenido, categoría, etc.) 
→ Selecciona si es anónimo → Envía POST /api/articles 
→ Prisma guarda en BD → Artículo aparece en feed y dashboard
```

### 3. Panel Administrativo

```
Admin → Accede a /admin (middleware valida rol ADMIN) 
→ Ve lista de usuarios, artículos para moderar → Puede 
cambiar roles, eliminar contenido, ver estadísticas
```

---

## 🛠️ Desarrollo

### Estructura de Carpetas (Próximas mejoras)

Se recomienda organizar la siguiente estructura:

```
src/
├── app/                    # Next.js rutas
├── components/             # Componentes React reutilizables
├── lib/                    # Utilidades y funciones auxiliares
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript tipos globales
├── styles/                 # Estilos globales
└── utils/                  # Funciones de utilidad
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/tola_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-aqui (generar con: openssl rand -base64 32)

# APIs externas (opcional)
# NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 📱 Responsividad

La aplicación utiliza **Tailwind CSS 4** para asegurar una interfaz completamente responsiva que funciona correctamente en:

- Dispositivos móviles (320px en adelante)
- Tablets (768px+)
- Desktop (1024px+)
- Pantallas ultra wide (1920px+)

---

## 🧪 Testing (Próxima implementación)

Se recomienda integrar:

- **Jest:** Testing de funciones y lógica
- **React Testing Library:** Testing de componentes
- **Cypress:** Testing e2e

---

## 📈 Optimizaciones Futuras

- [ ] Agregar paginación al listado de artículos
- [ ] Implementar búsqueda y filtros avanzados
- [ ] Agregar comentarios en artículos
- [ ] Sistema de notificaciones
- [ ] Integración con redes sociales
- [ ] Editor de markdown/rich text mejorado
- [ ] Implementar rate limiting en APIs
- [ ] Agregar tests automatizados
- [ ] Mejorar SEO (meta tags dinámicos)
- [ ] Implementar dark mode

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 👤 Autor

**colomer510-netizen**

- GitHub: [@colomer510-netizen](https://github.com/colomer510-netizen)
- Sitio web: [El Diario de Tola](https://el-diario-de-tola.vercel.app)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org) - React framework
- [NextAuth](https://next-auth.js.org) - Autenticación
- [Prisma](https://prisma.io) - ORM
- [Tailwind CSS](https://tailwindcss.com) - Estilos
- [PostgreSQL](https://www.postgresql.org) - Base de datos

---

**Última actualización:** 2026-05-21
