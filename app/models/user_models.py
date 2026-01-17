from werkzeug.security import generate_password_hash, check_password_hash

class UserModel:
    # Crear nuevo usuario
    @staticmethod
    def createUser(username, email, password):
        try:
            passwordHash = generate_password_hash(password)
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO usuarios (username, email, password) VALUES (%s, %s, %s)",
                (username, email, passwordHash)
            )
            connection.commit()
            cursor.close()
            connection.close()
            return True
        except Exception as e:
            return False

    # Verificar si el email existe
    @staticmethod
    def verifyEmail(email):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT email FROM usuarios WHERE email = %s",
                (email,)
            )
            isEmailExist = cursor.fetchone()
            cursor.close()
            connection.close()
            return isEmailExist is not None
        except Exception as e:
            return False

    # Obtener usuario por email
    @staticmethod
    def getUser(email):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM usuarios WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
        except Exception as e:
            return None

    # Verificar credenciales del usuario
    @staticmethod
    def verifyUser(email, password):
        user = UserModel.getUser(email)
        if user and check_password_hash(user[3], password):
            return user
        return None

    # Eliminar usuario
    @staticmethod
    def deleteUser(user_id):
        try:
            from app import get_db
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
    
    # Verificar usuario por id
    @staticmethod
    def verifyUserById(userid):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM usuarios WHERE userid = %s",
                (userid,)
            )
            user = cursor.fetchone()
            cursor.close()
            connection.close()
            return user
        except Exception as e:
            return None