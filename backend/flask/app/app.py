from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__, static_folder='static')

CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/')
def hello1():
    return render_template('index.html')

@app.route('/react_label_ui')
@app.route('/react_label_ui/')
@app.route('/react_label_ui/<path:path>')
def hello(path=None):
    return render_template('build/index.html')

@app.route('/flask_to_react')
def flask_to_react():
    return render_template('index.html', id=1)