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
- API de Mercado Pago
- Webhooks de Mercado Pago
- ngrok

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