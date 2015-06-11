/*
 * Create an SVG pattern definition to be used as an URL
 * 'idx' is the 
 */

function createPattern(pat, col) {
  if(pat === 'none') return;
  var name = col+pat;
  var p = defs.append("pattern");
      p.attr( "id", name)
       .attr( "patternUnits", "userSpaceOnUse")
       .attr( "width", 10 )
       .attr( "height", 10 );
       
      /*
       * Append a rect that will hold the background color
       */
      
      p.append("rect")
       .attr("width", "10")
       .attr("height", "10")
       .attr("x", "0")
       .attr("y", "0")
       .attr("fill", "#" + col)
       .attr("stroke-width", "0");
       
  switch(pat){
    case 'lines-1':
      p.append('path')
       .attr('d', 'M3,0 V10 M8,0 V10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'lines-2':
      p.append('path')
       .attr('d', 'M3,0 V10 M8,0 V10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;
    case 'lines-3':
      p.append('path')
       .attr('d', 'M0,3 H10 M0,8 H10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'lines-4':
      p.append('path')
       .attr('d', 'M0,3 H10 M0,8 H10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;
    case 'lines-5':
      p.append('path')
       .attr('d', 'M4,-1 l10,10 M-1,4 l10,10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'lines-6':
      p.append('path')
       .attr('d', 'M4,-1 l10,10 M-1,4 l10,10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;      
    case 'lines-7':
      p.append('path')
       .attr('d', 'M4,-1 l-10,10 M2,11 l10,-10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'lines-8':
      p.append('path')
       .attr('d', 'M4,-1 l-10,10 M2,11 l10,-10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;        
    case 'cross-1':
      p.append('path')
       .attr('d', 'M3,0 V10 M8,0 V10 M0,3 H10 M0,8 H10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'cross-2':
      p.append('path')
       .attr('d', 'M3,0 V10 M8,0 V10 M0,3 H10 M0,8 H10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;
    case 'cross-3':
      p.append('path')
       .attr('d', 'M0,0 L10,10 M10,0 L0,10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 0.5);
      break;
    case 'cross-4':
      p.append('path')
       .attr('d', 'M0,0 L10,10 M10,0 L0,10')
       .attr('stroke', '#000000')
       .attr('stroke-width', 1.5);
      break;      
    case 'circles-1':
      p.append("rect").attr({ width:"10", height:"10", fill: "#" + col});
      p.append("circle")
       .attr({ cx: 2, cy: 2, r: 1, transform:"translate(0,0)", fill:"#000000" });
      p.append("circle")
       .attr({ cx: 2, cy: 7, r: 1, transform:"translate(0,0)", fill:"#000000" });
      p.append("circle")
       .attr({ cx: 7, cy: 2, r: 1, transform:"translate(0,0)", fill:"#000000" });
      p.append("circle")
       .attr({ cx: 7, cy: 7, r: 1, transform:"translate(0,0)", fill:"#000000" }); 
      break;
    case 'circles-2':
      p.append("rect").attr({ width:"10", height:"10", fill: "#" + col});
      p.append("circle")
       .attr({ cx: 5, cy: 5, r: 3, transform:"translate(0,0)", fill:"#000000" })
      break;
  }  
}