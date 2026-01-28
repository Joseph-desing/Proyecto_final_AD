import requests
from collections import Counter

respuestas = []
url = 'http://localhost:8084'

print(f"Realizando 100 peticiones a {url}...")

for i in range(100):
    try:
        respuesta = requests.get(url)
        # Aquí extraemos solo los primeros 50 caracteres del HTML 
        # o buscamos una palabra clave para que no se imprima todo
        texto_limpio = respuesta.text.strip()
        
        # Si el nombre del servidor aparece en el HTML, lo buscamos:
        if "app_salas_1" in texto_limpio:
            respuestas.append("Instancia 1 (app1)")
        elif "app_salas_2" in texto_limpio:
            respuestas.append("Instancia 2 (app2)")
        elif "app_salas_3" in texto_limpio:
            respuestas.append("Instancia 3 (app3)")
        else:
            # Si no está el nombre, guardamos un resumen para identificar que respondió
            respuestas.append("Respuesta HTML recibida")
            
    except Exception as e:
        respuestas.append(f"Error: {e}")

contador = Counter(respuestas)

print("\n--- Resultados del Balanceo de Carga ---")
for instancia, cantidad in contador.items():
    porcentaje = (cantidad / 100) * 100
    print(f"Servidor: {instancia} | Peticiones: {cantidad} ({porcentaje}%)")