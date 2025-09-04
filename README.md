# Proyecto Backend – E-commerce 🛒

## 📝 Descripción
API backend para un e-commerce desarrollada con Node.js + Express + MongoDB.
Incluye autenticación con JWT, roles y autorización, recuperación de contraseña por email, patrón Repository sobre DAO, DTOs para exponer datos no sensibles y una lógica de compra que verifica stock y emite tickets.

El proyecto consolida los contenidos del curso: arquitectura en capas, seguridad, manejo de variables de entorno y servicios de mailing (modo pruebas con Ethereal o SMTP real).

---

## 🧠 Tecnologías
- **Node.js**, **Express**, **MongoDB** (Mongoose)  
- **Passport** (Local + JWT), **Bcrypt**  
- **Nodemailer** (Ethereal para pruebas o SMTP real)  
- **Repository**, **DAO**, **DTOs**, manejo de errores  

---

## ▶️ Puesta en marcha
```bash
npm install
npm run seed:admin    # Crea admin@ecommerce.com / Admin123!
npm start             # http://localhost:8080
```

---

## 🔐 Roles y Autorización

### Roles
- **Admin**:  
  - Crear, editar y eliminar productos.  
  - Administrar usuarios.  
- **User**:  
  - Operar carrito y realizar compras.  

### Autorización
- Middleware `requiereRoles([...])` aplicado sobre la estrategia JWT “current”.

---

## 💳 Flujo de Compra (Resumen)

## Proceso
1. El usuario **user** agrega productos a su carrito:  
   `POST /api/carts/:cid/items`  
2. El usuario ejecuta la compra:  
   `POST /api/carts/:cid/purchase`  

### Lógica del Servicio
- Verifica el stock por cada ítem.  
- Descuenta el stock disponible.  
- Crea un **ticket** con los siguientes datos:  
  - `code`: Código del ticket.  
  - `amount`: Monto total.  
  - `purchaser`: Comprador.  
  - `timestamps`: Fechas y horas.  
- **Si hay faltantes de stock**:  
  - Responde con “Compra parcial”.  
  - Mantiene en el carrito únicamente los ítems rechazados.

---

## 🔁 Recuperación de Contraseña (Paso a Paso) 

1. **Enviar solicitud de recuperación**  
   - Endpoint: `POST /api/sessions/forgot-password`  
   - Cuerpo:  
     ```json
     { "email": "usuario@dominio.com" }


### Modo Ethereal
1. **Enviar solicitud de recuperación**  
   - Endpoint: `POST /api/sessions/forgot-password`  
   - Cuerpo:  
     ```json
     { "email": "usuario@dominio.com" }
     # Modo Ethereal

1. **Revisar consola del servidor**  
   - Abrir el enlace de vista previa del correo electrónico.

2. **El botón abre:**  
   - `GET /api/sessions/reset-password?token=...`  
     - Completar el formulario.

3. **Enviar:**  
   - `POST /api/sessions/reset-password`  
     - Aplica la nueva contraseña.