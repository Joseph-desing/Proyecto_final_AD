from werkzeug.security import generate_password_hash, check_password_hash

# Modelo de usuario
class UserModel:
    # Crear nuevo usuario
    @staticmethod
    def create_user(username, email, password):
        from app import get_db
        try:
            password_hash = generate_password_hash(password)
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO usuarios (username, email, password) VALUES (%s, %s, %s)",
                (username, email, password_hash)
            )
            connection.commit()
            user_id = cursor.lastrowid
            cursor.close()
            connection.close()
            return user_id
        except Exception as e:
            return None
    
    # Obtener usuario por username
    @staticmethod
    def get_user_by_username(username):
        from app import get_db
        try:
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT userid, username, email, password FROM usuarios WHERE username = %s",
                (username,)
            )
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
        except Exception as e:
            return None
    
    # Obtener usuario por email
    @staticmethod
    def get_user_by_email(email):
        from app import get_db
        try:
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT userid, username, email, password FROM usuarios WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
        except Exception as e:
            return None
    
    # Obtener usuario por ID
    @staticmethod
    def get_user_by_id(user_id):
        from app import get_db
        try:
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT userid, username, email FROM usuarios WHERE userid = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
        except Exception as e:
            return None
    
    # Verificar contraseña del usuario
    @staticmethod
    def verify_password(username, password):
        user = UserModel.get_user_by_username(username)
        if user and check_password_hash(user[3], password):  # user[3] es password
            return user
        return None
    
    # Obtener todos los usuarios
    @staticmethod
    def get_all_users():
        from app import get_db
        try:
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute("SELECT userid, username, email FROM usuarios")
            users = cursor.fetchall()
            cursor.close()
            connection.close()
            return users
        except Exception as e:
            return []
    
    # Eliminar usuario
    @staticmethod
    def delete_user(user_id):
        from app import get_db
        try:
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "DELETE FROM usuarios WHERE userid = %s",
                (user_id,)
            )
            connection.commit()
            cursor.close()
            connection.close()
            return True
        except Exception as e:
            return False
    
    # Obtener usuario por email
    @staticmethod
    def get_user_by_email(mysql, email):
        try:
            connection = mysql.get_connection()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT userid, username, email, password FROM usuarios WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            cursor.close()
            return user
        except Exception as e:
            return None
    
    # Verificar contraseña
    @staticmethod
    def verify_password(mysql, username, password):
        user = UserModel.get_user_by_username(mysql, username)
        if user and check_password_hash(user[3], password):  
            return user
        return None
    