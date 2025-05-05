import os
from flask import Flask
from routes import register_routes

template_dir = os.environ.get("TEMPL_PATH", os.path.abspath('../frontend/templates'))
static_dir = os.environ.get("STAT_DIR", os.path.abspath('../frontend/static'))

#Debug
debug_var = os.environ.get("DEBUG", False)
if debug_var: 
    debug_var = True

# Flask App Initialization
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir, static_url_path='/static')

# Register Routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=debug_var)