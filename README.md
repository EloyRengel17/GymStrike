> **English:** Gym access-control and management system. NestJS REST API with PostgreSQL, React admin panel, Docker. Web panel done; mobile app in development.
# GymStrike

Sistema de control de acceso y gestión para gimnasios. Permite registrar clientes, administrar sus membresías y pagos, y validar la entrada al local. Está hecho con un backend en NestJS y un panel de administración web en React.

**Estado:** en desarrollo. El backend y el panel web funcionan; la aplicación móvil todavía no está implementada.

## Funcionalidades

- Registro y administración de clientes y membresías
- Control de pagos
- Validación de acceso: comprueba si la membresía del cliente está vigente
- Verificación diaria del estado de las membresías, con alertas automáticas por WhatsApp
- Panel de administración web

## Tecnologías

| Parte | Stack |
|---|---|
| Backend | NestJS, TypeScript, PostgreSQL, TypeORM |
| Panel web | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Router |
| Infraestructura | Docker, Docker Compose |
| Móvil (pendiente) | React Native con Expo |

## Capturas


![Panel de administración]()
![Vista-de-app]()

## Estructura del repositorio

```text
GymStrike/
├── backend/             API REST en NestJS
├── temp-admin/          Panel de administración en React
├── docker-compose.yaml  Base de datos PostgreSQL
└── README.md
```

## Requisitos

- Git
- Docker Desktop, abierto y en ejecución
- Node.js 18 o superior (incluye npm)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/EloyRengel17/GymStrike.git
cd GymStrike
```

### 2. Levantar la base de datos

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Para comprobar que el contenedor está corriendo:

```bash
docker ps
```

### 3. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` dentro de `backend/` con estos valores de ejemplo (cámbialos si modificaste el `docker-compose.yaml`):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASSWORD=supersecretpassword
DB_NAME=gymstrike_db
```

Inicia el servidor en modo desarrollo:

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

### 4. Panel web

En otra terminal, desde la raíz del proyecto:

```bash
cd temp-admin
npm install
npm run dev
```

El panel queda disponible en `http://localhost:5173`.

## Pendiente

- [ ] Aplicación móvil (React Native) con lectura de QR/NFC para el acceso
- [ ] Pruebas automatizadas
- [ ] Despliegue

## Autor

Eloy Rengel · [GitHub](https://github.com/EloyRengel17) · [LinkedIn](https://linkedin.com/in/eloy-rengel)
