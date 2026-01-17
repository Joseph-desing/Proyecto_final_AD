class SalaModel:
    @staticmethod
    def createSala(nombre, codigo, capacidad, userid):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO salas (nombre, codigo, capacidad, userid) VALUES (%s, %s, %s, %s)",
                (nombre, codigo, capacidad, userid)
            )
            connection.commit()
            cursor.close()
            connection.close()
            return True
        except Exception as e:
            return False
    
    @staticmethod
    def verifySala(codigo):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM salas WHERE codigo = %s", (codigo,))
            isSalaExist = cursor.fetchone()
            cursor.close()
            connection.close()
            return isSalaExist is not None
        except Exception as e:
            return False
    
    @staticmethod
    def getSalaByCode(codigo):
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM salas WHERE codigo = %s", (codigo,))
            sala = cursor.fetchone()
            cursor.close()
            connection.close()
            return sala
        except Exception as e:
            return None
    
    @staticmethod
    def getAllSalas():
        try:
            from app import get_db
            connection = get_db()
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM salas")
            salas = cursor.fetchall()
            cursor.close()
            connection.close()
            return salas
        except Exception as e:
            return None
