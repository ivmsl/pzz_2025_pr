// function reloading text in divs after size change
function reload(id) {
  tmp=jQuery("#"+id).html();
  jQuery("#"+id).html(tmp);
}

// hover function for divs resizing
jQuery(document).ready(
  function() {
    jQuery("div[@name=course]").each(
      function() {
        id=jQuery(this).attr("id");
        jQuery("#testBox").width("auto");
        jQuery("#testBox").height("auto");
        jQuery("#testBox").html( jQuery(this).html() );
        jQuery("#testBox").children("img").remove();
        w=jQuery("#testBox").width();
        multiplier=jQuery(this).attr("mtp");
        width=parseFloat( jQuery(this).css("width") );
        height=parseFloat( jQuery(this).css("height") );
        if ( w >= (width+6) * multiplier ) {
          w = width * multiplier;
          jQuery("#testBox").width(w);
        }
        if ( w <= (width+6) ) {
          w = width;
        }
        h=jQuery("#testBox").height();
        if ( h <= (height+6) ) {
          h = height;
        }
        if ( w != width || h != height ) {
          jQuery(this).attr("resizable",1);
          jQuery("#arrow_"+id).css("display","block");
        } else if ( w == width && h == height ){
          jQuery(this).attr("resizable",0);
          jQuery("#arrow_"+id).css("display","none");
        }

        jQuery(this).attr("cwb",w);
        jQuery(this).attr("chb",h);
      }
    );
    jQuery("div[@name=course]").hover(
      function() {
        id=jQuery(this).attr("id");
        cWB=jQuery(this).attr("cwb");
        cHB=jQuery(this).attr("chb");
        cW=jQuery(this).attr("cw");
        cH=jQuery(this).attr("ch");
        jQuery(this).css("z-index","5000");
        if (cWB != cW) {
          dpW = parseInt(cWB)+1;
          jQuery('#arrow_'+id).css('display','none');
          jQuery('#delete_'+id).css('left',dpW+'px');
          mint.fx.Size(id, cWB, null, 1, 1, null, function() {reload(id)} );
        }
        if (cHB != cH) {
          jQuery('#arrow_'+id).css('display','none');
          mint.fx.Size(id, null, cHB, 1, 1, null, function() {reload(id)} );
        }
      },
      function() {
        id=jQuery(this).attr("id");
        cW=jQuery(this).attr("cw");
        cH=jQuery(this).attr("ch");
        dpW = parseInt(cW)+1;
        if ( jQuery(this).attr("resizable") == '1' ) {
          jQuery('#arrow_'+id).css('display','block');
        }
        jQuery('#delete_'+id).css('left',dpW+'px');
        zOld=jQuery(this).attr("zOld");
        jQuery(this).css("z-index",zOld);
        mint.fx.Size(id, cW, cH, 1, 1, null, function() {reload(id)} );
      }
    );
  }
);

// function for div swap depending on z-index
function divswap(id) {
  current = document.getElementById(id);
  jQuery("div[@name=course]").css("z-index",
    function() {
      if (current != this) {
        zIndex=jQuery(this).css('z-index');
        zIndex++;
        jQuery(this).attr("zOld",zIndex);
        jQuery(this).css('z-index', zIndex);
      } else {
        jQuery(current).css("z-index", 1);
        jQuery(current).attr("zOld",1);
      }
    }
  );
}

// function checking legend div height
jQuery(document).ready(
  function() {
    y=jQuery("#legend").css('top');
    h=jQuery("#legend").height();
    s=jQuery("#print").attr('space');
    jQuery("#print").css('top',parseInt(y)+parseInt(h)+parseInt(s) + 4); // dodajemy rozmiar dwóch borderów
    jQuery("#print").css('display','block');
    hPrint=jQuery("#print").height();
    jQuery("#files").css('top',parseInt(y)+parseInt(h)+2*parseInt(s) + parseInt(hPrint) + 8);
    jQuery("#animation").css("display","none"); // wylacza animacje ladowania
  }
);

// function verifying input in resers form
function verifyInput(_selList,emptyId,roomNr) {
  if(_selList.options[_selList.selectedIndex].value==emptyId) {
    jQuery("#formReserType").css("display","inline");
    jQuery("#formReserDesc").attr({value : ""});
  } else {
    jQuery("#formReserType").css("display","none");
    jQuery("#formReserDesc").attr({value :_selList.options[_selList.selectedIndex].text+' '+roomNr});
  }
}

