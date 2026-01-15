from flask import Flask, render_template, request, redirect, url_for, jsonify
import pymysql
import config
import os

app = Flask(__name__)

# Configuración de la aplicación
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Configuración de la base de datos MySQL
app.config['MYSQL_HOST'] = config.Config.MYSQL_HOST
app.config['MYSQL_USER'] = config.Config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.Config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.Config.MYSQL_DB
app.config['MYSQL_PORT'] = config.Config.MYSQL_PORT

# Función para obtener conexión a la base de datos
def get_db():
    return pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT']
    )

# Registrar blueprints
from routes.auth_routes import auth_bp
app.register_blueprint(auth_bp)

# Ruta principal
@app.route('/', methods=['GET'])
def formulario():
    return jsonify({
        'status': 'online',
        'message': 'Servicio de gestión de salas activo',
        'endpoints': {
            'register': '/auth/register',
            'login': '/auth/login',
            'logout': '/auth/logout',
            'me': '/auth/me'
        }
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0')

