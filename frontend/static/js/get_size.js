// function checking width of current window
function getSize() {
  winW = 0;
  winH = 0;
  var browserName=navigator.appName;
  if (browserName=="Netscape") { 
    winW = window.innerWidth-16;
    winH = window.innerHeight-16;
    loadBG = "000000";
  } else if (browserName=="Microsoft Internet Explorer") {
    winW = document.body.offsetWidth-20;
    winH = document.body.offsetHeight-20;
    loadBG = "666666";
  } else {
    winW = window.innerWidth-16;
    winH = window.innerHeight-16;
    loadBG = "000000";
  }
  
  url = document.location.href;
  document.location.assign(url+"&winW="+winW+"&winH="+winH+"&loadBG="+loadBG);
}

function getHeight() 
{
  if ( parseInt( navigator.appVersion ) > 3 ) 
  {
      if ( navigator.appName == "Netscape" ) 
    {
      return window.innerHeight - 16 ;
      }
      if ( navigator.appName.indexOf( "Microsoft" ) != -1 ) 
    {
      return document.body.offsetHeight - 20 ;
      } 
    else 
    {
      return window.innerHeight - 16 ;
      }
  }
  return 0 ;
}

function getWidth() 
{
  if ( parseInt( navigator.appVersion ) > 3 ) 
  {
      if ( navigator.appName == "Netscape" ) 
    {
      return window.innerWidth - 16 ;
      }
      if ( navigator.appName.indexOf( "Microsoft" ) != -1 ) 
    {
      return document.body.offsetWidth - 20 ;
      } 
    else 
    {
      return window.innerWidth - 16 ;
      }
  }
}
