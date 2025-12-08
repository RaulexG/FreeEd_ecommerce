# 📘 FreeEd – Plataforma de Cursos Digitales Creados por Estudiantes

FreeEd es una plataforma donde estudiantes transforman su conocimiento en cursos digitales accesibles para todos. Quien desee aprender puede descubrir cursos creados desde la experiencia real de estudiantes talentosos, mientras que ellos construyen portafolio y generan ingresos.

Este repositorio contiene la primera entrega funcional del sistema, incluyendo autenticación, base de datos completa y estructura lista para escalar.

---

## 🧱 Stack Tecnológico

- **Node.js** (ESM)
- **Express 5**
- **mysql2/promise** (Pool + Prepared Statements)
- **Zod** (validación de datos)
- **bcryptjs** (hash de contraseñas)
- **JSON Web Token** (jsonwebtoken)
- **Nodemon** (desarrollo)
- **Arquitectura:** MVC + Services + Repository
- **Frontend:** HTML dinámico + JS + Tailwind CDN

---

## ✅ Requisitos Previos

- Node.js ≥ 18
- MySQL 8.x o MariaDB
- Un usuario MySQL con permisos para:
  - Crear bases
  - Crear tablas
  - Ejecutar scripts .sql
- (Opcional) Workbench / HeidiSQL para ejecutar scripts visualmente

---

## 📁 Estructura del Proyecto

```text
\SRC
│   app.js
│   server.js
│   
├───bd
│       freeed_db.mwb
│       freeed_db.sql
│       
├───controllers
│       auth.controller.js
│       carrito.controller.js
│       categoria.controller.js
│       cliente.controller.js
│       curso.controller.js
│       pedido.controller.js
│
├───frontend
│   ├───assets
│   │       icono.png
│   │       logo.png
│   │       logo_banner.png
│   │
│   ├───layout
│   │       adminLayout.js
│   │       basepage.js
│   │
│   └───pages
│       ├───admin
│       │       categoria.js
│       │       clientes.js
│       │       dashboard.js
│       │       pedidos.js
│       │       productos.js
│       │
│       ├───client
│       │       carrito.js
│       │       miscursos.js
│       │       perfil.js
│       │
│       ├───errors
│       │       ForbiddenPage.js
│       │       NotFoundPage.js
│       │
│       └───public
│               home.js
│               Loginc.js
│               registro.js
│
├───middlewares
│       auth.js
│       errorHandler.js
│       notFound.js
│
├───models
│       auth.model.js
│       categoria.model.js
│       cliente.model.js
│       curso.model.js
│       pedido.model.js
│       pedidoDetalle.model.js
│
├───repositories
│       categoria.repository.js
│       cliente.repository.js
│       curso.repository.js
│
├───routes
│       auth.routes.js
│       carrito.routes.js
│       categorias.routes.js
│       clientes.routes.js
│       cursos.routes.js
│       frontend.routes.js
│       index.js
│       pedidos.routes.js
│
├───services
│       auth.service.js
│       carrito.service.js
│       categoria.service.js
│       cliente.service.js
│       curso.service.js
│       pedido.service.js
│
└───utils
        adminSeed.js
        db.js

```

---

## ⚙️ Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd FreeEd
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Servidor HTTP
PORT=8080

# Base de datos MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3307          
MYSQL_USER=Raulcn
MYSQL_PASSWORD=FreeEd25
MYSQL_DB=freeed_db
MYSQL_CONN_LIMIT=10

# Autenticación JWT
JWT_SECRET=52873c54485ca62091dc230ea0b1185215e4f175bb411b1991e163a6c814fb94
JWT_EXPIRES_IN=1h
```

> ⚠️ **IMPORTANTE:** Si tu MySQL corre en otro puerto, cámbialo.

### 4️⃣ Crear la Base de Datos

El archivo `bd/freeed_db.sql` contiene:

Creación de la BD `freeed_db`

Usuario MySQL `Raulcn` (password `FreeEd25`)


#### Opción A – CLI
```bash
mysql -u root -p
SOURCE ruta/freeed_db.sql;
```

#### Opción B – Workbench

1. Abrir Workbench
2. Conectarse como root
3. Abrir `freeed_db.sql`
4. Ejecutar todo

### 5️⃣ Ejecutar la API

#### Desarrollo:
```bash
npm run dev
```

#### Producción:
```bash
npm start
```

Servidor:
👉 [http://localhost:8080/](http://localhost:8080/)

---

## 🔌 Endpoints Actualizados (Backend)

### 📍 Health Check

**GET** `/`

```json
{ "ok": true, "msg": "FreeEd API viva" }
```

### 🔐 Autenticación

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "raulex@gmail.com",
  "password": "Admin123"
}
```

