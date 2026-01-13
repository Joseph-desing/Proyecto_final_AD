from flask import Flask
import socket

app = Flask(__name__)

@app.route("/")
def index():
    return f"Respuesta desde el contenedor: {socket.gethostname()}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
