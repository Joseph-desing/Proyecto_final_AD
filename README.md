# Proyecto Final - Aplicaciones Distribuidas

Este proyecto es una aplicación web desarrollada en Flask para la gestión de salas. Incluye un sistema de autenticación de usuarios y está contenerizada utilizando Docker.

## Descripción

La aplicación permite el registro y autenticación de usuarios, sirviendo como base para un sistema de gestión de reservas o administración de salas. Utiliza MySQL como base de datos y está diseñada para ser desplegada fácilmente mediante Docker Compose.

## Características

- ✅ Sistema de autenticación (registro, login, logout)
- ✅ Gestión de salas (crear, buscar, listar)
- ✅ Interfaz de usuario moderna y minimalista
- ✅ Validación de formularios en tiempo real
- ✅ Diseño responsive

## Páginas del Frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a la página de login |
| `/login` | Página de inicio de sesión |
| `/register` | Página de registro de usuarios |
| `/dashboard` | Panel principal con gestión de salas |

## Endpoints de la API

### Autenticación (`/auth`)

| Método | Endpoint         | Descripción                | Body (JSON)                                              |
| :----- | :--------------- | :------------------------- | :------------------------------------------------------- |
| `POST` | `/auth/register` | Registrar un nuevo usuario | `{"username": "...", "email": "...", "password": "..."}` |
| `POST` | `/auth/login`    | Iniciar sesión             | `{"email": "...", "password": "..."}`                    |
| `POST` | `/auth/logout`   | Cerrar sesión actual       | _Vacío_                                                  |

### Salas (`/sala`)

| Método | Endpoint             | Descripción              | Body (JSON)                                                               |
| :----- | :------------------- | :------------------------| :-------------------------------------------------------------------------|
| `POST` | `/sala/create`       | Crear nueva sala         | `{"nombre": "...", "codigo": "...", "capacidad": "...", "userid": "..."}` |
| `GET`  | `/sala/codigo/<codigo>` | Buscar sala por código | _Ninguno_                                                                 |
| `GET`  | `/sala/all`          | Listar todas las salas   | _Ninguno_                                                                 |

### General

| Método | Endpoint      | Descripción                                  |
| :----- | :------------ | :------------------------------------------- |
| `GET`  | `/api/status` | Verificar estado del servicio (Health Check) |

## Estructura del Proyecto

```
proyecto/
├── app/
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       ├── auth.js
│   │       ├── salas.js
│   │       └── validation.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── login.html
│   │   ├── register.html
│   │   └── dashboard.html
│   ├── models/
│   │   ├── user_models.py
│   │   └── sala_models.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   └── sala_routes.py
│   ├── app.py
│   ├── config.py
│   └── Dockerfile
├── sql/
│   └── init.sql
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Ejecución

Para levantar el proyecto, asegúrate de tener Docker instalado y ejecuta:

```bash
docker compose up --build
```

El sistema estará disponible en:
- **Aplicación**: http://localhost:5000
- **phpMyAdmin**: http://localhost:8081

## Base de Datos

Las tablas se crean automáticamente al iniciar el contenedor de MySQL. El script de inicialización se encuentra en `sql/init.sql`.

### Tabla `usuarios`
- `userid` - ID único (auto-incremento)
- `username` - Nombre de usuario
- `email` - Correo electrónico (único)
- `password` - Contraseña hasheada
- `created_at` - Fecha de creación

### Tabla `salas`
- `id` - ID único (auto-incremento)
- `nombre` - Nombre de la sala
- `codigo` - Código único de la sala
- `capacidad` - Capacidad de personas
- `userid` - ID del usuario creador (FK)
- `created_at` - Fecha de creación

