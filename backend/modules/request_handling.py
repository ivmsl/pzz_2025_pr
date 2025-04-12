import os
import json
import requests
from .get_schedule_for_group import get_schedule_for_group

BASE_URL = "http://plan.ii.us.edu.pl"


def load_kursy():
    json_path = os.path.join(os.path.dirname(__file__), "kursy.json")
    if not os.path.exists(json_path):
        return None
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def get_course_list():
    data = load_kursy()
    if not data or "courses" not in data:
        return {}
    result = {}
    for course in data["courses"]:
        name = course.get("Nazwa_Kierunku")
        course_id = course.get("ID_KIER")
        if name and course_id is not None:
            result[name] = course_id
    return result


def get_course_structure(course_id):
    data = load_kursy()
    if not data or "courses" not in data:
        return None
    try:
        course_id = int(course_id)
    except ValueError:
        return None
    for course in data["courses"]:
        if course.get("ID_KIER") == course_id:
            return course.get("Lata", {})
    return None
