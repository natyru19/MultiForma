# MultiForma

Ecommerce de diseños personalizados e impresión 3D. Catálogo con variantes, carrito persistente, checkout con Mercado Pago, autenticación de usuarios y panel de administración con control de stock.

**Demo en producción:** https://multiforma-ecommerce.vercel.app

---

## Qué incluye

### Tienda (cliente)

- Catálogo de productos activos y navegación por categorías
- Los productos inactivos permanecen ocultos para los clientes
- Detalle de producto con selector de variantes, cantidad y stock disponible
- Carrito persistente (usuario anónimo o autenticado)
- Checkout protegido (requiere iniciar sesión)
- Pago con Mercado Pago y confirmación de orden vía webhook + página de éxito
- Historial de compras
- Registro e inicio de sesión
- Asociación automática del carrito anónimo al registrarse o iniciar sesión

### Pagos (Mercado Pago)

- Creación de preferencia de pago con metadata del cliente y carrito
- Webhooks con manejo de pagos pendientes
- Prevención de órdenes duplicadas
- Descuento de stock al aprobarse el pago
- URLs dinámicas según entorno (producción en Vercel)

### Panel de administración

- Acceso directo **Administración** en el navbar (solo usuarios con `role = admin`)
- CRUD de productos: listar, crear, editar y eliminar
- Gestión de variantes (precio, stock, opción, color, imagen)
- Gestión de productos activos e inactivos
- Rutas protegidas por rol

### Stock

- Validación al agregar al carrito, actualizar cantidades y en checkout
- Bloqueo de compra sin stock
- Descuento automático al confirmar el pago

---

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Base de datos / Auth | Supabase (PostgreSQL + Supabase Auth) |
| Pagos | Mercado Pago API + Webhooks |
| Deploy | Vercel |

---

## Instalación y ejecución local

```bash
# Clonar e instalar dependencias
git clone <url-del-repo>
cd multiforma
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Completar .env.local con tus credenciales (ver sección siguiente)

# Servidor de desarrollo
npm run dev
```

La app corre en **http://localhost:3000**. Podés navegar catálogo, carrito, login, registro y panel admin sin configuración extra.

> **Pagos:** Mercado Pago exige URLs públicas; en local no acepta `localhost`. Lo más simple es probar el flujo de pago en el **deploy de Vercel**. Ver sección [Mercado Pago](#mercado-pago).

### Otros comandos

```bash
npm run build   # Build de producción
npm run start   # Servir el build (después de npm run build)
npm run lint    # ESLint
```

---

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MP_ACCESS_TOKEN=
NEXT_PUBLIC_MP_PUBLIC_KEY=

# URLs de la app
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_APP_URL=https://multiforma-ecommerce.vercel.app
```

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_*` | Cliente Supabase en el navegador |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones server-side (admin, webhooks, órdenes). **Requerida** para que funcionen el panel admin y las órdenes |
| `MP_ACCESS_TOKEN` | API de Mercado Pago (server) |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Clave pública de MP (cliente, si se usa) |
| `NEXT_PUBLIC_APP_URL` | URL base de la app (`localhost` en dev) |
| `NEXT_PUBLIC_VERCEL_APP_URL` | URL de producción en Vercel |

### Variables en Vercel

Mismas variables que arriba, con:

- `NEXT_PUBLIC_APP_URL` y `NEXT_PUBLIC_VERCEL_APP_URL` → `https://multiforma-ecommerce.vercel.app`



---

## Mercado Pago

### Webhook

```
POST /api/webhooks/mercadopago
```

En producción:

```
https://multiforma-ecommerce.vercel.app/api/webhooks/mercadopago
```

---

## Estructura del proyecto

```
app/
├── admin/              # Panel de administración
├── api/                # Route handlers (cart, orders, MP, admin, profile)
├── cart/               # Carrito
├── categories/         # Categorías
├── checkout/           # Checkout
├── login/ register/    # Autenticación
├── orders/             # Historial de compras
├── payment/pending/    # Pago pendiente (MP)
├── products/           # Catálogo y detalle
├── services/           # Lógica de negocio (cart, order, payment, stock)
├── context/            # CartContext (estado del carrito)
components/             # UI reutilizable (Navbar, ProductCard, etc.)
lib/                    # Supabase clients, appUrl, helpers
```

---

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con productos destacados |
| `/products` | Catálogo |
| `/products/[id]` | Detalle de producto |
| `/categories` | Listado de categorías |
| `/cart` | Carrito |
| `/checkout` | Checkout (requiere login) |
| `/success` | Confirmación post-pago |
| `/orders` | Mis compras |
| `/login` `/register` | Autenticación |
| `/admin` | Panel admin |
| `/admin/products` | Gestión de productos |

---

## Estado del proyecto

MultiForma es un ecommerce funcional desplegado en Vercel con:

- Flujo completo de compra (catálogo → carrito → checkout → pago → orden)
- Autenticación, perfiles y carrito persistente
- Integración con Mercado Pago en producción
- Panel admin con CRUD de productos, variantes y gestión de visibilidad
- Control de stock en tiempo real
