# 🛍️ MultiForma

Ecommerce de diseños personalizados e impresión 3D.

---

## 🚀 Funcionalidades actuales

### 🛍️ Frontend
- Sección de productos destacados
- Página de detalle de productos
- Navegación por catálogo
- Filtrado por categorías

### ⚙️ Backend
- Integración con Supabase
- API para manejo de carrito
- Persistencia de carrito en base de datos

### 🛒 Carrito
- Agregar productos con variantes
- Persistencia en base de datos (Supabase)
- Identificación de carrito mediante localStorage
- Actualización dinámica de cantidades (+ / -)
- Restricción de cantidad mínima (no permite valores menores a 1)
- Eliminación directa de productos del carrito (sincronizada con base de datos)
- Visualización de variantes (opción/color)
- Cálculo de precio unitario, subtotal por producto y total del carrito

---

## 🛠️ Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL (Supabase)

---

## 📦 Instalación local

```bash
npm install
npm run dev