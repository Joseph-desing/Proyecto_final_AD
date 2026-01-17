from flask import Blueprint, request, jsonify, session
from models.user_models import UserModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Ruta para registrar un nuevo usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # 1. Obtener datos de la request
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # 2. Validaciones
        if not username or not email or not password:
            return jsonify({'error': 'Todos los campos son requeridos'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'El nombre del usuario debe tener al menos 3 caracteres'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Email inválido'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        isEmailExit = UserModel.verifyEmail(email)
        if isEmailExit:
            return jsonify({'error': 'El email ya está registrado'}), 409
        
        # 3. Procesamiento
        isUserCreated = UserModel.createUser(username, email, password)
        
        # 4. Respuesta
        if isUserCreated:
            return jsonify({'message': 'Usuario registrado exitosamente'}), 201
        else:
            return jsonify({'error': 'Error al crear el usuario'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para login de usuario
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Todos los campos son requeridos'}), 400
        
        user = UserModel.verifyUser(email, password)
        
        if user:
            session['userid'] = user[0]  
            session['username'] = user[1] 
            session['email'] = user[2]  
            return jsonify({
                'message': 'Login exitoso',
                'userid': user[0],
                'username': user[1],
                'email': user[2]
            }), 200
        else:
            return jsonify({'error': 'Credenciales inválidas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para cerrar sesión
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200