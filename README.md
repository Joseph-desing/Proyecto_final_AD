# Proyecto Final - Aplicaciones Distribuidas (3 Nodos)

Aplicación web distribuida en Flask para la gestión de salas con arquitectura de 3 nodos independientes. Cada nodo tiene su propia base de datos MySQL, aplicación Flask y acceso a PhpMyAdmin.

##  Arquitectura

El sistema está compuesto por **3 nodos completamente independientes**:
- Cada nodo tiene su propia instancia de MySQL
- Cada nodo ejecuta su propia aplicación Flask
- Cada nodo tiene su propio volumen de persistencia
- Todas las bases de datos tienen el mismo esquema inicial

## Estructura del Proyecto

```
Proyecto_final_AD/
├── docker-compose.yml          # Configuración de 3 nodos
├── README.md                   # Este archivo
├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py
│   ├── config.py
│   ├── models/
│   │   ├── user_models.py
│   │   └── sala_models.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   └── sala_routes.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── login.html
│   │   ├── register.html
│   │   └── dashboard.html
│   └── static/
│       ├── css/styles.css
│       └── js/
│           ├── auth.js
│           ├── salas.js
│           └── validation.js
├── sql/
│   └── init.sql                # Script de inicialización de BD
├── data/
│   └── mysql/
│       ├── db1/                # Volumen persistente Nodo 1
│       ├── db2/                # Volumen persistente Nodo 2
│       └── db3/                # Volumen persistente Nodo 3
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

##  Despliegue

### Requisitos previos
- Docker y Docker Compose instalados
- Puerto 5000-5002, 3308-3310, 8081-8083 disponibles

### Iniciar servicios

# Ir al directorio del proyecto
cd Proyecto_final_AD

# Eliminar contenedores anteriores (si existen)
docker-compose down --remove-orphans -v

# Iniciar los 3 nodos
docker-compose up -d

# Verificar estado
docker-compose ps
```




##  Acceso a los Nodos

### NODO 1
| Servicio | URL | Acceso |
|----------|-----|--------|
| **Aplicación** | `http://localhost:5000` | - |
| **PhpMyAdmin** | `http://localhost:8081` | Usuario: `admin` / Contraseña: `abc123` |
| **MySQL** | `localhost:3308` | Usuario: `admin` / Contraseña: `abc123` |

### NODO 2
| Servicio | URL | Acceso |
|----------|-----|--------|
| **Aplicación** | `http://localhost:5001` | - |
| **PhpMyAdmin** | `http://localhost:8082` | Usuario: `admin` / Contraseña: `abc123` |
| **MySQL** | `localhost:3309` | Usuario: `admin` / Contraseña: `abc123` |

### NODO 3
| Servicio | URL | Acceso |
|----------|-----|--------|
| **Aplicación** | `http://localhost:5002` | - |
| **PhpMyAdmin** | `http://localhost:8083` | Usuario: `admin` / Contraseña: `abc123` |
| **MySQL** | `localhost:3310` | Usuario: `admin` / Contraseña: `abc123` |

##  Credenciales (Iguales para todos los nodos)

```
Usuario MySQL: admin
Contraseña MySQL: abc123
Usuario Root MySQL: root
Contraseña Root: root
Base de datos: salas
```

##  Caracteristicas

- ✅ Sistema de autenticación (registro, login, logout)
- ✅ Gestión de salas (crear, buscar, listar)
- ✅ Interfaz de usuario moderna y minimalista
- ✅ Validación de formularios en tiempo real
- ✅ Diseño responsive
- ✅ 3 nodos independientes con BD separadas
- ✅ Persistencia de datos con volúmenes Docker
- ✅ Health checks en bases de datos

##  Rutas de la Aplicación

### Páginas del Frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a la página de login |
| `/login` | Página de inicio de sesión |
| `/register` | Página de registro de usuarios |
| `/dashboard` | Panel principal con gestión de salas |

### Endpoints de la API

#### Autenticación (`/auth`)

| Método | Endpoint         | Descripción                | Body (JSON)                                              |
| :----- | :--------------- | :------------------------- | :------------------------------------------------------- |
| `POST` | `/auth/register` | Registrar un nuevo usuario | `{"username": "...", "email": "...", "password": "..."}` |
| `POST` | `/auth/login`    | Iniciar sesión             | `{"email": "...", "password": "..."}`                    |
| `POST` | `/auth/logout`   | Cerrar sesión actual       | _Vacío_                                                  |

#### Salas (`/sala`)

| Método | Endpoint             | Descripción              | Body (JSON)                                                               |
| :----- | :------------------- | :------------------------| :-------------------------------------------------------------------------|
| `POST` | `/sala/create`       | Crear nueva sala         | `{"nombre": "...", "codigo": "...", "capacidad": "...", "userid": "..."}` |
| `GET`  | `/sala/codigo/<codigo>` | Buscar sala por código | _Ninguno_                                                                 |
| `GET`  | `/sala/all`          | Listar todas las salas   | _Ninguno_                                                                 |

#### General

| Método | Endpoint      | Descripción                                  |
| :----- | :------------ | :------------------------------------------- |
| `GET`  | `/api/status` | Verificar estado del servicio (Health Check) |



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

