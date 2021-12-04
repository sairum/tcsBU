/*
 * Construct the layout
 */

function getLayout(style, groups, haplotypes){
  $('#layout').w2layout({
    name    : 'Layout',
    padding : 0,
    panels  : [
      { type: 'top', size: 40, resizable: false, style: style },
      { type: 'left', size: 350, maxSize: 350, resizable: true, title: 'Data', style: style,
        tabs: {
          name: 'tabs',
          active: 'tab1',
          tabs: [
            { id: 'tab1', text: 'Haplotypes' },
            { id: 'tab2', text: 'Groups' },
          ],
          onClick: function (id) {
            switch(id.target){
              case 'tab1': w2ui.Layout.html('left',haplotypes); break;
              case 'tab2': w2ui.Layout.html('left',groups); break;
            }  
          }
          
        }
      },
      { type: 'right', size: 250, resizable: false, title: 'Settings', style: style },
      { type: 'main', size: '100%', overflow: 'hidden', style: style,
        toolbar: {
          items: [
            { id: 'btn-svgsave', type: 'button', text: 'Save SVG', icon: 'icon-file-svg', disabled: true },
              //{ id: 'btn-pdfsave', type: 'button', text: 'Save PDF', icon: 'icon-file-pdf-o', disabled: true },
            { type: 'break' },
            { id: 'btn-zoomin', class: 'zoom-btn', type: 'button', text: 'Zoom In', icon: 'icon-zoom-in', disabled: true },
            { id: 'btn-zoomout', class: 'zoom-btn', type: 'button', text: 'Zoom Out', icon: 'icon-zoom-out', disabled: true },
            { type: 'break' },
            { id: 'btn-delnode', type: 'check', text: 'Delete Node', icon: 'icon-delete-node', disabled: true, checked: false },
            { id: 'btn-dellink', type: 'check', text: 'Delete Link', icon: 'icon-delete-link', disabled: true, checked: false },
            { type: 'break' },
            { id: 'btn-outline', type: 'check', text: 'Outline', icon: 'icon-outline', disabled: true, checked: false },
            { id: 'btn-lwidth', type: 'menu', text: 'Line width', icon: 'icon-line-width', disabled: true,
                  items: [
                    { text: '0.1 px', lwidth: "0.1" }, 
                    { text: '0.2 px', lwidth: "0.2" }, 
                    { text: '0.4 px', lwidth: "0.4" },
                    { text: '0.6 px', lwidth: "0.6" }, 
                    { text: '0.8 px', lwidth: "0.8" }, 
                    { text: '1.0 px', lwidth: "1.0" },
                    { text: '1.5 px', lwidth: "1.5" }, 
                    { text: '2.0 px', lwidth: "2.0" }
                  ]                
             },
             { id: 'btn-legend', type: 'check', text: 'Legend', icon: 'icon-legend', disabled: true, checked: false },
          ],
          onClick: function (e) {
            var target = e.target;
            switch(target){
              case 'btn-dellink':
                if (!e.item.checked) deletelink = true;
                else deletelink = false;
                break;
              case 'btn-delnode':
                if (!e.item.checked) deletenode = true;
                else deletenode = false;
                break;
              case 'btn-svgsave': saveSVG(); break;  
              case 'btn-outline':
                if (!e.item.checked) outlinenodes = true;
                else outlinenodes = false;
                if (svg) updateSVG();
                break; 
              case 'btn-zoomin':
                zoomByFactor(1.2);
                break;
              case 'btn-zoomout':
                zoomByFactor(0.8);
                break;
              case 'btn-legend':
                insertLegend();
                break;   
              default: 
                /*
                 * If event.target is none of the above, it must 
                 * be 'btn-lwidth'. Check if true and apply the
                 * selection
                 */
                if( target.indexOf('btn-lwidth:') !== -1 ){
                  linewidth = e.subItem.lwidth;
                  if (svg) updateSVG();
                }
            }
          },
        },      
      },
      { type: 'bottom', size: 30, resizable: false, style: style, content: 'Start'}
    ],
  });
  if(w2ui.Layout) return w2ui.Layout;
  else return null;
}  
