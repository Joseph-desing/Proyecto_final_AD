from flask import Blueprint, request, jsonify, session
from models.sala_models import SalaModel
from models.user_models import UserModel

sala_bp = Blueprint('sala', __name__, url_prefix='/sala')

# Ruta para crear una nueva sala
@sala_bp.route('/create', methods=['POST'])
def createSala():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        codigo = data.get('codigo')
        capacidad = data.get('capacidad')
        userid = data.get('userid')

        if not nombre or not codigo or not capacidad or not userid:
            return jsonify({'error': 'Todos los campos son obligatorios'}), 400
        
        if not UserModel.verifyUserById(userid):
            return jsonify({'error': 'El usuario no existe'}), 404

        if SalaModel.verifySala(codigo):
            return jsonify({'error': 'El codigo de la sala ya existe'}), 409

        if SalaModel.createSala(nombre, codigo, capacidad, userid):
            return jsonify({'message': 'Sala creada exitosamente'}), 201
        else:
            return jsonify({'error': 'Error al crear la sala'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500