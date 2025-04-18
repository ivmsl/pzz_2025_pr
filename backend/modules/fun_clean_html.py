import re
import requests
import os
import sys

template_dir = os.path.abspath('../frontend/templates')
BASE_URL = "http://plan.ii.us.edu.pl"

def get_html(url, params=None):
    """
    Funkcja obsługi pobierania HTML.
    Przygotowuję odpowiednie kodowanie, metody poprawiania znaków w języku polskim.
    """
    print("PARAMS: ", params, file=sys.stderr)
    resp = requests.get(url, params=params)
    resp.encoding = resp.apparent_encoding
    return resp.text


def clean_search(text):
    """
    Cleans the HTML by removing the first three tables.
    
    :param str text: The HTML to clean.
    :return: The cleaned HTML.
    """
    first_table_start = text.find("<table")
    if first_table_start == -1:
        return text  
    
    first_table_end = text.rfind("</table>", first_table_start)
    if first_table_end == -1:
        return text
    
    first_table_content = text[first_table_start:first_table_end + 8]  # "+8" bo `</table>` ma 8 znaków

    cleaned_first_table = re.sub(r"<table.*?</table>", "", first_table_content, count=3, flags=re.DOTALL)

    cleaned_html = text[:first_table_start] + cleaned_first_table + text[first_table_end + 8:]

    return cleaned_html


def clean_nagl(text):
    """
    Cleans the HTML by removing the second table.
    
    :param str text: The HTML to clean.
    :return: The cleaned HTML.
    """
    first_table_start = text.find("<table")
    if first_table_start == -1:
        return text  
    
    first_table_end = text.find("</table>", first_table_start)
    if first_table_end == -1:
        return text
    
    second_table_start = text.find("<table", first_table_end + 8)
    if second_table_start == -1:
        return text
    
    second_table_end = text.rfind("</table>", second_table_start)
    if second_table_end == -1:
        return text
    
    cleaned_html = text[:second_table_start] + text[second_table_end + 8:]

    return cleaned_html


def clean_frame(text):
    """
    Cleans the frame part of the HTML.

    :param text: The HTML to clean
    :return: The cleaned HTML
    """
    start_frame = text.rfind("<frame src")
    if start_frame == -1:
        return text  
    
    end_frame = text.rfind("</noframes>", start_frame + 11)
    if end_frame == -1:
        return text
    
    cleaned_html = text[:start_frame - 4] + "</frameset>" +  text[end_frame + 11:]

    return cleaned_html



def clean_html(input_file, output_file):
    """
    Cleans the HTML from the given input file and writes it to the given output file.

    :param input_file: the file to read the HTML from
    :param output_file: the file to write the cleaned HTML to
    """
    #with open(input_file, "r", encoding="utf-8") as file:
    #    html_content = file.read()

    html_content = get_html(BASE_URL + input_file)

    if "<title>Plan zajęć: Plan zajęć, Uniwersytet Śląski, rok 2024/2025, semestr letni</title>" in html_content:
        cleaned_html = clean_frame(html_content)
    elif "<img" in html_content:
        cleaned_html = clean_nagl(html_content)
    elif "<td>Szukaj planów</td>" in html_content:
        cleaned_html = clean_search(html_content)

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(cleaned_html)


def update_all_main():
    clean_html("", template_dir + "/index.html")
    clean_html("/menug.php", template_dir + "/menug.html")
    clean_html("/main.php", template_dir + "/main.html")

    lmenu_url = BASE_URL + "/left_menu.php"
    lmenu = get_html(lmenu_url)
    with open(template_dir + "/left_menu.html", "w", encoding="utf-8") as file:
        file.write(lmenu)

    #tworzenie statycznego pliku