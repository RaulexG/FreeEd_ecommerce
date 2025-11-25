📘 FreeEd – Plataforma de Cursos Digitales Creados por Estudiantes

API backend construida con Node.js + Express, autenticación con JWT, validación con Zod, acceso a datos usando MySQL (mysql2/promise) y arquitectura MVC + Services + Repository.

FreeEd es una plataforma donde estudiantes transforman su conocimiento en cursos digitales accesibles para todos.
Quien desee aprender puede descubrir cursos creados desde la experiencia real de estudiantes talentosos, mientras que ellos construyen portafolio y generan ingresos.

Este repositorio contiene la primera entrega funcional del sistema, incluyendo autenticación, base de datos completa y estructura lista para escalar.

🧱 Stack Tecnológico

Node.js (ESM)

Express 5

mysql2/promise (Pool + Prepared Statements)

Zod (validación de datos)

bcryptjs (hash de contraseñas)

JSON Web Token (jsonwebtoken)

Nodemon (desarrollo)

Arquitectura: MVC + Services + Repository

Frontend: HTML dinámico + JS + Tailwind CDN

✅ Requisitos Previos

Node.js ≥ 18

MySQL 8.x o MariaDB

Un usuario MySQL con permisos para:

Crear bases

Crear tablas

Ejecutar scripts .sql

Opcional:

Workbench / HeidiSQL para ejecutar scripts visualmente.

📁 Estructura del Proyecto
src/
  app.js
  server.js

  routes/
    index.js
    auth.routes.js
    clientes.routes.js
    frontend.routes.js

  controllers/
    auth.controller.js
    cliente.controller.js
    frontend.controller.js

  services/
    auth.service.js
    cliente.service.js

  repositories/
    cliente.repository.js

  models/
    auth.model.js
    cliente.model.js

  middlewares/
    auth.js
    errorHandler.js
    notFound.js

  utils/
    db.js

  frontend/
    layout/
      basepage.js
    pages/
      home.js
      login.js
      registro.js
    errors/
      404.js
    assets/
      (imágenes opcionales)

bd/
  freeed_db.sql   ← Script completo de la base de datos

.env   (se crea manualmente)

⚙️ Configuración
1️⃣ Clonar el repositorio
git clone <URL_DEL_REPO>
cd FreeEd

2️⃣ Instalar dependencias
npm install

3️⃣ Crear archivo .env

Crea un archivo .env en la raíz del proyecto:

# Servidor HTTP
PORT=8080

# Base de datos
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=Raulcn
MYSQL_PASSWORD=FreeEd25
MYSQL_DB=freeed_db
MYSQL_CONN_LIMIT=10

# JWT
JWT_SECRET=CAMBIA_ESTE_VALOR
JWT_EXPIRES_IN=1h


⚠️ IMPORTANTE:
Si tu MySQL corre en el puerto 3306, cámbialo.

🗄️ 4️⃣ Crear la Base de Datos

El archivo:

bd/freeed_db.sql


incluye toda la estructura del proyecto:

clientes

perfiles_estudiante

categorias_curso

cursos

pedidos

pedido_detalles

reseñas_curso

Incluye también:

✔ Creación de la base freeed_db
✔ Creación de usuario MySQL Raulcn
✔ Password FreeEd25
✔ Inserción de usuario demo

Opción A: CLI
mysql -u root -p 

SOURCE ruta/archivo/freeed_db.sql;

Opción B: Workbench

Abrir Workbench

Conectarse como root

Abrir freeed_db.sql

Ejecutar todo

🚀 5️⃣ Ejecutar la API
Modo desarrollo
npm run dev

Modo producción
npm start


Servidor disponible en:

http://localhost:8080/

🔌 Endpoints Principales
Health Check
GET /


Devuelve:

{ "ok": true, "msg": "FreeEd API viva" }

🔐 Autenticación
POST /api/auth/login

Body:

{
  "email": "raulex@gmail.com",
  "password": "tu_password"
}


Respuesta:

{
  "token": "JWT_AQUI",
  "user": {
    "id": 1,
    "nombre": "raulex cn",
    "email": "raulex@gmail.com"
  }
}


Enviar el token:

Authorization: Bearer <token>

👥 Clientes (Rutas protegidas)
GET /api/clientes

Lista todos los clientes.

GET /api/clientes/:id

Obtiene un cliente por id.

POST /api/clientes

Registra un cliente nuevo.

PATCH /api/clientes/:id

Actualiza info de cliente.

DELETE /api/clientes/:id

Elimina un cliente.

🧩 Modelo de Datos – Resumen

Relaciones principales:

clientes 1 — N cursos

clientes 1 — N pedidos

cursos 1 — N pedidos

pedidos 1 — N pedido_detalles

clientes 1 — N reseñas (como autor)

clientes 1 — N reseñas (como receptor)

Base sólida para:

✔ Publicación de cursos
✔ Compra de cursos
✔ Reseñas
✔ Historial de compras

🗂️ Fases del Proyecto
✔ Entrega 1 – COMPLETADA

Autenticación funcional

Login + JWT

Tabla clientes

BD completa creada

Frontend base (home, login, registro)

⏳ Entrega 2

CRUD de categorías

CRUD de cursos

⏳ Entrega 3

Pedidos

Detalles de pedido

Reseñas

Publicación final

👤 Autor

Raúl Chavira Narváez
Ingeniería en Sistemas – TecNM Tuxtla
Proyecto académico: FreeEd – Plataforma Estudiantil de Cursos