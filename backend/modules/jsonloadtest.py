import re
#import requests
import json
import sys
from parser import parse_all_courses




def build_parent(nazwa, sid) -> str:
    return f'<a href="#" onclick="hide({sid});"><img id="img{sid}" class="imgbranch" src="images/minus.gif" border="0"></a> \
<span style="margin-left: -13px">{nazwa}</span> \
<div class="switchable" id="sub{sid}" style="display: none;">'

def add_child_last(nazwa, pid) -> str: 
    return f'<li><img src="images/leafstudents.gif" alt="" /> \
      <a href="plan.php?type=0&amp;id={pid}" target="page_content">{nazwa}</a> \
    </li>'

def add_child_cont(nazwa, pid) -> str:
    return f'<li class="closed"><img   src=\'images/plus.gif\' alt=\'\' id=\'img_{pid}\' onclick="get_left_tree_branch(\'{pid}\',\'img_{pid}\',\'div_{pid}\',\'1\',\'1\');"onmouseover="this.style.cursor=\'pointer\';"> \
        <a href="plan.php?type=2&amp;id={pid}" target="page_content">{nazwa}</a> \
        <div id="div_{pid}" style=" display: none; "></div> \
      </li>'

def loadjson():
    try:
        with open("./modules/kursy.json", 'r') as f:
            json_object = json.load(f)
    except:
        json_object = parse_all_courses()
    
    return json_object

json_object = loadjson()

def look_for_ptr_name(s_id) -> tuple[str, dict]:
    parent_ptr = None
    parent_name = ''
    for item in json_object["courses"]:
        if item.get("ID_KIER"):
            if item["ID_KIER"] == s_id:
                parent_ptr = item
                parent_name = item["Nazwa_Kierunku"]
                break
            else:
                if item.get("Lata"):
                    lata = item["Lata"]
                    for rok in lata.keys():
                        if lata[rok].get("ID"):
                            if lata[rok]["ID"] == s_id:
                                parent_ptr = lata[rok]
                                parent_name = rok
                                break
                            else:
                                if lata[rok].get("Grupy"):
                                    if lata[rok]["Grupy"]: 
                                        grps = lata[rok]["Grupy"]
                                        for grp in grps.keys():
                                            # print(grps[grp])
                                            if grps[grp].get("ID") == s_id:
                                                parent_ptr = grps[grp]
                                                parent_name = grp
                                                break
                                            else:
                                                if grps[grp].get("Podgrupy"):
                                                    # print("grp")
                                                    pdgrs = grps[grp]["Podgrupy"]
                                                    for pdgr in pdgrs.keys():
                                                        if  pdgrs[pdgr].get("ID") == s_id:
                                                            parent_ptr = pdgrs[pdgr]
                                                            parent_name = pdgr
                    
                        
                # if key.get("Lata"):
                #     for lata in key.
                
                
                
                
                
                # if key == 'Lata': 
                #     rok = item[key]
                #     retstr = build_parent(item["Nazwa_Kierunku"], item["ID_KIER"])
                #     if len(rok):
                #     retstr += "<ul>"
                #     for rok_entity in rok.keys():
                #         retstr += add_child_cont(rok_entity, rok[rok_entity]["ID"])
                #     retstr += "</ul></div>"    
            
            # break
    print(parent_name, parent_ptr)
    return (parent_name, parent_ptr)


def build_response_left_menu(parent_name, parent_ptr, bOne) -> str:
    resp_html = ''
    pid = 0
    if parent_ptr.get("ID_KIER"):
        pid = parent_ptr.get("ID_KIER")
    elif parent_ptr.get("ID"):
        pid = parent_ptr.get("ID")

    print("PIIIIID:", pid)
    if (not bOne): resp_html = build_parent(parent_name, pid)
    print("PARENT: ", resp_html, file=sys.stderr)
    resp_html += "<ul>"

    if parent_ptr.get("Lata"):
        roks = parent_ptr["Lata"]
        for rok in roks:
            if roks[rok].get("Grupy"):
                resp_html += add_child_cont(rok, roks[rok].get("ID"))
            else:
                resp_html += add_child_last(rok, roks[rok].get("ID"))
    
    
    if parent_ptr.get("Grupy"):
        roks = parent_ptr["Grupy"]
        for rok in roks:
            if roks[rok].get("Podgrupy"):
                resp_html += add_child_cont(rok, roks[rok].get("ID"))
            else:
                resp_html += add_child_last(rok, roks[rok].get("ID"))

    if parent_ptr.get("Podgrupy"):
        roks = parent_ptr["Podgrupy"]
        for rok in roks:
            if roks[rok].get("Podgrupy"):
                resp_html += add_child_cont(rok, roks[rok].get("ID"))
            else:
                resp_html += add_child_last(rok, roks[rok].get("ID"))
    #else:
        #add_child_last(parent, roks[rok].get("ID"))

    if resp_html: resp_html += "</ul></div>"
    
    return resp_html


def get_mock_resp(sid, bOne) -> str:
    

    print("SID", sid)

    tlp = look_for_ptr_name(sid)    
    print(tlp)
    ret = build_response_left_menu(*tlp, bOne)
    # print(ret)
    return ret
    return ""


# tlp = look_for_ptr_name(28699)
# print(build_response_left_menu(*tlp))