function svgSave(){
  try {
    var isFileSaverSupported = !!new Blob;
    var d = $('#gview');
    var blob = new Blob([d.html()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "network.svg");
  } catch (e) { 
    w2alert('FileSaver.js is not supported! Use a modern browser...<br>'+
            'FileSaver.js is supported by Firefox 20+, Chrome, Chrome<br>'+
            'for Android, IE 10+, Opera 15+ and Safari 6.1+', 
            'File Save Failed!');
  }
}