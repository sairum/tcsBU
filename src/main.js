
  /*
   * Check for File API support. If enabled, go on...
   */
  
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    
    /*
     * Check if FileSave.js works
     */
    
    try {
      var isFileSaverSupported = !!new Blob();
      filesave = true;
    } catch (e) { 
      w2alert('FileSaver.js is not supported! Use a modern browser...<br>'+
            'FileSaver.js is supported by Firefox 20+, Chrome, Chrome<br>'+
            'for Android, IE 10+, Opera 15+ and Safari 6.1+','File Save Failed!');
    }
    
    /*
     * Define a general style for the GUI (w2ui)
     */
    
    var style = 'background-color: #F5F6F7; border: 1px solid silver; padding: 3px';
    
    var groups = getGroupsGrid(style);   
    var haplotypes = getHaplotypesGrid(style);
    
    /*
     * Create a new layout
     */
     
    var layout = getLayout(style, groups, haplotypes);
    
    layout.content('top','<div style="float: left;"><button id="loadData" class="w2ui-btn">Load Data</button></div><div style="float: right;"><button id="help" class="w2ui-btn">Help</button></div>');
    layout.content('left',w2ui.haplotypes);
    layout.content('right',  
                        '<div style="width=100%; height=100%;">'+                    
                        '<div style="width=100%; height=100%;">'+
                        '<p></p>'+
                        //'<div class="w2ui-field"><label>Mass:</label><div><input type="text" id="massFactor" /></div></div>'+
                        '<div class="w2ui-field"><label>Link Distance:</label><div><input type="text" id="linkDistance" /></div></div>'+
                        '<div class="w2ui-field"><label>Link Strength:</label><div><input type="text" id="linkStrength"  /></div></div>'+
                        '<div class="w2ui-field"><label>Friction:</label><div><input type="text" id="friction"  /></div></div>'+
                        '<div class="w2ui-field"><label>Charge:</label><div><input type="text" id="charge"  /></div></div>'+
                        // Do not mess with this
                        //'<div class="w2ui-field"><label>Charge Distance:</label><div><input type="text" id="chargeDistance"  /></div></div>'+
                        '<div class="w2ui-field"><label>Gravity:</label><div><input type="text" id="gravity" /></div></div>'+
                        '</div>'+
                        '<div style="width=100%; height=100%;"><p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="start" name="start" disabled>Start</button></div><p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="stop" name="stop" disabled>Stop</button></div>'+
                        '</div>'+
                        '<div style="margin: 10px; padding-top: 6px; width: 90%; height: 100%; background-color: #EFF0F1;">'+
                        '<p style="text-align: center;">Examples</p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="tcsdata" name="tcsdata">TCS network</button></div><p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="groups" name="groups">Classification Groups</button></div><p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="haplotypes" name="haplotypes">Classified Haplotypes</button></div><p>'+
                        '<div style="text-align: center;"><button class="w2ui-btn" id="gpatterns" name="gpatterns">Groups with patterns</button></div><p>'+
                        '</div>'+
                        '</div>'
                       );
    layout.content('main', '<div id="gview" style="width=100%; height=100%;">'+
                           '<div style="width=50%; padding: 20%; font-size: 160%;">'+
                           '<b>A paper describing tcsBU has been published in the journal <i>Bioinformatics</i>'+
                           ' and is already available at their web site. '+
                           'Please cite as:</b><p>Santos, AM, Cabezas MP, Tavares AI, Xavier R, '+
                           'Branco M (2016) tcsBU: a tool to extend TCS network layout and '+
                           'visualization. <i>Bioinformatics</i>, btv636 '+
                           '(<a href="https://academic.oup.com/bioinformatics/article/32/4/627/1744448/" '+
                           'target="blank">doi: 10.1093/bioinformatics/btv636</a>)'+
                           '</div>'+
                           '</div>');    
    layout.content('bottom','');
     
    /*
     * Add a hidden <input> field to load a graph file (GML)
     */
    
    $('body').append('<input id="loadGraph" type="file" />');

    
    $('#loadGraph').on('change', function (event){ loadGraph(event); });
    $('#loadData').click(function() { $('#loadGraph').click(); });
    
    //$('#massFactor').w2field('float', { min: 1, max: 10, step: 0.5, arrows: true });  
    $('#linkDistance').w2field('float', { min: 0.1, max: 10, step: 0.1, arrows: true });
    $('#linkStrength').w2field('float', { min: 0, max: 1, step: 0.02, arrows: true });  
    $('#friction').w2field('float', { min: 0, max: 1, step: 0.02, arrows: true });
    $('#charge').w2field('int', { min: -1000, max: 1000, step: 10, arrows: true });
    // Do not mess with this!
    // $('#chargeDistance').w2field('int', { min: 0, step: 10, arrows: true }); 
    $('#gravity').w2field('float', { min: 0, max: 1, step: 0.001, arrows: true });
    
    $('#tcsdata').click(function(){
      saveExamples('tcs-output.graph.txt');
    });
    
    $('#groups').click(function(){
      saveExamples('groups.txt');
    });
    
    $('#haplotypes').click(function(){
      saveExamples('haplotypes.txt');
    });
    
    $("#gpatterns").click(function(){
      saveExamples("groups-patterns.txt");
    });
    
    $('#help').click(function(){
      $().w2popup({
        url     : 'docs/help.html', 
        title   : 'tcsBU HELP',
        width   : 800,
        height  : 500,
      });
    });
  } else {
    w2alert('The File APIs are not fully supported by your browser.');
  }
