## tcsBU
##a TCS network beautifier
TCS (Clement et al.>, 2000) is among the most popular haplotype network reconstruction methods. Written in Java, it is based on the *Statistical Parsimony* algorithm developed by Templeton et al. (1992). Unfortunately, TCS has some major limitations related with its output: 

- the graphics are coarse and often not ready for publication, even after usage of the 'spring' method (force-directed layout algorithm) to improve network layout
- there is no built-in way of classifying haplotypes and displaying that information in haplogroups
- when more than one network is present in the data, the software cannot use its 'spring' algorithm to layout multiple graphs, resulting in a set of overlapping networks that have to be disentangled manually. 
 
As a consequence, it takes a significant effort to edit the resulting PostScript vector file in a vector manipulation software, such as Inkscape or Adobe Illustrator&reg;. tcsBU (read *TCS Bee You*) was developed to allow the production of publication-ready networks resulting from TCS analysis without too much effort. Users are able to classify haplotypes (for example, according to sampling locations or dates) and this information is displayed in pie-chart like haplogroups within the network. Groups can be classified using colors, patterns or a combination of both. The final network can be saved as a Scalable Vector Graphics (SVG) format, which can then be easily embedded in a modern word processor or edited and exported to other type of graphics format using a vector manipulation software.</p>

##References
- Clement M, Posada D, Crandall KA (2000) TCS: a computer program to estimate gene genealogies. *Molecular Ecology* 9, 1657-1659.
- Templeton AR, Crandall KA, Sing CF (1992) A cladistic analysis of phenotypic associations with haplotypes inferred from restriction endonuclease mapping and DNA sequence data. III. Cladogram estimation. *Genetics* 132, 619-633.
