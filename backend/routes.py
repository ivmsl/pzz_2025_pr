from flask import render_template, request, redirect, url_for, Response, jsonify, send_from_directory
from modules.parser import parse_all_courses
from modules.fun_clean_html import update_all_main
from modules.jsonloadtest import get_mock_resp

import sys

BASE_URL = "http://plan.ii.us.edu.pl"

def register_routes(app):

    @app.route('/')
    def index():
        return render_template("index.html")

    @app.route('/menug.php')
    def menug():
        return render_template("menug.html")

    @app.route('/main.php')
    def mainmenu():
        return render_template("main.html")

    @app.route('/left_menu.php')
    def leftmenutemp():
        return render_template("left_menu.html")

    @app.route('/left_menu_feed.php', methods = ['GET', 'POST', 'DELETE'])
    def data_from_json():
        branch_param = request.args.get('branch')
        bOne = request.args.get('bOne')
        try:
            branch_param = int(branch_param)
            response_text = get_mock_resp(branch_param, bOne)
        except:
            response_text = ""
        return response_text

    @app.route('/js/<filename>')
    def jsredirect(filename):
        return redirect(url_for('static', filename=f'js/{filename}'))

    @app.route('/css/<filename>')
    def cssredirect(filename):
        return redirect(url_for('static', filename=f'css/{filename}'))

    @app.route('/images/<filename>')
    def imagesredirect(filename):
        return redirect(url_for('static', filename=f'images/{filename}'))

    @app.route('/parse')
    def parse_data():
        return jsonify(parse_all_courses())

    @app.route('/updmenu')
    def updmenu():
        update_all_main()
        return index()