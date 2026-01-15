import os

# Configuración de conexión a MySQL
class Config:
  MYSQL_HOST = os.getenv('DB_HOST', 'localhost')
  MYSQL_PORT = int(os.getenv('DB_PORT', 3306))
  MYSQL_DB = os.getenv('DB_NAME', 'salas')
  MYSQL_USER = os.getenv('DB_USER', 'admin')
  MYSQL_PASSWORD = os.getenv('DB_PASSWORD', 'abc123')
  