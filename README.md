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
- Actualización automática de cantidades
- Persistencia en base de datos (Supabase)
- Identificación de carrito mediante localStorage
- Validación de selección de variantes antes de agregar
- Selector de variantes dinámico (oculta opciones inválidas)
- Autoselección de variantes cuando existe una única opción
- Visualización de variantes en el carrito (opción/color)
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