from flask import render_template, request, redirect, url_for, jsonify, abort
from modules.request_handling import get_course_list, get_course_structure, get_schedule_for_group
from modules.parser import parse_all_courses
from modules.fun_clean_html import update_all_main, get_html
from modules.jsonloadtest import get_mock_resp

BASE_URL = "http://plan.ii.us.edu.pl"

def register_routes(app):

    @app.route('/api/pselector', methods=['GET'])
    def api_pselector():
        if len(request.args) == 0:
            courses = get_course_list()
            return jsonify(courses), 200

        valid_params = set(['id_kier'])
        req_params = set(request.args.keys())
        if not req_params.issubset(valid_params):
            return abort(404, description="Not Found")

        id_kier = request.args.get('id_kier')
        try:
            int(id_kier)
        except ValueError:
            return jsonify({"error": "Nie znaleziono kierunku"}), 404

        structure = get_course_structure(id_kier)
        if structure is None:
            return jsonify({"error": "Nie znaleziono kierunku"}), 404
        return jsonify(structure), 200

    @app.route('/api/getplan', methods=['GET'])
    def api_getplan():
        group_id = request.args.get('for')
        if not group_id:
            return jsonify({"error": "Missing 'for' parameter"}), 404

        try:
            int(group_id)
        except ValueError:
            return jsonify({"error": "Invalid group id"}), 404

        schedule = get_schedule_for_group(group_id)
        if schedule is None:
            return jsonify({"error": "Nie znaleziono planu. Może on jeszcze nie został umieszczony"}), 404
        return jsonify(schedule), 200

    @app.route('/')
    def index():
        return render_template("index.html")

    @app.route('/plan.php')
    def left_menu():
        text = get_html(f"{BASE_URL}/plan.php", params=request.args)
        return text

    @app.route('/menug.php')
    def menug():
        return render_template("menug.html")

    @app.route('/main.php')
    def mainmenu():
        return render_template("main.html")

    @app.route('/left_menu.php')
    def leftmenutemp():
        return render_template("left_menu.html")

    @app.route('/left_menu_feed.php', methods=['GET', 'POST', 'DELETE'])
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