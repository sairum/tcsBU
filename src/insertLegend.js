function insertLegend(){
  if(legend === 0){
    legend = 1;
    
    var grouplist = [];
    var colorlist = [];
    var g = w2ui.groups.records;
    for(var i = 1; i < g.length; i++ ) { 
      grouplist.push ( g[i].recid );
      if(g[i].pattern !== 'none' ) colorlist.push ("url(#" + g[i].color+g[i].pattern+")");
      else colorlist.push ( '#'+g[i].color);
    }  
    
    //var sampleOrdinal = d3.scale.category20().domain(grouplist);
    
    var lg = d3.scale.ordinal();
    lg.domain(grouplist);
    lg.range(colorlist);
    var verticalLegend = d3.svg.legend().labelFormat('none').cellPadding(5).orientation('vertical').units('Groups').cellWidth(25).cellHeight(18).inputScale(lg).cellStepping(10);

    d3.select('svg').append('g').attr('transform', 'translate(50,140)').attr('class', 'legend').call(verticalLegend);
  }
  else {
    legend = 0;
    $('.legend').remove();
    
  }
}
