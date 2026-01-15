from flask import Blueprint, request, jsonify, session
from models.user_models import UserModel

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Ruta para registrar un nuevo usuario
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Validaciones
        if not username or not email or not password:
            return jsonify({'error': 'Username, email y password son requeridos'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'El username debe tener al menos 3 caracteres'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Email inválido'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        # Verificar si el usuario ya existe
        existing_user = UserModel.get_user_by_username(username)
        if existing_user:
            return jsonify({'error': 'El usuario ya existe'}), 409
        
        # Verificar si el email ya existe
        existing_email = UserModel.get_user_by_email(email)
        if existing_email:
            return jsonify({'error': 'El email ya está registrado'}), 409
        
        # Crear usuario
        user_id = UserModel.create_user(username, email, password)
        
        if user_id:
            return jsonify({
                'message': 'Usuario registrado exitosamente',
                'userid': user_id,
                'username': username,
                'email': email
            }), 201
        else:
            return jsonify({'error': 'Error al crear el usuario'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para login de usuario
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Validaciones
        if not username or not password:
            return jsonify({'error': 'Username y password son requeridos'}), 400
        
        # Verificar credenciales
        user = UserModel.verify_password(username, password)
        
        if user:
            # Crear sesión
            session['user_id'] = user[0]  
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
    """Ruta para cerrar sesión"""
    session.clear()
    return jsonify({'message': 'Sesión cerrada exitosamente'}), 200

