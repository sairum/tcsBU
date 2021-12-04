/*
 * The group's grid
 */

function getGroupsGrid(style){
  
  /*
   * Append an <input> element at the end of the body. This will serve as an anchor to be used
   * by button 'loadGroups' to browse files for reading a group's file (csv delimited text
   * file with two columns: group names and rgb colors
   */
  
  $('body').append('<input id="loadGroups" type="file" />');
  
  /*
   * After selecting a file, this triggers loadGroups function
   */
  
  $('#loadGroups').on('change', function (e){ loadGroups(e); } );
  
  /*
   * Clear the input field on each 'click', thus allowing to read the 
   * same file after it is modified externally. Otherwise, the file 
   * won't load a second time it is opned!
   */
  
  $('#loadGroups').on('click', function (){ this.value = null; } );
  
  /*
   * Use w2ui to build the group's grid
   */
  
  $().w2grid({
    name: 'groups',
    multiSelect: false,
    show: {header: false, toolbar: true, footer: true, lineNumbers: false, toolbarSearch: false, toolbarInput:false, toolbarReload: false, toolbarColumns: false, toolbarSave: false, toolbarAdd: false, toolbarDelete: false, toolbarEdit: false },
    columns: [
      { field: 'recid', caption: 'Group', size: '45%', sortable: false, resizable: false, editable: { type: 'text' },
        render: function (r) {
          return '<div style="font-weight: bold">'+r.recid+'</div>';
        }
      },
      { field: 'color', caption: 'Color', size: '20%', sortable: false, resizable: false, editable: { type: 'color'},
        render: function (r) {
          return '<div style="background-color: #'+r.color+'">&nbsp;</div>';
        }
      },
      { field: 'pattern', caption: 'Pattern', size: '35%', sortable: false, resizable: false, editable: { type: 'combo', items: pattern_names, filter: false },
        render: function (r) {
          return '<div>'+r.pattern+'</div>';
        }
      }
    ],
    records: [
      { recid: 'Default', color: 'ffffff', pattern: 'none', editable: false }
    ],
    toolbar: {
      items: [
        { type: 'button', id: 'add_group', text: 'Add', icon: 'w2ui-icon-plus' },
        { type: 'button', id: 'del_group', text: 'Delete', icon: 'w2ui-icon-cross' },
        { type: 'button', id: 'load_group', text: 'Load', icon: 'icon-folder-open' },
        { type: 'button', id: 'save_group', text: 'Save', icon: 'icon-file-save' }
      ],
      onClick: function (e) {
        switch(e.target){
          case 'add_group': 
            e.preventDefault();
      
            /*
             * Check if a group with the default name ('New Group') exists! If so get out...
             */
      
            var v = w2ui.groups.find({recid: 'New Group'}, true);
            if( v.length > 0 ) w2alert('A group named "New Group" already exists! <p> Change its name first...');
            else {
              w2ui.groups.add({ recid: 'New Group', color: 'ffffff', pattern: 'none' });
              this.refresh(); 
            }  
            break;
          case 'del_group':
            e.force = true;
            var sel   = w2ui.groups.getSelection()[0];
            

            /*
             * Check if selected group is the default one [0]
             */
      
            if ( sel === 0 ) {
              e.preventDefault();
              w2alert('Cannot delete "default" group/color...');
            } else {
        
              /*
               * Check if 'haplotype' grid is already defined and that no 
               * record of w2ui.haplotypes references this record from w2ui.groups
               */
        
              if(w2ui.haplotypes) {
                var h = w2ui.haplotypes.records.filter(function (o){return o.group === sel; } );
                if( h.length > 0) {
                  e.preventDefault();
                  w2alert('This group is being referenced in haplotype list!<p>Change it there, and then delete it...');
                } else {
                  w2ui.groups.delete(true);
                }
              }
              else w2ui.groups.delete(true);
            }
            break;
          case 'load_group': $('#loadGroups').click(); 
             break;
          case 'save_group': 
            saveGroups();
            break;   
        }
        
        if(legend === 1){
          $('.legend').remove();
          legend = 0;
          insertLegend();
        }
      }
    },
    onChange: function (e) {
      var i;
      e.preventDefault();
      switch(e.column) {    
        case 0:  // Change a name
          
          /*
           * Check if a group with the same name already exists! If so get out...
           */
        
          var v = w2ui.groups.find({ recid: e.value_new }, true);
          if( v.length > 0 ) {
            w2alert('A group named "'+e.value_new+'" already exists! <p> Change its name first...');
          } else {
            w2ui.groups.records[e.index].recid = e.value_new;
              
            /*
             * If this name is in haplotype list, change it as well
             */

            v = w2ui.haplotypes.find({ group: e.value_original }, true);
            if( typeof v !== 'undefined'  && v.length > 0) {
              for (i = 0; i < v.length; i++ ) {
                w2ui.haplotypes.records[v[i]].group = e.value_new;
                if( svg ) classify(v[i], e.value_new, e.value_original);
              }
            } 
          }
          break;
        case 1: // Change a color      
          
          w2ui.groups.records[e.index].color = e.value_new;
          
          /*
           * If there is a pattern, update it
           */
          
          if (w2ui.groups.records[e.index].pattern !== 'none' ) {
            $("#"+e.value_original+w2ui.groups.records[e.index].pattern).remove();
            createPattern(w2ui.groups.records[e.index].pattern, e.value_new);
          }
          
          
          /*
           * If this name is in haplotype list, change its color as well
           */
          
          v = w2ui.haplotypes.find({ group: e.recid }, true);
          if( typeof v !== 'undefined' && v.length > 0) {
            for (i = 0; i < v.length; i++ ) {
              w2ui.haplotypes.records[v[i]].color = e.value_new;
              if( svg ) classify(v[i], e.recid, e.recid);
            }
          } 
          break;
          
        case 2: // Change a pattern

          w2ui.groups.records[e.index].pattern = e.value_new;
          
          /*
           * Update the SVG
           */
          
          if( svg ) {
            var c = w2ui.groups.records[e.index].color;
            if ( e.value_original !== 'none' ) $("#"+c+e.value_original).remove();
            if ( e.value_new !== 'none' ) createPattern(e.value_new, c);
              
            /*
             * Reclassify any haloptypes that belong to this group
             */
              
            v = w2ui.haplotypes.find({ group: e.recid }, true);
            if( typeof v !== 'undefined' && v.length > 0) {
              for (i = 0; i < v.length; i++ ) {
                classify(v[i], e.recid, e.recid);
              }
            } 
          } 
          break;
      }    
      
      /*
       * If legend is present, delete it and redraw it
       */
          
      if(legend === 1){
        $('.legend').remove();
        legend = 0;
        insertLegend();
      }
      
      this.refresh();
    }    
  });
  if(w2ui.groups) return w2ui.groups;
  else return null;
}
