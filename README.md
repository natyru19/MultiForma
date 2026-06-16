# 🛍️ MultiForma

Ecommerce de diseños personalizados e impresión 3D.

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
- Despliegue en producción mediante Vercel

### 🛍️ Frontend
- Navegación por catálogo
- Página de detalle de productos
- Visualización dinámica de variantes
- Resumen de compra y checkout

---

## 🛠️ Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL (Supabase)
- Supabase Auth
- API de Mercado Pago
- Webhooks de Mercado Pago
- ngrok (desarrollo local)
- Vercel

---

## 🌐 Demo

Aplicación desplegada en:

https://multiforma-ecommerce.vercel.app

---

## 📦 Instalación local

```bash
npm install
npm run dev
```

---

## 🔑 Variables de entorno

Crear un archivo `.env.local` en la raíz de la carpeta `MULTIFORMA`.

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase 
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
MP_ACCESS_TOKEN=mp_access_token 
NEXT_PUBLIC_MP_PUBLIC_KEY=mp_public_key
```

Estas variables permiten conectar la aplicación con Supabase y Mercado Pago.

---

## 📡 Endpoint de Webhooks

```txt
/api/webhooks/mercadopago
```

Durante el desarrollo local se utiliza ngrok para exponer el servidor y permitir que Mercado Pago envíe las notificaciones correctamente.

En producción, los webhooks son recibidos mediante la URL desplegada en Vercel.