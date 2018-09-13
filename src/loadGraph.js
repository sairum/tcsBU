 /*
 * Reads GML file (output of TCS) from localhost. Should be a .graph file 
 * outputed from TCS (format is: Graphic Modelling Language - GML)
 */
 
function loadGraph(e) {
  var haplos = [];
  var input = e.target;
  
  var fileInput = document.getElementById('loadGraph');
  
  /*
   * Read only one file, no more, no less
   */
  
  if( input.files.length !== 1 ) return;
  
  var reader = new FileReader();
  
  
  
  /*
   * clear nodes and edges lists 
   */
  
  nodeList = [];
  edgeList = [];
  linkList = [];  
  
  reader.onload = function() {
    var text = reader.result;
    var lines = text.split('\n');
    var newnode = false;
    var newedge = false;
    var multilabels = false;
    var frequency,radius,x, y, haplogroup, group, label, changes, source, target;
    var labels = [];
    var area = Math.PI*Math.pow(standardRadius,2);
    for(var i=0;i<lines.length;i++) {
      if(lines[i].indexOf('node [') == 3) newnode = true;
      if(lines[i].indexOf('edge [') == 3) newedge = true;
      if(lines[i].indexOf(']') == 3) {
        if( newnode) {
          newnode = false;
          if ( labels.length > 0 ) {
            radius = 2;
            if(label!==''){     
              
              /* This is a true haplotype (not a transition nodes). Add it
               * to the haplotypes' list that will be presented in the grid 
               * 'haplotypes'. Make sure labels start with a charcater ( not 
               * a digit) and have only [a-ZA-Z0-9_-] characters. Replace all
               * other characters by '_'. The reason for this is that although 
               * JQuery can handle most of these and other characters as 
               * element's ids, d3.js is much more restrictive...
               */
              
              for (var j=0;j<labels.length;j++){
                labels[j] = labels[j].replace(/[\W]/g, "_");
                
                /*
                 * Test if first character is a digit. If so prepend
                 * the label with 'L'.
                 */
                
                if (/^\d+$/.test(labels[j][0])) labels[j] = 'L'+labels[j];
                haplos.push( { recid: labels[j], haplogroup: haplogroup, group: 'Default', color: 'ffffff' } );
              }
              
              /* Set the SVG radius of the haplogroup to a standard size, based 
               * on the number of haplotypes in the haplogroup ('frequency') 
               * times 'standardRadius'. standardRadius is define as a global variable. 
               * For transition nodes use a radius = frequency*standardRadius;
               */
              
              radius = Math.sqrt(frequency*area/Math.PI); 
            }
            
            /*
             * Push the nodes (haplogroups) into a nodeList, naming them by
             * the first label if they include more than one
             */
            
            nodeList.push({ name: labels[0], 
                            radius: radius, 
                            proportions: [{group: 'Default', value: frequency, radius: radius, color: '#ffffff', pattern: 'none' }], 
                            id: haplogroup });
            /*
             * clear the labels list for next haplogroup
             */
            
            labels = [];
          }
        } else {
          if( newedge ) {
            newedge = false;
            edgeList.push({source: source, target: target, id: labels[0], changes: changes });
          } else {
            console.log('Serious Error!');
          }  
        }  
      }
      if( newnode ) {
        if( ( lines[i][0] == '"' ) && ( multilabels ) ) multilabels = false;
        if( multilabels ) labels.push(lines[i].trim());
        if(lines[i].indexOf('id') == 6) haplogroup = Number(lines[i].substr(9, 10).trim());
        if(lines[i].indexOf('Frequency') == 9 ){
          frequency = Number(lines[i].substr(30, 10).trim());
          if( frequency > 0 ) multilabels = true;
        }
        if(lines[i].indexOf('label') == 6) label = lines[i].substr(12, 100).replace(/"/g, ' ').trim();
        //if(lines[i].indexOf('x') == 12) x = Number(lines[i].substr(14, 100).trim());
        //if(lines[i].indexOf('y') == 12) y = Number(lines[i].substr(14, 100).trim());
        //if(lines[i].indexOf('group') == 9) group = Number(lines[i].substr(15, 100).trim());
      }  
      if( newedge ) {
        if(lines[i].indexOf('label') == 6) label = lines[i].substr(12, 100).replace(/"/g, '').trim();
        if(lines[i].indexOf('Changes') == 9) changes = lines[i].substr(17, 100).replace(/"/g, '').replace(/\t/g, ' ').trim();
        if(lines[i].indexOf('source') == 6) source = Number(lines[i].substr(13, 100).trim());
        if(lines[i].indexOf('target') == 6) target = Number(lines[i].substr(13, 100).trim());
      }
    }
    
    /*
     * Clear any haplotypes present in the haplotypes' grid
     */
    
    if(w2ui.haplotypes.records.length > 0) w2ui.haplotypes.clear();
    
    /*
     * Clear any groups defined except Default
     */
    
    if(w2ui.groups.records.length > 1) {
      w2ui.groups.clear();
      w2ui.groups.add({ recid: 'Default', color: 'ffffff', pattern: 'none', editable: false });
    }
    
    /*
     * Remove any previous svg elements
     */
    
    if (svg) {
      d3.select("#gview").selectAll("*").remove();
      svg = null;
      force = null;
    }
    
    
    /*
     * Add the new haplotypes to the grid
     */
    
    w2ui.haplotypes.add(haplos);

    /*
     * Disable start button
     */
    
    $('#start').prop('disabled',true);
    
    /*
     * clear input field so that file can be reopened!
     */    
    
    fileInput.value = "";
    
    /*
     * start the d3 force layout
     */
    
    svgStart();
    
  };
  reader.readAsText(input.files[0]);
}
  
