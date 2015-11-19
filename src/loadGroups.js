/*
 * Reads a CSV file with group names and colors 
 */
 
function loadGroups(event) {
  
  var input = event.target;
  // Read only one file, no more, no less
  
  if( input.files.length !== 1 ) return;
  
  var fileInput = document.getElementById('loadGroups');
  
  var reader = new FileReader();

  reader.onload = function() {
    var i,j,k,p,f;
    var text = reader.result;
    var lines = text.split('\n');
    var line, l, name, color, pattern, t;
    var names = [];
    var g = [ { recid: 'Default', color: 'ffffff', pattern: 'none', editable: false } ];
    for( i=0; i<lines.length; i++) {    
      line=lines[i].trim();
      if( line !== '' ) {
        l = line.split(";");
        if ( l.length === 2 || l.length === 3 ) {   // Accept only lines with two or three fields
          name = l[0].trim();
          if( name !== '' ) {                       // There is at least a label or name or something as a first field...
            k = names.indexOf(name);                // Check if this name is already in list
            if ( k == -1 ) {
              names.push(name);                     // Add name to the names' list
              color = l[1].trim();                    // read the color
              if (/^#[0-9a-f]{3,6}$/i.test(color)) {  // check if it is a valid RGB color (e.g, #a2ff4b or #a0f)
                color = color.substr(1);              // strip the # prefix
              }
              pattern = 'none';
              if( typeof l[2] !== 'undefined' ) {   // read an optional pattern
                p = l[2].trim();
                j = pattern_names.filter(function(v, i) { return v.id === p; })[0];
                if (typeof j !== 'undefined') pattern = p;              
              }
              g.push({ recid: name, color: color, pattern: pattern });
            }
          }
        }
      }
    } 
    if(g.length > 1) {
      
      /* 
       * Some groups were added, besides the default one, so update w2ui.groups
       */
      
      w2ui.groups.clear(); 
      w2ui.groups.add(g);
        
      /*
       * Now check if haplotype list is already defined
       * and clean any classification made
       */
      
      if( w2ui.haplotypes.records.length > 0 ) {
        var g;
        for ( i = 0; i < w2ui.haplotypes.records.length; i++ ) {
          g = w2ui.haplotypes.records[i].group;
          w2ui.haplotypes.records[i].group = 'Default';
          w2ui.haplotypes.records[i].color = 'ffffff';
          classify(i, 'Default', g);
        }        
        w2ui.haplotypes.refresh();
      }
      
      /*
       * If SVG is already set, reset fill patterns
       */
      
      if (svg) {
        
        /*
         * Remove any pattern definition from the SVG
         */
        
        $('pattern').remove();
        for ( i = 0; i < w2ui.groups.records.length; i++ ) {
          if( w2ui.groups.records[i].pattern !== 'none' ) {
            createPattern(w2ui.groups.records[i].pattern, w2ui.groups.records[i].color);
          }
        }
      }
      
    } else {
        w2alert('This seems not to be a formatted "Group" file!<br>'+
                '(CSV text file with group names and colors   <br>'+
                'separated by a ; Please hit the Help button.','No groups loaded!');
    }
    
    /*
     * clear input field so that file can be reopened!
     */    
    
    fileInput.value = "";
  };
  
  if (w2ui.groups.records.length > 1 ) {
    
    /*
     * Groups already loaded! Override?
     */
    
    w2confirm ('Old list will be deleted! If some haplotypes have<br>'+
               'already been associated with groups (colors) they<br>'+
               'may revert to default group or become associated <br>'+
               'with a different group                           <p>'+
               'Load the new list?', 'Replace active group\'s list?')
               .yes(function(){reader.readAsText(input.files[0]); } );
  } else {
    reader.readAsText(input.files[0]);
  }
}
  