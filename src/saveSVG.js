function saveSVG(){
  if( filesave ) {
    var d = $('#gview');
    var blob = new Blob([d.html()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "network.svg");
  } 
}