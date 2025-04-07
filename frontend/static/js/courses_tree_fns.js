  function get_branch( idParent, idTarget, idUser, idImg )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_course_tree_branch&idParent=' + idParent + '&idUser=' + idUser,
                              1 , function() { $( '#' + idImg ).attr( 'src', 'images/minus.gif' ); } );
    $( '#' + idImg ).removeAttr( 'onmousedown' );
  }
  function get_branch4( idParent, idTarget, idUser, idImg )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_course_tree_branch&idParent=' + idParent + '&idUser=' + idUser,
                              1 , function() { $( '#' + idImg ).attr( 'src', 'images/minus.gif' ); } );
    $( '#' + idImg ).removeAttr( 'onmousedown' );
    $( '#' + idTarget ).show( 'slow' );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  function get_branch2( idBranch, idTarget, idUser, idImg )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_group_tree_branch&idBranch=' + idBranch + '&idUser=' + idUser, 
                              1 , function() { $( '#' + idImg ).attr( 'src', 'images/minus.gif' ); } );
    $( '#' + idTarget ).show( 'slow' );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  function get_branch3( idBranch, idTarget, idImg, sName )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_course_branch&idBranch=' + idBranch + '&sName=' + sName, 
                              1 , function() { $( '#' + idImg ).attr( 'src', 'images/minus.gif' ); } );
    $( '#' + idTarget ).show( 'slow' );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  function hide_target( idImg, idTarget )
  {
    $( '#' + idTarget ).hide( 'slow' );
    $( '#' + idImg ).attr( 'src', 'images/plus.gif' );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { show_target( idImg, idTarget ); };
  }
  function show_target( idImg, idTarget )
  {
    $( '#' + idTarget ).show( 'slow' );
    $( '#' + idImg ).attr( 'src', 'images/minus.gif' );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  
  function get_rights_branch( idChild, idImg, idTarget, sType, keyValue )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_rights_tree&idChild=' + idChild + '&sType=' + sType + '&idUser=' + $( '#idOfUser' ).attr( 'idUserId' ) + '&keyValue=' + keyValue,
                              1 , function() {   $( '#' + idImg ).attr( 'src', 'images/minus.gif' );
                                                $( '#' + idTarget ).show( 'slow' );} );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  
  function get_not_loged_branch( idChild, idImg, idTarget, sType )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_not_loged_tree&idChild=' + idChild + '&sType=' + sType ,
                              1 , function() {   $( '#' + idImg ).attr( 'src', 'images/minus.gif' );
                                                $( '#' + idTarget ).show( 'slow' );} );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  
  function get_left_tree_branch( idChild, idImg, idTarget, sType, bLink, iPos )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    iPos ++;
    $( '#' + idTarget ).load( 'left_menu_feed.php?type='+sType+'&branch='+idChild+'&link='+bLink+'&bOne=1&iPos='+iPos,
                              1 , function() {   $( '#' + idImg ).attr( 'src', 'images/minus.gif' );
                                                $( '#' + idTarget ).show( 'slow' );} );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }
  
  function get_sent_mail_branch( idChild, idImg, idTarget, sType )
  {
    $( '#' + idImg ).attr( 'src', 'images/indicator.gif' );
    $( '#' + idTarget ).load( 'tree_script.php?type=get_sent_mail_tree&idChild=' + idChild + '&sType=' + sType ,
                              1 , function() {   $( '#' + idImg ).attr( 'src', 'images/minus.gif' );
                                                $( '#' + idTarget ).show( 'slow' ); } );
    
    // i love IE and microsoft
    var tmp = document.getElementById( idImg );
        tmp.onclick = function() { hide_target( idImg, idTarget ); };
  }