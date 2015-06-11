function updateSVG() {
  link = svg.selectAll('.link').remove();
  link = svg.selectAll('.link').data(linkList);
  link.enter().append('line')
              .attr('class', 'link')
              .attr('id', function(d) { return d.name; } )
              .on('mouseover', function(){ d3.select(this).style({'stroke': '#FF011B', 'stroke-width': linewidth*3}); })
              .on('mouseout', function(){ d3.select(this).style({'stroke': '#000000', 'stroke-width': linewidth});})
              .on('click', clickLink)
              .append('title')
              .text(function(d, i) { return d.changes; });
              
  link.style('stroke-width', linewidth ).style('stroke', '#000000');           
  link.exit().remove();
  node = svg.selectAll('.node').remove();
  node = svg.selectAll('.node').data(nodeList);
  node.enter().append('g')
              .attr('class', 'node')
              .attr('id', function(d) { return d.name; } )
              .on('click', clickNode)
              .call(drag)
              .insert('circle')
              .attr('r', function(d){ return d.radius;})
              .on('mouseover', function(){ d3.select(this).style({'stroke': '#FF011B', 'stroke-width': linewidth*4 }); })
              .on('mouseout', function(){d3.select(this).style({'stroke': '#000000', 'stroke-width': linewidth*2 });})
              .append('title')
              .text(function(d, i) { return d.name; });
  node.style('stroke-width', function(){ return linewidth*2; }).style('stroke', '#000000').style('fill', 'white');
  node.exit().remove();
              
  path = node.selectAll('path').remove();
  path = node.selectAll('path').data(function(d, i) { return pie(d.proportions); });
  path.enter()
      /*
       * Using the construct below, the arcs are inserted before the circle of the
       * node. It allows for some interactions (e.g., coloring the whole circle, etc,
       * and avoids the css use of 'path { pointer-events: none; }' to allow the
       * node (which is below) to capture 'mouseover' and 'mouse out' events
       */
      .append('path')
      .attr('d', sector)
      .style('fill', function(d) { 
        if (d.data.pattern === 'none' ) return d.data.color;
        else return d.data.pattern;
      });
      
      /*
       * These two commands may be used to implement
       * a stroke between arcs in the pie
       * .style('stroke-width', '0')
       * .style('stroke', 'none');
       */
       if (outlinenodes) {
         path.style('stroke-width', linewidth/2 ).style('stroke', '#000000');
       } else {
         path.style('stroke-width', '0').style('stroke', 'none');
       }
  path.exit().remove();
  
  force.nodes(nodeList).links(linkList).start();
}