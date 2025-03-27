import re
import requests
import json
import sys

BASE_URL = "http://plan.ii.us.edu.pl"

# ----------------------------------------------------------------------
# Wzorce do wyszukiwania kierunków i linków na górnym poziomie

# branch(1,28698,0,'Informatyka Stosowana I stopnia');
pattern_kierunki_branch = re.compile(
    r"branch\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\d+\s*,\s*'([^']+)'\s*\);"
)

# <a href="#" onclick="hide(28698);"><img ...></a><span>Informatyka</span>
pattern_kierunki_hide = re.compile(
    r'<a\s+href="#"\s+onclick="(?:hide|show)\((\d+)\);".*?<\/a>\s*<span[^>]*>([^<]+)</span>',
    re.DOTALL
)

# <a href="plan.php?type=XX&id=YYYY" ...>Tekst</a>
pattern_link = re.compile(
    r'<a[^>]+href="plan\.php\?type=(\d+)&amp;id=(\d+)"[^>]*>([^<]+)</a>'
)

# get_left_tree_branch('31429','img_31429','div_31429','2','1');
pattern_kierunki_onclick_with_span = re.compile(
    r"get_left_tree_branch\(\s*'(\d+)'\s*,\s*'img_\1'\s*,\s*'div_\1'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\).*?<span[^>]*>([^<]+)</span>",
    re.DOTALL
)


def get_html(url, params=None):
    """
    Funkcja obsługi pobierania HTML.
    Przygotowuję odpowiednie kodowanie, metody poprawiania znaków w języku polskim.
    """
    resp = requests.get(url, params=params)
    resp.encoding = resp.apparent_encoding
    return resp.text


def parse_subgroups(html, parent_name):
    """
    Szukamy <a href="plan.php?type=..&id=.."> wewnątrz przekazanego kodu HTML.
    Zwróć słownik: { "Nazwa": {"ID": X, "Podgrupa": {}}, ... }.
    Jeśli tekst linku == nazwa_rodzica, pomiń go (unikaj duplikatów).
    """
    # print(html, file = sys.stderr)

    result = {}
    for match in pattern_link.finditer(html):
        print(match, file = sys.stderr)
        link_type, link_id, link_text = match.groups()
        link_text = link_text.strip()
        if link_text == parent_name:
            continue
        result[link_text] = {
            "ID": int(link_id),
            "Podgrupy": {}
        }
    return result


def build_structure(parent_type, parent_id, parent_name):
    """
    Funkcja rekurencyjna. Najpierw składamy wniosek
    left_menu_feed.php?type=parent_type&branch=parent_id&link=1 (lub link=0 w razie potrzeby).
    Następnie szukamy linków <a ...>, tworzymy sub_dict.
    Dla każdego elementu sub_dict sprawdzamy, czy istnieje ten sam kod HTML
    onclick="get_left_tree_branch('ID','img_ID','div_ID','X','Y')".
    Jeśli tak, użyj (X, Y) w rekurencji.
    Jeśli nie, kontynuuj (typ_rodzica, link=1).
    """
    link_value = 1

    # print(parent_name, file = sys.stderr)

    params = {"type": 1, "branch": parent_id, "link": link_value}
    html = get_html(f"{BASE_URL}/left_menu_feed.php", params=params)
    print(html, file = sys.stderr)
    print(params, file = sys.stderr)
    
    sub_dict = parse_subgroups(html, parent_name)

    # Dla każdego elementu sub_dict sprawdzamy onclick
    for sub_name, sub_data in sub_dict.items():
        sub_id = sub_data["ID"]

        onclick_pattern = re.compile(
            rf"get_left_tree_branch\(\s*'{sub_id}'\s*,\s*'img_{sub_id}'\s*,\s*'div_{sub_id}'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\)"
        )
        match_onclick = onclick_pattern.search(html)

        if match_onclick:
            # Jeśli znaleźliśmy onclick, użyj X, Y
            new_type = int(match_onclick.group(1))
            new_link = int(match_onclick.group(2))
            sub_data["Podgrupy"] = build_structure_click(new_type, sub_id, sub_name, new_link)
        else:
            # W przeciwnym razie kontynuujemy ze starymi wartościami (typ_rodzica, wartość_linku)
            sub_data["Podgrupy"] = build_structure_click(parent_type, sub_id, sub_name, link_value)

    return sub_dict