**Respuesta:**
```json
{
  "token": "JWT",
  "user": { "id": 1, "nombre": "Raúl", "rol": "CLIENTE" }
}
```

Enviar token:
`Authorization: Bearer <token>`

---

### 👤 Clientes

(Protegido por JWT)

| Método | Endpoint             | Descripción       |
|--------|-----------------------|-------------------|
| GET    | `/api/clientes`       | Lista todos       |
| GET    | `/api/clientes/:id`   | Obtiene uno       |
| POST   | `/api/clientes`       | Crea cliente      |
| PATCH  | `/api/clientes/:id`   | Actualiza         |
| DELETE | `/api/clientes/:id`   | Elimina           |

---

### 📂 Categorías

| Método | Endpoint             | Descripción       |
|--------|-----------------------|-------------------|
| GET    | `/api/categorias`     | Listado público   |
| GET    | `/api/categorias/:id` | Una categoría     |
| POST   | `/api/categorias`     | Crear (Admin)     |
| PATCH  | `/api/categorias/:id` | Editar (Admin)    |
| DELETE | `/api/categorias/:id` | Eliminar (Admin)  |

---

### 🎓 Cursos

| Método | Endpoint             | Descripción       |
|--------|-----------------------|-------------------|
| GET    | `/api/cursos`         | Listado público   |
| GET    | `/api/cursos/:id`     | Un curso          |
| POST   | `/api/cursos`         | Crear (Admin)     |
| PATCH  | `/api/cursos/:id`     | Editar (Admin)    |
| DELETE | `/api/cursos/:id`     | Eliminar (Admin)  |

---

### 🛒 Carrito de Compra

Todos requieren autenticación.

| Método | Endpoint                   | Descripción               |
|--------|-----------------------------|---------------------------|
| GET    | `/api/carrito`             | Obtiene carrito activo    |
| POST   | `/api/carrito/items`       | Agrega curso              |
| PATCH  | `/api/carrito/items/:id`   | Actualiza cantidad        |
| DELETE | `/api/carrito/items/:id`   | Elimina un item           |
| DELETE | `/api/carrito`             | Vacía carrito             |
| POST   | `/api/carrito/confirmar`   | Convierte carrito → pedido|

---

### 🧾 Pedidos (Cliente + Admin)

#### Cliente

| Método | Endpoint                 | Descripción       |
|--------|---------------------------|-------------------|
| GET    | `/api/pedidos/mios`      | Lista mis pedidos |
| GET    | `/api/pedidos/mios/:id`  | Detalle de mi pedido |

#### Admin

| Método | Endpoint                 | Descripción       |
|--------|---------------------------|-------------------|
| GET    | `/api/pedidos`           | Todos los pedidos |
| GET    | `/api/pedidos/:id`       | Detalle           |
| PATCH  | `/api/pedidos/:id`       | Cambiar estado    |

---

Soporta:

✔ Compras reales  
✔ Historial del cliente  
✔ Administración completa  
✔ Cursos listados por usuario  

---

## 🚀 Fases del Proyecto

- **✔ Entrega 1**
  - Login y JWT
  - Sistema de clientes
  - BD completa
  - Frontend base

- **✔ Entrega 2**
  - Gestión de categorías
  - Gestión de cursos

- **✔ Entrega 3 (Actual)**
  - Carrito con BD
  - Confirmación de compra → pedido
  - Sección "Mis cursos"
  - Panel Admin completo

---

## 👤 Autor

**Raúl Chavira Narváez**  
Ingeniería en Sistemas – TecNM Tuxtla  
Proyecto académico: FreeEd – Plataforma Estudiantil de Cursos