// function verifying input in resers form // added by lukasz nawrat
function verifyInputUniversal( _selList, emptyId, idSelect, idInput ) 
{
  if( _selList.options[_selList.selectedIndex].value == emptyId ) 
  {
    jQuery( '#' + idSelect ).css(  'display', 'inline');
    jQuery( '#' + idInput  ).attr( 'value'  , '' );
  } 
  else 
  {
    jQuery( '#' + idSelect ).css(  'display', 'none' );
    jQuery( '#' + idInput  ).attr( 'value'  , _selList.options[_selList.selectedIndex].text );
  }
}

// function for week filtering in resers form
function weekFilter(sel) {
  idWeekDef=sel.value;
  if ( idWeekDef != 0) {
  
    jQuery.post("ajax_weekdef.php",{idWeekDef:idWeekDef},
      function(data) {
        idWeeks=data.split(';');
        if ( sel.id == "weekDef" ) {
          str = "#week";
        } else if ( sel.id == "wBWeekDef" ) {
          str = "#wBWeek";
        } else {
          str = "";
        }
        jQuery(str).children().each(
          function() {
            if ( jQuery(this).attr("value") != "0" ) {
              found = false;
              for ( j = 0; j < idWeeks.length; j++) {
                if (jQuery(this).attr("value") == idWeeks[j] ) {
                  found = true;
                  break;
                }
              }
              if (found) {
                jQuery(this).css("display","block");
              } else {
                jQuery(this).css("display","none");
              }
            }
          }
        )
        jQuery(str).children().removeAttr("selected");
        jQuery(str).children("OPTION[@value=0]").attr("selected","selected");
      }
    )

  }
}

// function setting "----" option in "weekDef" while any week in "week" selected
function weekSelected(sel) {
  idWeek = sel.value;
  if ( idWeek != 0) {

    if ( sel.id == "week" ) {
      str = "#weekDef";
    } else if ( sel.id == "wBWeek" ) {
      str = "#wBWeekDef";
    } else {
      str = "";
    }
    jQuery(str).children().removeAttr("selected");
    jQuery(str).children("OPTION[@value=0]").attr("selected","selected");
  }
}

// function showing week selected in weekBrowser
function showWBSelected(nr) {
  // Other kind of filtering involved.
  if ( document.getElementById('checkBoxFiltered').checked )
    nr = 2;
  else 
    nr = 1;
  idWeekDef=jQuery("#wBWeekDef").children("OPTION[@selected]").val();
  idWeek=jQuery("#wBWeek").children("OPTION[@selected]").val();
  nType = jQuery("#wBButton").attr("nType");
  SID = jQuery("#wBButton").attr("SID");

  nType = 2 * Math.floor( parseInt(nType) / 2);
  
  str = "plan.php?type=" + nType + "&id=" + SID;

  if (idWeek != 0 && idWeek != null) {
    str = str + "&w=" + idWeek;
    bothWeeks = 0;
  } else if (idWeekDef != 0 && idWeekDef != null) {
    str = str + "&wd=" + idWeekDef;
    bothWeeks=jQuery("#wBWeekDef").children("OPTION[@selected]").attr("bw");
  } else return;
  str = str + "&bw=" + bothWeeks;
  if (nr == 2) {
    str = str + "&filter=1";
  }
  document.location.assign(str);
}

// function deleting resers
function reserKick(id,idReser,idCond) {

  cfm = confirm('Czy na pewno chcesz usun±æ rezerwacjê?');
  switch(cfm) {
    case true:
      jQuery.post("ajax_delete.php",{idReser: idReser, idCond: idCond},
        function(data) {
          results = data.split(";");
          if (results[0] == 'OK' && results[1] == 'OK') {
            alert("Rezerwacja zosta³a usuniêta.");
            document.location.reload();
            //jQuery("#"+id).css("display","none");
            //jQuery("#arrow_"+id).css("display","none");
            //jQuery("#delete_"+id).css("display","none");
          } else if (results[0] == 'OK' && results[1] == 'ERROR') {
            alert("Rezerwacja zosta³a usuniêta z planu, ale nadal znajduje siê w bazie danych.\nSkontaktuj siê z adminisratorem serwisu.");
            document.location.reload();
            //jQuery("#"+id).css("display","none");
            //jQuery("#arrow_"+id).css("display","none");
            //jQuery("#delete_"+id).css("display","none");
          } else if (results[0] == 'OK' && results[1] == 'NONE') {
            alert("Rezerwacja zosta³a usuniêta z Twojego planu.");
            document.location.reload();
            //jQuery("#"+id).css("display","none");
            //jQuery("#arrow_"+id).css("display","none");
            //jQuery("#delete_"+id).css("display","none");
          } else {
            alert("Wyst±pi³ b³±d: "+data+"\nSkontaktuj siê z adminisratorem serwisu.");
          }
        }
      )
      break;

    case false:
      break;

    default:
      break;
  }
}
