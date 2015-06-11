function saveGroups(){
  if(filesave) {
     var label, color, pattern;
     var list = [];
     
    /*
     * Group list exists
     */
    
    if( w2ui.groups.records.length > 0 ){
      for( var i = 1; i < w2ui.groups.records.length; i++ ) {
        label   = w2ui.groups.records[i].recid;
        color   = w2ui.groups.records[i].color;
        pattern = w2ui.groups.records[i].pattern;
        list.push(label+';#'+color+';'+pattern+'\n');
      }  
      var blob = new Blob(list, {type: "text/plain;charset=utf-8"}, {endings: "native"});
      saveAs(blob, "groups.csv");
    }
  } else {
      w2alert('FileSaver.js is not supported! Use a modern browser...<br>'+
            'FileSaver.js is supported by Firefox 20+, Chrome, Chrome<br>'+
            'for Android, IE 10+, Opera 15+ and Safari 6.1+', 
            'FileSave.js is unsupported!');
  }
}
