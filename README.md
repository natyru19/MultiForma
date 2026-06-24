# 🛍️ MultiForma

Ecommerce de diseños personalizados e impresión 3D, con catálogo de productos, variantes, carrito persistente, autenticación de usuarios, integración con Mercado Pago y panel de administración.

---

## 🌐 Demo

La aplicación se encuentra desplegada en Vercel.

https://multiforma-ecommerce.vercel.app

---

## 🚀 Funcionalidades

### ⚙️ Backend y lógica de negocio
- Integración con Supabase
- API para manejo de carrito
- Persistencia de carrito en base de datos
- Manejo de variantes de productos
- Actualización dinámica de cantidades
- Restricción de cantidad mínima por producto
- Eliminación sincronizada de productos en carrito
- Generación de órdenes y detalle de compra
- Limpieza automática del carrito luego de finalizar la compra
- Integración con API de Mercado Pago (sandbox)
- Webhooks de Mercado Pago
- Metadata personalizada de pagos
- Prevención de órdenes duplicadas
- Guardado de información del cliente
- Autenticación de usuarios con Supabase Auth
- Registro e inicio de sesión
- Asociación de órdenes con usuarios autenticados
- Persistencia de sesión con cookies mediante Supabase Auth
- Historial de compras por usuario autenticado
- Navegación dinámica según estado de sesión
- Cierre de sesión con Supabase Auth
- Protección de checkout para usuarios autenticados
- Asociación automática de carrito anónimo al iniciar sesión o registrarse
- Persistencia de carrito para usuarios autenticados y anónimos
- Asociación automática de carritos anónimos con usuarios autenticados
- Redirección automática post-pago mediante Mercado Pago

### 🛠️ Panel de administración

- Panel de administración para productos
- Creación de productos con variante inicial
- Edición de productos y gestión de variantes
- Alta de nuevas variantes desde el panel admin
- Protección de rutas administrativas por rol de usuario
- Control de acceso para usuarios administradores

### 📦 Gestión de stock

- Validación de stock al agregar productos al carrito
- Validación de stock al actualizar cantidades
- Revalidación de stock en checkout antes de iniciar el pago
- Descuento automático de stock al aprobarse el pago
- Prevención de inconsistencias al crear producto + variante
- Bloqueo de compra cuando no hay stock disponible

### 🛍️ Frontend
- Navegación por catálogo
- Página de detalle de productos
- Visualización dinámica de variantes
- Resumen de compra y checkout
- Panel admin para listado, creación y edición de productos
- Flujo “Comprar ahora” con redirección directa al checkout
- Selector de cantidad limitado por stock disponible
- Mensajes visuales de error por falta de stock
- Navegación contextual con botón reutilizable “volver atrás”
- Vista de categorías mejorada y uniforme

---

## 🛠️ Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL / Supabase
- Supabase Auth
- API de Mercado Pago
- Webhooks de Mercado Pago
- ngrok (desarrollo local)
- Vercel (despliegue en producción)

---

## 📦 Instalación local

```bash
npm install
npm run dev
```

Para verificar el build de producción en local:

```bash
npm run build
```

---

## 🔑 Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase 
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
MP_ACCESS_TOKEN=mp_access_token 
NEXT_PUBLIC_MP_PUBLIC_KEY=mp_public_key
```

Estas variables permiten conectar la aplicación con Supabase, habilitar operaciones administrativas seguras y procesar pagos con Mercado Pago.

---

## 📡 Webhooks y entorno de producción

### Endpoint de Webhooks

```txt
/api/webhooks/mercadopago
```

### Consideraciones para producción

- Configurar las variables de entorno en Vercel
- Actualizar `notification_url` de Mercado Pago para apuntar al dominio de producción
- Configurar `back_urls` de Mercado Pago para redirigir correctamente luego del pago
- Verificar el funcionamiento de los webhooks en entorno productivo

Durante el desarrollo local se utiliza ngrok para exponer el servidor y permitir que Mercado Pago envíe las notificaciones correctamente.
En producción, los webhooks son recibidos mediante la URL desplegada en Vercel.

---

📌 Estado actual

### Actualmente MultiForma cuenta con:

- Ecommerce funcional con catálogo, carrito y checkout
- Autenticación y persistencia de sesión
- Órdenes vinculadas a usuarios autenticados
- Integración completa con Mercado Pago
- Webhook de confirmación de pago
- Persistencia y asociación de carrito anónimo / autenticado
- Panel administrativo inicial para gestión de productos
- Sistema de variantes y control de stock
- Deploy funcional en Vercel