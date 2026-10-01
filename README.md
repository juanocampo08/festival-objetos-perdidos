# API Festival Picnic 2026

API REST del módulo de objetos perdidos del Festival Picnic 2026.

## Tecnologías

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## Instalación

```bash
npm install
```

Crea un archivo `.env` con:

```env
DATABASE_URL="cadena-de-conexion-de-la-base"
PORT=3000
```

No subir el archivo `.env` al repositorio. Para configurar el proyecto se puede usar `.env.example`.

## Sincronizar Prisma

```bash
npm run sync
```

Este comando obtiene el esquema de la base compartida y genera el cliente de Prisma.

No ejecutar:

```bash
npx prisma migrate
npx prisma db push
```

## Ejecutar la API

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

## Pruebas

Con la API encendida, desde la carpeta del kit:

```bash
node pruebas/correr.mjs objetos-perdidos http://localhost:3000
```

## Endpoints principales

```text
GET    /api/objetos-perdidos
GET    /api/objetos-perdidos/:id
POST   /api/objetos-perdidos
PATCH  /api/objetos-perdidos/:id
DELETE /api/objetos-perdidos/:id
POST   /api/objetos-perdidos/:id/reclamar
```

## Arquitectura

El proyecto está organizado en cuatro capas:

- `domain`: entidades e interfaces de repositorio.
- `application`: casos de uso y reglas de negocio.
- `infrastructure`: Prisma y acceso a la base de datos.
- `interface`: controladores y rutas.

## Regla de negocio

Para reclamar un objeto, el documento enviado debe coincidir con el documento del asistente. Si no coincide, la API responde `409`.

Un objeto que ya fue entregado no se puede reclamar, editar ni eliminar.

