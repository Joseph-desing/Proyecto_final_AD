# Proyecto Final - Aplicaciones Distribuidas

Este proyecto es una aplicación web desarrollada en Flask para la gestión de salas. Incluye un sistema de autenticación de usuarios y está contenerizada utilizando Docker.

## Descripción

La aplicación permite el registro y autenticación de usuarios, sirviendo como base para un sistema de gestión de reservas o administración de salas. Utiliza MySQL como base de datos y está diseñada para ser desplegada fácilmente mediante Docker Compose.

## Endpoints Disponibles

La API cuenta con los siguientes endpoints principales:

### Autenticación (`/auth`)

| Método | Endpoint         | Descripción                | Body (JSON)                                              |
| :----- | :--------------- | :------------------------- | :------------------------------------------------------- |
| `POST` | `/auth/register` | Registrar un nuevo usuario | `{"username": "...", "email": "...", "password": "..."}` |
| `POST` | `/auth/login`    | Iniciar sesión             | `{"email": "...", "password": "..."}`                    |
| `POST` | `/auth/logout`   | Cerrar sesión actual       | _Vacio_                                                  |

### Salas (`/sala`)

| Método | Endpoint       | Descripción      | Body (JSON)                                                                         |
| :----- | :------------- | :--------------- | :---------------------------------------------------------------------------------- |
| `POST` | `/sala/create` | Crear nueva sala | `{"nombre": "...", "codigo": "...", "capacidad": 10, "disponible": 1, "userid": 1}` |

### General

| Método | Endpoint | Descripción                                  |
| :----- | :------- | :------------------------------------------- |
| `GET`  | `/`      | Verificar estado del servicio (Health Check) |

## Ejecución

Para levantar el proyecto, asegúrate de tener Docker instalado y ejecuta:

```bash
docker compose up --build
```
