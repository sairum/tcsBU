 /*
 * Reads a CSV file with haplotype names and groups 
 */
 
function loadHaplotypes(e) {

  var input = e.target;
  
  /*
   * Read only one file, no more, no less
   */
  
  if( input.files.length !== 1 ) return;

  var fileInput = document.getElementById('loadHaplotypes');
  
  var reader = new FileReader();
    
  reader.onload = function() {

    var text = reader.result;
    var lines = text.split('\n');
    var line, l, name, group;
    var i, h = [];
    

    
    for(i=0;i<lines.length;i++) {    
      line=lines[i].trim();
      if( line !== '' ) {
  
        l = line.split(";");
        
        /*
         * Accept only lines with two fields
         */
        
        if ( l.length === 2 ) {                     
          name = l[0].trim();
          if( name !== '' ) {       
            
            /*
             * There is at least a label or name or something as a first field...
             * Standardize the string (only alpha/numbers and _ and - allowed
             * If name starts as anumber, preppend an 'L' as loadGraph does
             */

            name = name.replace(/[\W]/g, '_');
            
            if (/^\d+$/.test(name[0])) name = 'L'+name;
            
            /*
             * Now read the second column (the group)
             */
            
            group = l[1].trim();
            if(group !== "") h.push({ label: name, group: group });
          }
        }
      }
    }
    
    /*
     * Check if a list of haplotypes <-> groups was created
     */
    
    if(h.length > 0) { 
      
      
      /*
       * Iterate through all haplotypes in the list, check if they exist
       * in the haplotype grid and change their group accordingly. Check
       * also if the group is defined in the group's list. Otherwise, 
       * don't change anything (keep the default group)
       */
      
      var hap, grp, ogrp;
      for(i=0; i < h.length; i++){
        
        /*
         * Try to find this label in haplotypes' grid and 
         * return its index. Accept only the first value
         * retreived (should be a single value as labels
         * are unique keys, but users may wrongly provide
         * incomplete haplotype labels...
         */
        
        hap = w2ui.haplotypes.find({ recid: h[i].label }, true)[0];
        
        /*
         * Try to find this group in groups' grid and
         * return its index. Since the group's list doesn't
         * allow for duplicate keys, the function returns 
         * either a record number (index) or -1 (not found)
         */
        
        grp = w2ui.groups.find({ recid: h[i].group }, true)[0];
        
        if( (typeof hap !== 'undefined') && (typeof grp !== 'undefined') ) {
          
          /*
           * Retreive the value of the 'group' for this record
           */
        
          ogrp = w2ui.haplotypes.records[hap].group;
          if (typeof ogrp === 'undefined') ogrp = 'Default';
          
          /*
           * Change groups
           */
          
          w2ui.haplotypes.records[hap].group = h[i].group;
          w2ui.haplotypes.records[hap].color = w2ui.groups.records[grp].color;
          
          /*
           * Reclassify this haplotype
           */
          
          classify(hap, h[i].group, ogrp);
        }
      }
      updateSVG();
      w2ui.haplotypes.refresh();
    }
    else {
        w2alert('This seems not to be a formatted "Haplotype" file!<br>'+
                '(CSV text file with haplotype and group names     <br>'+
                'separated by a ; Please hit the Help button.','No haplotypes loaded!');
    }
    
    /*
     * clear input field so that file can be reopened!
     */    
    
    fileInput.value = "";
  };
  
  if (w2ui.groups.records.length > 1 ) {  //Groups already loaded! Override?
    w2confirm ('Colors will be replaced in the haplotype list! If<br>'+
               'any color has already been assigned they will be<br>'+
               'overriden! Load the colors\' list, anyway?       <br>',
               'Replace active group\'s list?').yes(function(){reader.readAsText(input.files[0]); } );
  } else {
    reader.readAsText(input.files[0]);
  }
}

  
