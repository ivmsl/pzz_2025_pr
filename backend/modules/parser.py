import re
import requests
import json
import sys

BASE_URL = "http://plan.ii.us.edu.pl"

# -----------------------------
# Wzorce do identyfikacji elementów w HTML

# Wzorzec dla wywołania branch(...) – identyfikuje kierunki
pattern_kierunki_branch = re.compile(
    r"branch\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\d+\s*,\s*'([^']+)'\s*\);"
)

# Wzorzec dla elementów ukrytych (hide/show) z nazwą kierunku
pattern_kierunki_hide = re.compile(
    r'<a\s+href="#"\s+onclick="(?:hide|show)\((\d+)\);".*?</a>\s*<span[^>]*>([^<]+)</span>',
    re.DOTALL
)

# Wzorzec dla linków do stron z planem
pattern_link = re.compile(
    r'<a[^>]+href="plan\.php\?type=(\d+)&amp;id=(\d+)"[^>]*>([^<]+)</a>'
)

# Wzorzec dla wywołań get_left_tree_branch(...) wraz z nazwą w elemencie span
pattern_kierunki_onclick_with_span = re.compile(
    r"get_left_tree_branch\(\s*'(\d+)'\s*,\s*'img_\1'\s*,\s*'div_\1'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\).*?<span[^>]*>([^<]+)</span>",
    re.DOTALL
)

# Wzorzec dla "płaskich" elementów li (bez dynamicznego ładowania)
pattern_plain_course_generic = re.compile(
    r'<li\s+id="(\d+)"[^>]*>.*?<span[^>]*>([^<]+)</span>',
    re.DOTALL
)

# Wzorce pomocnicze dla rekurencyjnego przeglądu elementów li
pattern_li = re.compile(r"<li[^>]*>(.*?)</li>", re.DOTALL)
pattern_branch = re.compile(
    r"branch\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)"
)
pattern_get_left_tree_branch = re.compile(
    r"get_left_tree_branch\(\s*'(\d+)'\s*,\s*'img_\1'\s*,\s*'div_\1'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\)"
)

# -----------------------------
# Funkcje do wysyłania zapytań

def get_feed_html(params=None, **kwargs):
    """
    Wysyła zapytanie GET do left_menu_feed.php z dodatkowymi parametrami:
    bOne=1 oraz iPos="NaN". Parametry dodatkowe można przekazać przez kwargs.
    """
    base_params = {"bOne": 1, "iPos": "NaN"}
    if params:
        combined = {**params, **base_params}
    else:
        combined = base_params
    combined.update(kwargs)
    resp = requests.get(f"{BASE_URL}/left_menu_feed.php", params=combined)
    resp.encoding = resp.apparent_encoding
    return resp.text

def get_html(url, params=None):
    """
    Standardowe zapytanie GET – używane głównie do pobierania strony left_menu.php.
    """
    resp = requests.get(url, params=params)
    resp.encoding = resp.apparent_encoding
    return resp.text

def post_req(url, params=None):
    """
    Zapytanie POST – niezbędne, jeśli strona tego wymaga.
    """
    resp = requests.post(url, params=params)
    resp.encoding = resp.apparent_encoding
    return resp.text

# -----------------------------
# Funkcje pomocnicze do ekstrakcji danych z HTML

def extract_group_name(li_text: str) -> str:
    """Wyciąga nazwę grupy z bloku li, próbując najpierw ze span, potem z linku."""
    match = re.search(r"<span[^>]*>([^<]+)</span>", li_text)
    if match:
        return match.group(1).strip()
    match = re.search(r"<a[^>]*>([^<]+)</a>", li_text)
    if match:
        return match.group(1).strip()
    # Jeśli nic nie znaleziono, usuń znaczniki HTML i zwróć tekst
    return re.sub(r"<[^>]+>", "", li_text).strip()

def extract_link_id(li_text: str) -> str:
    """Wyciąga ID z linku typu plan.php?type=...&amp;id=..."""
    match = re.search(r'plan\.php\?type=\d+&amp;id=(\d+)', li_text)
    if match:
        return match.group(1)
    return None

# -----------------------------
# Rekurencyjny przegląd elementów li

