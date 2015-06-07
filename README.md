# tcsBU
## a TCS network beautifier
TCS (Clement *et al.* 2000) is among the most popular haplotype network reconstruction methods. Written in Java, it is based on the *Statistical Parsimony* algorithm developed by Templeton *et al.* (1992). Unfortunately, TCS has some major limitations related with its output: 

- the graphics are coarse and often not ready for publication, even after usage of the 'spring' method (force-directed layout algorithm) to improve network layout
- there is no built-in way of classifying haplotypes and displaying that information in haplogroups
- when more than one network is present in the data, the software cannot use its 'spring' algorithm to layout multiple graphs, resulting in a set of overlapping networks that have to be disentangled manually. 


As a consequence, it takes a significant effort to edit the resulting PostScript vector file in a vector manipulation software, such as Inkscape or Adobe Illustrator&reg;. **tcsBU** (read *TCS Bee You*) was developed to allow the production of publication-ready networks resulting from TCS analysis without too much effort. Users are able to classify haplotypes (for example, according to sampling locations or dates) and this information is displayed in pie-chart like haplogroups within the network. Groups can be classified using colors, patterns or a combination of both. The final network can be saved as a Scalable Vector Graphics (SVG) format, which can then be easily embedded in a modern word processor or edited and exported to other type of graphics format using a vector manipulation software.

## The software

**tcsBU** is a browser-based javascript program that can be served by an HTTP server or can be installed directly into a standard folder and run directly by any modern browser. In a server-based installation **tcsBU** does not impose any burden on the server besides serving the javascript libraries. All computations are done by the browser itself. **tcsBU** depends on a few third-party libraries (license type in parenthesis):

- [https://jquery.com/](JQuery) (MIT): the underlying Javascript engine
- [http://w2ui.com/](w2ui) (MIT): JQuery-based User Interface
- [http://d3js.org/](d3.js) (BSD): graphics engine (force-directed graph layout)
- [https://github.com/eligrey/FileSaver.js/](FileSaver.js) (X11/MIT): implements file saving with the browser without depending on the "download" HTML5 attribute which is partially supported (some browsers, such as IE and Safari, do not support the "download" attribute yet)
- [https://github.com/emeeks/d3-svg-legend/](d3-svg-legend) (MIT): A modified version of this code, authored by Michael P Schroeder, was integrated into **tcsBU** source code


Because many of the aforementioned libraries dropped support for older versions of some browsers, **tcsBU** will only run on modern ones (Firefox 20+, Chrome, Chrome for Android, IE 10+, Opera 15+ and Safari 6.1+).

## Installation

### Web-server installation
For a web-based installation, the **tcsBU** package can be saved into any directory under the web-server ROOT directory. No further steps are necessary, and users will be able to access the software by pointing their browsers at the specified directory. The only files/folders necessary are

* index.html
* docs/
* js/
* css/

### Local installation

If no web-server is available, **tcsBU** can be saved into any local directory and run using the 'file://' protocol. If an network connection is available, users can click on the *index.html* file, which should automatically open the default browser. If no network connection is available, users should use *tcsbu.html* instead. The difference is that the latter will not try to download the necessary libraries (JQuery, w2ui, d3.js) from their respective Content Delivery Networks (CDNs) but will use the ones shipped with **tcsBU** (found in *js/* directory)

## References
- Clement M, Posada D, Crandall KA (2000) TCS: a computer program to estimate gene genealogies. *Molecular Ecology* 9, 1657-1659.
- Templeton AR, Crandall KA, Sing CF (1992) A cladistic analysis of phenotypic associations with haplotypes inferred from restriction endonuclease mapping and DNA sequence data. III. Cladogram estimation. *Genetics* 132, 619-633.