def build_structure_click(next_type, next_id, parent_name, link_value):
    """
    Funkcja pomocnicza podobna do build_structure, ale węższa
    z konkretnym (typem, łączem) w argumentach.
    """
    params = {"type": next_type, "branch": next_id, "link": link_value}
    html = get_html(f"{BASE_URL}/left_menu_feed.php", params=params)
    sub_dict = parse_subgroups(html, parent_name)

    for sub_name, sub_data in sub_dict.items():
        sub_id = sub_data["ID"]
        onclick_pattern = re.compile(
            rf"get_left_tree_branch\(\s*'{sub_id}'\s*,\s*'img_{sub_id}'\s*,\s*'div_{sub_id}'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\)"
        )
        match_onclick = onclick_pattern.search(html)
        if match_onclick:
            child_type = int(match_onclick.group(1))
            child_link = int(match_onclick.group(2))
            sub_data["Podgrupy"] = build_structure_click(child_type, sub_id, sub_name, child_link)
        else:
            sub_data["Podgrupy"] = build_structure_click(next_type, sub_id, sub_name, link_value)

    return sub_dict


def parse_all_courses():
    """
    Główny punkt wywołania:
    1) Pobierz HTML z /left_menu.php
    2) Poszukujemy kursów (kierunki) poprzez:
       - oddział(...)
       - onclick="ukryj(...)"
       - <a href="plan.php?type=..&id=..">...
       - onclick="get_left_tree_branch(...)"
    3) Dla każdego kursu wywołaj build_structure i wygeneruj JSON
    4) Zapisz dane do kursy.json
    """
    main_html = get_html(f"{BASE_URL}/left_menu.php")
    kierunki_map = {}

    for match in pattern_kierunki_branch.finditer(main_html):
        sType, sId, nazwa = match.groups()
        kurs_type = int(sType)
        kurs_id = int(sId)
        kierunki_map[kurs_id] = (kurs_type, nazwa.strip())

    for match in pattern_kierunki_hide.finditer(main_html):
        sId, nazwa = match.groups()
        kurs_id = int(sId)
        if kurs_id not in kierunki_map:
            kierunki_map[kurs_id] = (1, nazwa.strip())

    for match in pattern_link.finditer(main_html):
        link_type, link_id, link_text = match.groups()
        kurs_id = int(link_id)
        if kurs_id not in kierunki_map:
            kierunki_map[kurs_id] = (int(link_type), link_text.strip())

    for match in pattern_kierunki_onclick_with_span.finditer(main_html):
        sId, typ, link, nazwa = match.groups()
        kurs_id = int(sId)
        if kurs_id not in kierunki_map:
            kierunki_map[kurs_id] = (int(typ), nazwa.strip())

    result = {"courses": []}


    # print(kierunki_map, file = sys.stderr)
    for kurs_id, (kurs_type, kurs_nazwa) in kierunki_map.items():
        lata_dict = build_structure(kurs_type, kurs_id, kurs_nazwa)

        lata_output = {}
        for rok_name, rok_data in lata_dict.items():
            lata_output[rok_name] = {
                "ID": rok_data["ID"],
                "Grupy": rok_data["Podgrupy"]
            }

        kurs_entry = {
            "Nazwa_Kierunku": kurs_nazwa,
            "ID_KIER": kurs_id,
            "Lata": lata_output
        }
        result["courses"].append(kurs_entry)

    with open("kursy.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result
