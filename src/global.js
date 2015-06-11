/*
 * the svg variable (holds the <SVG> element in DOM)
 */

var svg = null;

/*
 * the 'force-directed layout', 'pie' and 'arc' variables for d3.js
 */

var force = null;

/*
 * holder for SVG definitions
 */

var defs = null;

/*
 * variables that hold nodes and edges read from a file
 */

var nodeList  = [],
    edgeList  = [],
    linkList  = [];

/*
 * variables that determine if clicks delete nodes/links
 */

var deletelink = false,
    deletenode = false,
    outlinenodes = false;

/*
 * Define some default values for 'force-directed layout' algorithm
 */
  
  var defaultDistance = 12,
      defaultGravity = 0.05,
      defaultCharge = -30,
      defaultLinkDistance = 1,
      defaultLinkStrength = 1,
      defaultFriction = 0.95;
      
/*
 * standard radius for true haplogroups with 'frequency' = 1
 */

var standardRadius = 5;

/*
 * Radius of mouse target for selection of nodes/links
 */

var detectionRadius = 5;

/*
 * Variables for the forced layout algorithm elements
 */

var link, node, path;

var pie, sector;

var drag;

var clickLink, clickNode;

/*
 * Default line width
 */

var linewidth = 1;

/*
 * Default zoom
 */

var zoom = null;

/*
 * Legend 0 -off, 1 - on
 */

var legend = 0;

/*
 * Save File available?
 */

var filesave = false;

/*
 * Pattern names. See definitions in 'createPattern.js'
 */

var pattern_names = [
  { id: 'none'},
  { icon: 'icon-circles-1', id: 'circles-1'},
  { icon: 'icon-circles-2', id: 'circles-2'},
  { icon: 'icon-lines-1', id: 'lines-1'},
  { icon: 'icon-lines-2', id: 'lines-2'},
  { icon: 'icon-lines-3', id: 'lines-3'},
  { icon: 'icon-lines-4', id: 'lines-4'},
  { icon: 'icon-lines-5', id: 'lines-5'},
  { icon: 'icon-lines-6', id: 'lines-6'},
  { icon: 'icon-lines-7', id: 'lines-7'},
  { icon: 'icon-lines-8', id: 'lines-8'},
  { icon: 'icon-cross-1', id: 'cross-1'},
  { icon: 'icon-cross-2', id: 'cross-2'},
  { icon: 'icon-cross-3', id: 'cross-3'},
  { icon: 'icon-cross-4', id: 'cross-4'}
];


