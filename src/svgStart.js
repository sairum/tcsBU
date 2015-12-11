
function zoomByFactor(factor) {
  if(!zoom) return;
  var scale = zoom.scale();
  var extent = zoom.scaleExtent();
  var newScale = scale * factor;
  var w = $('#gview').width();
  var h = $('#gview').height();
  if (extent[0] <= newScale && newScale <= extent[1]) {
    var t = zoom.translate();
    var c = [w / 2, h / 2];
    zoom
      .scale(newScale)
      .translate(
        [c[0] + (t[0] - c[0]) / scale * newScale, 
         c[1] + (t[1] - c[1]) / scale * newScale])
      .event(svg.transition().duration(350));
  }
}

function svgStart() {
  
  var massFactor = 0;
  var lnkdist = defaultLinkDistance;
  var lnkstre = defaultLinkStrength;
  var frict = defaultFriction;
  var chrg = defaultCharge;
  // Do not mess with this
  // var chrgdist = Infinity;
  var grav = defaultGravity; 
  
  /*
   * clear linkList if not empty
   */
  
  linkList = [];
  
  /*
   * arry of nodes is in global var 'nodeList'
   * array of edges is in global variable 'edgeList'
   * 
   * Sort nodes based on radius size (frequency) so that smaller nodes
   * are added last to the list and will be on top of the bigger 
   * ones, thus avoiding being hidden by the latter upon draw
   * */
  
  nodeList.sort(function comp(a,b) { var r = (a.radius<b.radius)? 1 :(a.radius>b.radius) ?  -1 :  0; return r;});
 
  /* The 'edges' array has source/target node pairs. However, since nodeList was
   * sorted, these pairs are not synced with the index of the nodes array anymore. 
   * We build a 'linkList' array by pushing from the the nodeList array the 'target'
   * and 'source' nodes and passing them as objects for the linkList. We also
   * use the radius of the nodes to set an ideal link distance which is equal to the
   * sum of their radii, plus the default distance between two nodes with radii = 1
   */
  
  var pair;
  
  for(var i=0;i<edgeList.length;i++){
    pair = nodeList.filter(function(e) { return (e.id === edgeList[i].source) || (e.id === edgeList[i].target); } );
    if (pair.length == 2) 
      linkList.push({source: pair[0], target: pair[1], id: "Link " + edgeList[i].id, ldist: pair[0].radius+pair[1].radius+lnkdist+defaultDistance, changes: edgeList[i].changes});
  }
    
  /*
   * Redraw elements on zoom/pan
   */
  
  zoom = d3.behavior.zoom().on("zoom", zoom_redraw);   
  
  function zoom_redraw () {
    svg.attr("transform", "translate(" + zoom.translate() + ")" + "scale(" + zoom.scale() + ")"    );
  }
  
  /*
   * Compute 'view' width and height
   */
  
  var w = $('#gview').width();
  var h = $('#gview').height();
  
  /*
   * Remove paper advertisement from main DIV
   */
  
  $('#gview').empty();
  
  /*
   * Define the main svg element 
   */
  
  svg = d3.select('#gview')
          .append('svg')
          .attr('id','SVG')
          .attr("width", "100%")
          .attr("height","100%")
          .attr("viewBox", "0 0 " + w + " " + h)
          .attr("preserveAspectRatio", "xMidYMid meet") 
          //.call(d3.behavior.zoom().on("zoom", zoom_redraw))
          .call(zoom)
          .append('g');
  
  /* 
   * Define a baseline force layout
   */
  
  force = d3.layout.force()
            .charge(function(d){
               if(d) return d.radius*chrg; 
               else return chrg; 
             })              
             .linkDistance(function(d){
               if(d) return d.ldist*lnkdist;
               else return lnkdist; 
             })
             .gravity(grav)
             .friction(frict)
             .linkStrength(lnkstre)
             .chargeDistance(Infinity)
             .size([w, h])
             .on('end', function() { 
               $('#stop').prop('disabled',true);
               $('#start').prop('disabled',false);
             })
             .on('start', function() { 
               $('#stop').prop('disabled',false);
               $('#start').prop('disabled',true);
             });
           
  /*
   * Define a layout for pie charts
   */
  
  pie = d3.layout.pie()
              .sort(null)
              .value(function(d) { return d.value; });
  /*
   * Define an arc
   */
  
  sector = d3.svg.arc()
                  .outerRadius(function(d) { return d.data.radius; })
                  .innerRadius(0);      
                  
  
  /*
   * Create SVG patterns for the groups defined (except for default group 0)
   */
  
  defs = svg.append("defs");
  
  for (var i = 1; i < w2ui.groups.records.length; i++ ) {
    if (w2ui.groups.records[i].pattern !== 'none') createPattern(w2ui.groups.records[i].pattern, w2ui.groups.records[i].color);
  }
  
  /*
   * Define what to do ineach iteration of force layout
   */
  
  force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });  
      node.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
  
  /*
   * Define costum drag
   */
  
  drag = force.drag().on("dragstart", function(d) {
    d3.event.sourceEvent.stopPropagation();
  });
                  
  /*
   * Delete a selected node
   */
  
  clickNode = function (e) {
    if ( deletenode ) {
      nodeList.splice(nodeList.indexOf(e),1);
      var toSplice = linkList.filter(function(l) { return (l.source === e) || (l.target === e); });
      toSplice.map(function(l) { linkList.splice(linkList.indexOf(l), 1); });
      updateSVG();
    }
  };
  
  /*
   * Delete a selected link
   */
  
  clickLink = function (e) {  
    if ( deletelink ) {
      linkList.splice(linkList.indexOf(e), 1);
      updateSVG();
    }
  };                  
      
  /*
  function massChanged(path, e){
    var arcOver = d3.svg.arc().outerRadius(function(d) { return d.data.radius*e; });
    path.transition().duration(1000).attr("d", arcOver);
   // force.start();
  };
  $('#massFactor').on('change', function (event){ event.onComplete = massChanged(path, event.target.value) } );
  */

  /*
   * charge changed during operation
   */
  
  function chargeChanged(e){
    force.stop();
    chrg=e;
    force.start();
  }
  
  $('#charge').on('change', function (event){ event.onComplete = chargeChanged(event.target.value); } ); 
  
  /*
   * linkDistance changed
   */
  
  function linkDistanceChanged(e){
    force.stop();
    lnkdist=e;
    force.start();
  }
  
  $('#linkDistance').on('change', function (event){ event.onComplete = linkDistanceChanged(event.target.value); } );    

  /*
   *  linkStrength changed
   */
  
  function linkStrengthChanged(e){
    force.stop().linkStrength(e).start();
  }
  
  $('#linkStrength').on('change', function (event){ event.onComplete = linkStrengthChanged(event.target.value); } );  
  
  /* 
   * friction changed
   */
  
  function frictionChanged(e){
    force.stop().friction(e).start();    
  }
  
  $('#friction').on('change', function (event){ event.onComplete = frictionChanged(event.target.value); } );     
  
  /* 
   * chargeDistance changed
   * 
   * Better not to mess with this
   */
  
  /*
  function chargeDistanceChanged(e){
    //console.log('Dist:',e)
    //if(e==='') e =100000;
    force.stop().chargeDistance(e).start();
    //if(e>10000) e = Infinity;
    //force.start();
  };
  $('#chargeDistance').on('change', function (event){ event.onComplete = chargeDistanceChanged(event.target.value) } ); 
  */
  
  /*
   * gravity changed
   */
  
  function gravityChanged(e){
    force.stop().gravity(e).start();
  }
  
  $('#gravity').on('change', function (event){ event.onComplete = gravityChanged(event.target.value); } );
  
  /*
   * update current/default values in UI controld
   */
  
  $('#linkDistance').attr('value', lnkdist);
  $('#linkStrength').attr('value', lnkstre);
  $('#friction').attr('value', frict);
  $('#charge').attr('value', chrg);
  // Do not mess with this
  //$('#chargeDistance').attr('value', chrgdist);
  $('#gravity').attr('value', grav);
  $('#lwidth').attr('value', linewidth);
  
  /*
   * Disable 'start' button 
   */
  
   $('#start').prop('disabled',true).on('click', function (event){ 
    /*
     * Disable 'start' button
     */
    $('#start').prop('disabled',true);
    /*
     * Enable stop button
     */
    $('#stop').prop('disabled',false);
    updateSVG();
  });
  
  $('#stop').prop('disabled',false).on('click', function (event){ 
    /*
     * Disable 'stop' button
     */
    $('#stop').prop('disabled',true);
    /*
     * Enable 'start' button
     */
    $('#start').prop('disabled',false);
    force.stop();
  });
  
  $('#reset').prop('disabled',false);

  /*
   * Enable editing buttons
   */
  
  w2ui.Layout_main_toolbar.enable('btn-dellink', 'btn-delnode', 'btn-svgsave','btn-outline','btn-lwidth', 'btn-zoomin', 'btn-zoomout', 'btn-legend');
  
  
  /*
   * Now star the force layout algorithm and update the SVG!
   */
  
  updateSVG();
  
}