def dig_li_blocks(html: str) -> dict:
    """
    Przegląda rekurencyjnie wszystkie elementy <li> w danym HTML, szukając wywołań branch(...)
    lub get_left_tree_branch(...). Jeśli żaden nie zostanie znaleziony, próbuje wyciągnąć link.
    """
    result = {}
    li_blocks = pattern_li.findall(html)
    for li in li_blocks:
        # Sprawdzenie dla branch(...)
        br_match = pattern_branch.search(li)
        if br_match:
            b_type = br_match.group(1)
            b_id   = br_match.group(2)
            b_link = br_match.group(3)
            group_name = extract_group_name(li)
            child_html = get_feed_html(params={"type": b_type, "branch": b_id, "link": b_link})
            result[group_name] = {
                "ID": int(b_id),
                "Podgrupy": dig_li_blocks(child_html)
            }
            continue
        # Sprawdzenie dla get_left_tree_branch(...)
        gltb_match = pattern_get_left_tree_branch.search(li)
        if gltb_match:
            g_id   = gltb_match.group(1)
            g_type = gltb_match.group(2)
            g_link = gltb_match.group(3)
            group_name = extract_group_name(li)
            child_html = get_feed_html(params={"type": g_type, "branch": g_id, "link": g_link})
            result[group_name] = {
                "ID": int(g_id),
                "Podgrupy": dig_li_blocks(child_html)
            }
            continue
        # Jeśli brak wywołań – próba ekstrakcji linku
        group_name = extract_group_name(li)
        link_id = extract_link_id(li)
        if link_id:
            result[group_name] = {
                "ID": int(link_id),
                "Podgrupy": {}
            }
    return result

# -----------------------------
# Metody starsze do przetwarzania podgrup

def parse_subgroups(html, parent_name):
    """
    Szuka linków typu <a href="plan.php?type=..&amp;id=.."> w HTML.
    Jeśli nie znajdzie, używa uniwersalnego przeglądu.
    Pomija linki, których tekst jest równy nazwie rodzica.
    """
    result = {}
    matches = list(pattern_link.finditer(html))
    if matches:
        for match in matches:
            link_type, link_id, link_text = match.groups()
            link_text = link_text.strip()
            if link_text == parent_name:
                continue
            result[link_text] = {
                "ID": int(link_id),
                "Podgrupy": {}
            }
    else:
        for match in pattern_plain_course_generic.finditer(html):
            plain_id, plain_text = match.groups()
            plain_text = plain_text.strip()
            if plain_text == parent_name:
                continue
            result[plain_text] = {
                "ID": int(plain_id),
                "Podgrupy": {}
            }
    return result

def dig_left_branch(html, parent_name):
    """
    Jeśli HTML nie zawiera wywołań get_left_tree_branch ani branch, korzysta z parse_subgroups.
    W przeciwnym razie wykonuje rekurencyjny przegląd przez dig_li_blocks.
    """
    if "get_left_tree_branch" not in html and "branch(" not in html:
        return parse_subgroups(html, parent_name)
    return dig_li_blocks(html)

def merge_dicts(dict1: dict, dict2: dict) -> dict:
    """
    Łączy dwa słowniki – przy konflikcie kluczy priorytet ma dict1.
    """
    merged = dict(dict2)
    merged.update(dict1)
    return merged

# -----------------------------
# Rekurencyjne budowanie struktury

