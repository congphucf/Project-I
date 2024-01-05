from flask import Flask, request, jsonify
from flask_cors import CORS
from addexam import app as addexam_router
from getexam import app as getexam_router
from score import app as score

app = Flask(__name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type"])

@app.route('/')
def home():
    return 'Hello from Main Route'

app.register_blueprint(addexam_router, url_prefix='/router1')
app.register_blueprint(getexam_router, url_prefix="/router2")
app.register_blueprint(score, url_prefix="/router3")

if __name__ == '__main__':
    app.run()
