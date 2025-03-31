import os
from flask import Flask
from routes import register_routes

# Paths
template_dir = os.path.abspath('../frontend/templates')
static_dir = os.path.abspath('../frontend/static')

# Flask App Initialization
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir, static_url_path='/static')

# Register Routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)