def build_structure(parent_type, parent_id, parent_name):
    """
    Buduje strukturę kierunku rekurencyjnie.
    Najpierw próbuje pobrać dane z link=1, a w razie niepowodzenia – z link=0.
    Następnie dla każdego znalezionego elementu sprawdza wywołanie get_left_tree_branch.
    """
    link_value = 1
    params = {"type": 1, "branch": parent_id, "link": link_value}
    html = get_feed_html(params)
    sub_dict = parse_subgroups(html, parent_name)
    if not sub_dict:
        if "branch(" in html or "get_left_tree_branch" in html:
            sub_dict = dig_left_branch(html, parent_name)
    if not sub_dict:
        print(f"Próba z link=0 dla {parent_name}", file=sys.stderr)
        link_value = 0
        params = {"type": 1, "branch": parent_id, "link": link_value}
        html = get_feed_html(params)
        sub_dict = parse_subgroups(html, parent_name)
        if not sub_dict and ("branch(" in html or "get_left_tree_branch" in html):
            sub_dict = dig_left_branch(html, parent_name)
    for sub_name, sub_data in sub_dict.items():
        sub_id = sub_data["ID"]
        onclick_pattern = re.compile(
            rf"get_left_tree_branch\(\s*'{sub_id}'\s*,\s*'img_{sub_id}'\s*,\s*'div_{sub_id}'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\)"
        )
        match_onclick = onclick_pattern.search(html)
        if match_onclick:
            new_type = int(match_onclick.group(1))
            new_link = int(match_onclick.group(2))
            sub_data["Podgrupy"] = build_structure_click(new_type, sub_id, sub_name, new_link)
        else:
            sub_data["Podgrupy"] = build_structure_click(parent_type, sub_id, sub_name, link_value)
    return sub_dict

def build_structure_click(next_type, next_id, parent_name, link_value):
    """
    Pobiera podgrupy rekurencyjnie przy użyciu get_feed_html.
    Jeśli przy link=1 nic nie zwróci, próbuje z link=0.
    Łączy wyniki, a następnie dla każdego elementu szuka wywołania get_left_tree_branch.
    """
    params = {"type": next_type, "branch": next_id, "link": link_value}
    html = get_feed_html(params)
    if "get_left_tree_branch" in html or "branch(" in html:
        sub_dict = dig_left_branch(html, parent_name)
    else:
        sub_dict = parse_subgroups(html, parent_name)
    if not sub_dict and link_value == 1:
        print(f"DEBUG: Dla {parent_name} nie znaleziono przy link=1, próba z link=0", file=sys.stderr)
        params = {"type": next_type, "branch": next_id, "link": 0}
        html = get_feed_html(params)
        if "get_left_tree_branch" in html or "branch(" in html:
            sub_dict = dig_left_branch(html, parent_name)
        else:
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

def build_tree(branch_id, parent_name):
    """
    Buduje drzewo podgrup dla danego branch_id.
    Dla każdego węzła wykonuje zapytania z link=1 i link=0,
    łączy wyniki, a następnie rekurencyjnie przetwarza potomków.
    """
    results = {}
    for link in [1, 0]:
        params = {"type": 1, "branch": branch_id, "link": link}
        html = get_feed_html(params)
        if "branch(" in html or "get_left_tree_branch" in html:
            children = dig_left_branch(html, parent_name)
        else:
            children = parse_subgroups(html, parent_name)
        results = merge_dicts(results, children)
    if not results:
        print(f"Brak podgrup dla {parent_name} (ID: {branch_id})", file=sys.stderr)
    for child_name, child_data in results.items():
        child_id = child_data["ID"]
        child_tree = build_tree(child_id, child_name)
        child_data["Podgrupy"] = child_tree
    return results

def parse_all_courses():
    """
    Główna funkcja parsująca:
      1) Pobiera HTML z /left_menu.php.
      2) Wyszukuje kierunki za pomocą różnych wzorców.
      3) Dla każdego kierunku buduje drzewo podgrup.
      4) Zapisuje wynik do pliku JSON.
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
    for match in pattern_plain_course_generic.finditer(main_html):
        kurs_id, kurs_nazwa = match.groups()
        kurs_id = int(kurs_id)
        kurs_nazwa = kurs_nazwa.strip()
        if kurs_id not in kierunki_map:
            kierunki_map[kurs_id] = (1, kurs_nazwa)

    result = {"courses": []}
    for kurs_id, (kurs_type, kurs_nazwa) in kierunki_map.items():
        print("LOG KURS_ID:", kurs_id, (kurs_type, kurs_nazwa), file=sys.stderr)
        print(f"DEBUG: Przetwarzamy kierunek: {kurs_nazwa} (ID: {kurs_id})", file=sys.stderr)
        lata_dict = build_tree(kurs_id, kurs_nazwa)
        print(f"DEBUG: Lata dla kierunku {kurs_nazwa}:", lata_dict, file=sys.stderr)
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

    with open("./modules/kursy.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return result
