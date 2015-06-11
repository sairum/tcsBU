// The haplotype's grid



function getHaplotypesGrid(style){
  
  /*
   * Append an <input> element at the end of the body. This will serve as an anchor to be used
   * by button 'loadHaplotypes' to browse files for reading an haplotype's file (csv delimited text
   * file with two columns: haplotype names and group names
   */
  
  $('body').append('<input id="loadHaplotypes" type="file" />');
  
  /*
   * After selecting a file, this triggers loadHaplotypes function
   */
  
  $('#loadHaplotypes').on('change', function (e){ loadHaplotypes(e); } );
  
  /*
   * Clear the input field on each 'click', thus allowing to read the 
   * same file after it is modified externally. Otherwise, the file 
   * won't load a second time it is opned!
   */
  
  //$('#loadHaplotypes').on('click', function (){ this.value = null; } );
  
  $().w2grid({
    name: 'haplotypes',
    multiSelect: false,
    show: {header: false, toolbar: true, footer: true, lineNumbers: false, toolbarSearch: false, toolbarReload: false, toolbarColumns: false, toolbarAdd: false, toolbarDelete: false, toolbarEdit: false },
    columns: [
      { field: 'recid', caption: 'Label', size: '55%', sortable: true, resizable: true },
      { field: 'haplogroup', hidden: true },
      { field: 'color', hidden: true },
      { field: 'group', caption: 'Group', size: '45%', sortable: true, resizable: true, editable: { type: 'combo', items: ['Default'], filter: false }, 
          render: function (r) {
            var color = parseInt(r.color,16);
            var textcolor;
            if ( color > 8388607 ) textcolor = '#000000';
            else textcolor = '#ffffff';
            return '<div style="background-color: #' + r.color + '; color: ' + textcolor + '">' + r.group + '</div>'; 
          }
      },
    ],
    toolbar: {
      items: [
        { type: 'button', id: 'load_haplotypes', caption: 'Load', icon: 'icon-folder-open'},
        { type: 'button', id: 'save_haplotypes', caption: 'Save', icon: 'icon-file-save'}
      ],
      onClick: function (e) {
        switch(e.target){
          case 'load_haplotypes':    
	    
            /*
             * Bail out if there is no haplotype list already defined
             */
	      
            if(w2ui.haplotypes.records.length === 0) {
              w2alert(
               'No data loaded yet. Haplotype/Groups data can  <br>'+
               'only be imported when a list of haplotypes has <br>'+
               'already been loaded through "Load Data" button.<br>',
               'Data not yet loaded!'
	      );
	    } else { 
              $('#loadHaplotypes').click();     
	    }
	    break;
	  case 'save_haplotypes': 
            saveHaplotypes();
            break;   
	}  
      }
    },
    onChange: function (e) {
      e.preventDefault();
           
      /*
       * get the new group index of this particular haplotype
       */     
      
      var r = w2ui.groups.find({recid: e.value_new},true)[0];
      
      /*
       * if groups' name exist just change the name and color in haplotypes.
       * Otherwise use defaults
       */
      
      if( typeof r !== 'undefined' ) {
        w2ui.haplotypes.records[e.index].group = w2ui.groups.records[r].recid;
        w2ui.haplotypes.records[e.index].color = w2ui.groups.records[r].color;
      } else {
        w2ui.haplotypes.records[e.index].group = 'Default';
        w2ui.haplotypes.records[e.index].color = 'ffffff';
      }
      
      classify(e.index, e.value_new, e.value_original);
    },
    onEditField: function(e) {
      var items = [];
      var grplist = w2ui.groups.records;
      for (var i = 0; i< grplist.length; i++) {
        items.push( grplist[i].recid );
      }  
      this.columns[3].editable.items = items;
    }
  });
  if(w2ui.haplotypes) return w2ui.haplotypes;
  else return null;
}  