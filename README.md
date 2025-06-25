# 🐾 VetControl - Sistema de Gestión para Clínicas Veterinarias

---

## 📋 Descripción General

**VetControl** es un sistema **SaaS** diseñado para la gestión integral de clínicas veterinarias.  
La aplicación permite administrar **usuarios**, **clientes**, **mascotas**, **citas**, **inventario/productos**, **facturación electrónica** y **reportes**,  
ofreciendo una solución completa para la administración eficiente del servicio veterinario.

---

## 🚀 Características Principales

### 🧑‍💼 Gestión de Usuarios
- Control de acceso basado en roles  
- Perfiles personalizables  
- Autenticación segura

### 👥 Gestión de Clientes
- Registro y edición de clientes  
- Búsqueda rápida por identificación o nombre  
- Datos completos de contacto y domicilio

### 🐶 Gestión de Mascotas
- Registro de mascotas vinculadas a clientes  
- Historial médico y vacunas  
- Seguimiento de tratamientos

### 📅 Gestión de Citas
- Programación y administración de citas  
- Notificaciones y recordatorios  
- Calendario interactivo

### 📦 Gestión de Inventario / Productos
- Control de stock de medicamentos y productos  
- Alertas de bajo inventario  
- Categorías y proveedores

### 🧾 Facturación Electrónica
- Emisión y gestión de facturas  
- Integración con servicios electrónicos de facturación  
- Impresión y exportación de comprobantes

### 📊 Reportes
- Reportes personalizados por cliente, mascota o periodo  
- Análisis de citas, ventas e inventario  
- Exportación en formatos comunes (PDF, Excel)

---

## 🛠 Tecnologías Utilizadas

| Frontend       | Backend       | Base de Datos  | Construcción | Estilizado   |
| -------------- | ------------- | -------------- | ------------ | ------------ |
| React 18 + TS  | Nest.js       | PostgreSQL     | Vite         | Tailwind CSS |

---

## 🗂 Estructura del Proyecto

src/
├── assets/ # Recursos estáticos (imágenes, iconos)
├── auth/ # Autenticación y autorización
├── components/ # Componentes reutilizables
│ └── modules/ # Módulos principales del sistema
│ ├── appointments/ # Gestión de citas
│ ├── billing/ # Facturación electrónica
│ ├── clients/ # Gestión de clientes
│ ├── inventory/ # Gestión de inventario/productos
│ ├── pets/ # Gestión de mascotas
│ ├── reports/ # Reportes
│ └── users/ # Gestión de usuarios


---

## ⚙️ Instalación y Ejecución

```bash
# Clonar repositorio
git clone https://github.com/GabooMedina/VetControl-Frontend.git
cd vetcontrol

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar versión producción
npm run preview

```
📋 Requisitos del Sistema:

Node.js 18 o superior

PostgreSQL instalado y configurado

Navegador web moderno (Chrome, Firefox, Edge, Safari)

Conexión a internet para acceso al Backend

👥 Contribuidores:

Jade Ramirez

Carlos Alvarado

Daniel Fuelpaz

Gabriel Medina