import os
from flask import Flask, render_template, jsonify
from parser import parse_all_courses

template_dir = os.path.abspath('../frontend/templates/')
static_dir = os.path.abspath('../frontend/static/')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/parse')
def parse_data():
    jsonify(parse_all_courses())
    return index()

if __name__ == "__main__":
    app.run(debug=True)
