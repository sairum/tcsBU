/*
 * This function reclassifies (changes the group and color) a given haplotype
 * in the haplotype list (referred by its 'index') and changes the svg graph
 * (if enabled) accordingly. The new and old values of the group should
 * be passed, so as to update the proportions of the corresponding pie chart
 */

function classify(index, newgroup, oldgroup){

  /*
   * Grab the new color from groups' list ('newgroup' is yhe index of that array)
   * Additionally, grab a pattern if available
   */
  var newcolor = 'ffffff', 
      newpattern = 'none';
      
  var nc = w2ui.groups.find({ recid: newgroup }, true)[0];
  if( nc !== 'undefined' ) {
    newcolor   = w2ui.groups.records[nc].color;
    if( w2ui.groups.records[nc].pattern !== 'none') newpattern = "url(#" + newcolor + w2ui.groups.records[nc].pattern + ")";
  }
  
  /*
   * Grab the haplogroup of this particular haploty++pe
   */
  
  var haplogroup = Number(w2ui.haplotypes.records[index].haplogroup);
  
  /*
   * Grab the node index from nodeList where id == haplogroup
   */  
    
  var nd = $.map(nodeList, function(e, i) { if(e.id === haplogroup) return i; } )[0];
  
  if( typeof nd !== 'undefined' ) {
    
    /*
     * If a node was found, check if the group of this haplotype is already 
     * present in the 'proportions' property of the respective node (ng).
     * Check also the index of the group being changed (og): this is usually
     * the default group, but may be any other groups that's being changed.
     */
    
    var ng = $.map(nodeList[nd].proportions, function(e, i) { if(e.group === newgroup) return i; })[0];
    var og = $.map(nodeList[nd].proportions, function(e, i) { if(e.group === oldgroup) return i; })[0];
    
    /*
     * If ng is undefined, it means that the haplogroup has no elements classified
     * as 'newgroup'. Add this new group to 'proportions' property, with a value 
     * of 1, and remove one element from the value of the old group. If both ng and 
     * og are defined, increment the proportions' value of ng and decrement the 
     * value of og.
     */
    
    if ( typeof og !== 'undefined' ) {
      if( typeof ng !== 'undefined' ) {
        nodeList[nd].proportions[ng].value++;
        nodeList[nd].proportions[ng].color = '#'+newcolor;
        nodeList[nd].proportions[ng].pattern = newpattern;
        nodeList[nd].proportions[og].value--;           
      } else {
        nodeList[nd].proportions.push({color: '#'+newcolor, group: newgroup, radius: nodeList[nd].radius, value: 1, pattern: newpattern });
        nodeList[nd].proportions[og].value--;
      }
      
      /*
       * Find the target svg element (node). If it exists, apply changes
       */
      
      if (svg) {
        var name = '#'+nodeList[nd].name;
        var n = svg.select(name);
        var p = n.selectAll('path').remove();
        p = n.selectAll('path').data(function(d) { return pie(d.proportions); });
        p.enter()
        .append('path')
        .attr('d', sector)
        .style('fill', function(d, i) {
          if (d.data.pattern === 'none' ) return d.data.color;
          else return d.data.pattern; 
        });
        if (outlinenodes) {
          p.style('stroke-width', linewidth/2 ).style('stroke', '#000000');
        } else {
          p.style('stroke-width', '0').style('stroke', 'none');
        }        
        p.exit().remove();
      }
    } else {
      w2alert('Serious error!', 'ERROR');
    } 
  }
}

