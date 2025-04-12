import math
import re
import requests
import json

BASE_URL = "http://plan.ii.us.edu.pl"


def get_html_for_group(group_id):
    """
    Wykonuje zapytanie HTTP, pobierając HTML dla danej grupy.
    """
    url = f"{BASE_URL}/plan.php"
    params = {
        "type": 0,
        "id": group_id,
        "winW": 1694,
        "winH": 940,
        "loadBG": "000000"
    }
    resp = requests.get(url, params=params)
    resp.encoding = resp.apparent_encoding
    return resp.text


def px_to_time(top_px, round_mode="nearest"):
    """
    Przelicza wartość top (px) na czas.
    Zasada: top=215px odpowiada 8:00, każda 11px dodaje 15 minut.

    Parametr round_mode określa metodę zaokrąglenia:
      - "down": zaokrąglenie w dół (dla początku zajęć)
      - "up": zaokrąglenie w górę (dla zakończenia zajęć)
      - "nearest": zwykłe zaokrąglenie (jeśli tryb nie jest określony)

    Obliczenia:
      steps = (top_px - 215) / 11 (zaokrąglane wg wskazanej reguły)
      dodane_minuty = steps * 15
      całkowity_czas = 8*60 + dodane_minuty
    Wynik zwracany jest w formacie HHMM.
    """
    base = 215
    offset = top_px - base
    if offset < 0:
        offset = 0

    if round_mode == "up":
        steps = math.ceil(offset / 11.0)
    elif round_mode == "down":
        steps = math.floor(offset / 11.0)
    else:
        steps = int(round(offset / 11.0))

    minutes_added = steps * 15
    total_minutes = 8 * 60 + minutes_added
    hour = total_minutes // 60
    minute = total_minutes % 60
    return hour * 100 + minute


def define_day_from_left(left_px):
    """
    Określa dzień tygodnia na podstawie wartości left.
    Zasada: left=87px odpowiada poniedziałkowi, co 306px kolejny dzień.
    """
    try:
        left_px = int(left_px)
    except:
        left_px = 0
    base = 87
    ratio = (left_px - base) / 306.0
    day_index = int(round(ratio))
    mapping = {0: "PN", 1: "WT", 2: "SR", 3: "CZ", 4: "PT"}
    return mapping.get(day_index, "PT")


def parse_course_details(html_content):
    """
    Wydobywa szczegóły kursu z zawartości bloku.
    Zwraca słownik z kluczami:
      Subject, Teacher, TeacherID, Room, RoomID, Semester.
    """
    lines = re.split(r'<br\s*/?>', html_content, flags=re.IGNORECASE)
    # Usuwamy tagi HTML i zbędne spacje
    lines = [re.sub(r'<[^>]*>', '', line).strip() for line in lines if line.strip()]

    teacher_id_match = re.search(r'plan\.php\?type=10&id=(\d+)', html_content)
    teacher_id = teacher_id_match.group(1) if teacher_id_match else ""

    teacher_name_match = re.search(r'plan\.php\?type=10&id=\d+">(.*?)</a>', html_content)
    teacher_name = teacher_name_match.group(1).strip() if teacher_name_match else ""

    room_id_match = re.search(r'plan\.php\?type=20&id=(\d+)', html_content)
    room_id = room_id_match.group(1) if room_id_match else ""

    room_match = re.search(r'plan\.php\?type=20&id=\d+">(.*?)</a>', html_content)
    room = room_match.group(1).strip() if room_match else ""

    sem_match = re.search(r'(Sem\.\s*\w+)', html_content, re.IGNORECASE)
    semester = sem_match.group(1).strip() if sem_match else ""

    subject = lines[0] if lines else "Brak tytułu"
    subject = re.sub(r',?\s*sem\s*$', '', subject, flags=re.IGNORECASE).strip()

    return {
        "Subject": subject,
        "Teacher": teacher_name,
        "TeacherID": teacher_id,
        "Room": room,
        "RoomID": room_id,
        "Semester": semester
    }


def parse_schedule(html_text):
    """
    Parsuje stronę HTML z rozkładem zajęć i wydobywa informacje o zajęciach.
    Czas rozpoczęcia obliczany jest za pomocą px_to_time z zaokrągleniem w dół,
    czas zakończenia – zaokrąglany w górę, jeśli podany jest height.
    Dzień tygodnia określany jest funkcją define_day_from_left.
    """
    schedule = {"PN": [], "WT": [], "SR": [], "CZ": [], "PT": []}
    event_pattern = re.compile(
        r'<div[^>]+class="[^"]*(?:arrow_course|coursediv)[^"]*"[^>]+style="([^"]+)"[^>]*>(.*?)</div>',
        re.DOTALL | re.IGNORECASE
    )

    matches = event_pattern.findall(html_text)
    if not matches:
        return schedule

    for style_attr, content in matches:
        # Wydobywamy top i left ze stylu
        top_match = re.search(r'top:\s*(\d+)px', style_attr)
        left_match = re.search(r'left:\s*(\d+)px', style_attr)
        if not top_match or not left_match:
            continue
        top_px = int(top_match.group(1))
        left_px = int(left_match.group(1))

        # Dla początku zajęć używamy zaokrąglenia w dół
        start_time = px_to_time(top_px, round_mode="down")
        # Jeśli jest podany height – obliczamy zakończenie przy użyciu zaokrąglenia w górę
        height_match = re.search(r'height:\s*(\d+)px', style_attr)
        if height_match:
            height_px = int(height_match.group(1))
            end_time = px_to_time(top_px + height_px, round_mode="up")
        else:
            end_time = start_time + 90

        day = define_day_from_left(left_px)
        details = parse_course_details(content)
        # Jeśli nazwa przedmiotu jest nieobecna – pomijamy wpis
        if details["Subject"].strip().lower() == "brak tytułu":
            continue

        entry = {
            "Subject": details["Subject"],
            "Start": start_time,
            "End": end_time,
            "Teacher": details["Teacher"],
            "TeacherID": details["TeacherID"],
            "Room": details["Room"],
            "RoomID": details["RoomID"],
            "Semester": details["Semester"]
        }
        schedule[day].append(entry)

    return schedule


def get_schedule_for_group(group_id):
    """
    Pobiera rozkład zajęć dla danej grupy na podstawie jej ID:
      - Wykonuje zapytanie do zewnętrznej strony,
      - Parsuje otrzymany HTML za pomocą parse_schedule,
      - Zwraca strukturę rozkładu zajęć lub None w przypadku błędu.
    """
    try:
        group_id = int(group_id)
    except ValueError:
        return None
    try:
        html_text = get_html_for_group(group_id)
        sched = parse_schedule(html_text)
        return sched
    except Exception as e:
        print("Błąd podczas pobierania rozkładu zajęć:", e)
        return None
