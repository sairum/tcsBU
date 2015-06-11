function saveHaplotypes(){
  if(filesave) {
    var label, group;
    var list = [];
    
    /*
     * Haplotype list has been loaded
     */
    
    if( w2ui.haplotypes.records.length > 0 ){
      for( var i = 0; i < w2ui.haplotypes.records.length; i++ ) {
        label = w2ui.haplotypes.records[i].recid;
        group = w2ui.haplotypes.records[i].group;
        list.push(label+';'+group+'\n');
      }  
      var blob = new Blob(list, {type: "text/plain;charset=utf-8"}, {endings: "native"});
      saveAs(blob, "haplotypes.csv");
    }
  } else {
      w2alert('FileSaver.js is not supported! Use a modern browser...<br>'+
            'FileSaver.js is supported by Firefox 20+, Chrome, Chrome<br>'+
            'for Android, IE 10+, Opera 15+ and Safari 6.1+', 
            'FileSave.js is unsupported!');
  }
}
