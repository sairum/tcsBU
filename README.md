# tcsBU

> **NOTE**: A paper describing tcsBU has been published in the journal *Bioinformatics* and is already available at their [Advance Access](http://bioinformatics.oxfordjournals.org/content/early/2015/11/18/bioinformatics.btv636.long) site. Please cite as 

>> Santos, AM, Cabezas MP, Tavares AI, Xavier R, Branco M (2015) tcsBU: a tool to extend TCS network layout and visualization. *Bioinformatics*, btv636 (doi: 10.1093/bioinformatics/btv636)

> **NOTE2**: The link to the online version of the software provided in the paper (http://cibio.up.pt/software/tcsBU) is not working due to a server misconfiguration that we cannot solve. However, using the complete URL (http://cibio.up.pt/software/tcsBU/index.html) should work for now.

## a TCS network beautifier

TCS (Clement *et al.* 2000) is among the most popular haplotype network reconstruction methods. Written in Java, it is based on the *Statistical Parsimony* algorithm developed by Templeton *et al.* (1992). Unfortunately, TCS has some major limitations related with its output: 

- the graphics are coarse and often not ready for publication, even after usage of the `spring` method (force-directed layout algorithm) to improve network layout
- there is no built-in way of classifying haplotypes and displaying that information in haplogroups
- when more than one network is present in the data, the software cannot use its `spring` algorithm to layout multiple graphs, resulting in a set of overlapping networks that have to be disentangled manually. 

As a consequence, it takes a significant effort to edit the resulting PostScript vector file in a vector manipulation software, such as Inkscape or Adobe Illustrator&reg;. **tcsBU** (read **TCS Bee You**) was developed to allow the production of publication-ready networks resulting from TCS analysis without too much effort. Users are able to classify haplotypes (for example, according to sampling locations or dates) and this information is displayed in pie-chart like haplogroups within the network. Groups can be classified using colors, patterns or a combination of both. The final network can be saved as a Scalable Vector Graphics (SVG) format, a World Wide Web Consortium (W3C) standard, which can then be directly embedded in some word processors (e.g., LibreOffice, OpenOffice), or edited and exported to other type of graphic format using modern vector manipulation programs.

## The software

**tcsBU** is a browser-based javascript program that can be served by an HTTP server or can be installed directly into a standard folder and run directly by any modern browser. In a server-based installation **tcsBU** does not impose any burden on the server besides serving the javascript libraries. All computations are done by the browser itself. **tcsBU** depends on a few third-party libraries (license type in parenthesis):

- [JQuery](https://jquery.com/) (MIT): the underlying Javascript engine
- [w2ui](http://w2ui.com/) (MIT): JQuery-based User Interface
- [d3.js](http://d3js.org/) (BSD): graphics engine (force-directed graph layout)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (X11/MIT): implements file saving with the browser without depending on the `download` HTML5 attribute which is partially supported (some browsers, such as IE and Safari, do not support the "download" attribute yet)
- [d3-svg-legend](https://github.com/emeeks/d3-svg-legend/) (MIT): A modified version of this code, authored by Michael P Schroeder, was integrated into **tcsBU** source code

**Because many of the above mentioned libraries dropped support for older versions of some browsers, tcsBU will only run on modern ones (Firefox 20+, Chrome 13+, IE 10+, Opera 15+ and Safari 6.1+)**.

## Installation

### Web-server installation
For a web-based installation, the **tcsBU** package can be saved into any directory under the web-server ROOT directory. No further steps are necessary, and users will be able to access the software by pointing their browsers at the specified location (URL). The only files/folders necessary are

* index.html
* docs/
* js/
* css/
* examples/

### Local installation

If no web-server is available, **tcsBU** can be saved into any local directory and run using the `file://` protocol. If a network connection is available, users can click on the `index.html` file, which should automatically open the page in the default browser. If no network connection is available, users should use `tcsbu.html` instead. The difference is that the latter will not try to download the necessary libraries (JQuery, w2ui, d3.js) from their respective Content Delivery Networks (CDNs) but will use the ones shipped with **tcsBU** (found in `js/` directory).

## Usage

The first step is to read a TCS output file, by clicking on the `Load Data` button (top-left). Note that there is no need to manually edit the results in TCS (e.g. by using the *spring* algorithm). Once the TCS analysis is finished you can look for a GML file with extension `.graph`, usually found on the directory where the alignment used by TCS is. The GML (*Graph Modeling Language*) format is simply a text file format supporting network data with a very easy syntax. The GML specification can be found at [this](http://www.fim.uni-passau.de/en/theoretical-computer-science/projects/) site. Users should not touch (edit) the GML file unless they really know what they are doing!

The user interface is self-intuitive. There is a `Help` button with more information on how to fiddle with the parameters of the *force-directed layout algorithm* of `d3.js`, plus information on how to define groups and classify haplotypes.

## Bug Tracking

Have a bug or a feature request? Open an issue here [https://github.com/sairum/tcsBU/issues](https://github.com/sairum/tcsBU/issues). 
Please make sure that the same issue was not previously submitted by someone else.

## Contributing

Your contributions are welcome. However, there are a few things you need to know before contributing:

1. Please check out latest code before changing anything. It is harder to merge if your changes cannot merge cleanly.
2. If you are changing JS files - do all changes in /src folder
3. If you are changing CSS files - do all changes in /src/css
4. If you want to change documentation - do all changes in /docs

## Forking

This software uses [grunt](http://gruntjs.com/) for automation of some tasks (concatenation of javascript files, compression, etc). There is an accompanying Gruntfile.js at the base directory. After downloading the source code, issue the command at the base directory

```
npm install
```

which will install any dependencies (mostly grunt and plug-ins). To build the *tcsBU.js* code just do

```
grunt
```

or

```
grunt watch
```

which will watch for any modification while editing, and will recompile anything if necessary.

## References
* Clement M, Posada D, Crandall KA (2000) TCS: a computer program to estimate gene genealogies. *Molecular Ecology* 9, 1657-1659.
* Templeton AR, Crandall KA, Sing CF (1992) A cladistic analysis of phenotypic associations with haplotypes inferred from restriction endonuclease mapping and DNA sequence data. III. Cladogram estimation. *Genetics* 132, 619-633.



