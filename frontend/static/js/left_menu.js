
  $(document).ready(function(){
  
    $(".main_tree").Treeview({
      speed: "fast",
      collapsed: true,
      unique: true,
      store: false
    });
    
  });
  
  function branch( type, id, link )
  {
    $("body").addClass("cursor_prog");
    $(".img_collapsed").addClass("cursor_prog");
    $(".img_collapsed").attr("style","cursor: progress;");

    $('#'+id).load('left_menu_feed.php?type='+type+'&branch='+id+'&link='+link,{},
    function()
    {
    
      $("body").removeClass("cursor_prog");
      $(".img_collapsed").removeClass("cursor_prog");
      $(".img_collapsed").attr("style","cursor: pointer;");

      $("div").remove(".hitarea");
      $("ul").not($(".main_tree")).Treeview({
        speed: "fast",
        collapsed: false,
        unique: true,
        store: false
      });
    
      $(".imgbranch").attr(  "src", "images/plus.gif" ) ;
      $("#img"+id).attr(  "src", "images/minus.gif" ) ;
      $(".switchable").hide( "fast" );
      $("#sub"+id).show("fast");  

    });        
  }
  
  
  function hide( id )
  {
      
      if ( $("#img"+id).attr( "src" )  == "images/minus.gif" )
      {
        $(".imgbranch").attr( "src", "images/plus.gif" ) ;
        $(".switchable").hide( "fast" );
      }
      else
      {
        $(".switchable").hide( "fast" );
        $(".imgbranch").attr( "src", "images/plus.gif" ) ;
        $("#img"+id).attr( "src", "images/minus.gif" ) ;
        $("#sub"+id).show( "fast" );
      }
  }
