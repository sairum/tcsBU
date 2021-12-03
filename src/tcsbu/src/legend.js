/*
 *
 * legend.js was modified from https://github.com/emeeks/d3-svg-legend/blob/master/legend.js
 * authored by Michael P Schroeder (mpschr)
 * 
 * It is used under the following licence (https://github.com/emeeks/d3-svg-legend/blob/master/LICENSE)
 * 
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 */


d3.svg.legend = function() {

    var legendValues=[];
    var legendScale;
    var cellWidth = 80;
    var cellHeight = 30;
    var adjustable = false;
    var labelFormat = d3.format(".01f");
    var coordinates = {x:0, y:0};
    var labelUnits = "units";
    var lastValue = 6;
    var changeValue = 1;
    var orientation = "horizontal";
    var cellPadding = 0;


    function legend(svg) {

        var updateBGSize = function(legend){

            var margin = 10;
            var dim = legend.target.node().getBBox();
            dim.height += margin * 2;
            dim.width += margin * 2;
            dim.y -= margin;
            dim.x -= margin;

            legend.parentGroup.select(".mutLegendBG").attr(dim);
        };

        var drag = d3.behavior.drag()
            .on("drag", function(d,i) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.select(this).attr("transform", function(d,i){
                    return "translate(" + [ d.x,d.y ] + ")";
                });
            })
            .on("dragstart", function() {
                d3.event.sourceEvent.stopPropagation(); // silence other listeners
            });

        function init() {
            var mutLegendGroup = svg.append("g")
                .attr("class", "mutLegendGroup")
                .data([ coordinates ])
                .attr("transform", "translate(" + coordinates.x + "," + coordinates.y + ")");
            var target = mutLegendGroup
                .insert("g")
                .attr("class", "mutLegendGroupText");


            // set legend background
            var mutLegendBG = mutLegendGroup
                .insert("rect", ":first-child")
                .attr("class", "mutLegendBG")
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", "1px");


            return {
                parentGroup: mutLegendGroup,
                target: target
            };
        }



        function cellRange(valuePosition, changeVal) {
            legendValues[valuePosition].stop[0] += changeVal;
            legendValues[valuePosition - 1].stop[1] += changeVal;
            redraw();
        }

        function redraw() {


            legend.target.selectAll("g.legendCells").data(legendValues).exit().remove();
            legend.target.selectAll("g.legendCells").select("rect")
               .style("fill", function(d) { return d.color; });
            if (orientation == "vertical") {
                legend.target.selectAll("g.legendCells").select("text.breakLabels").style("display", "block").style("text-anchor", "start").attr("x", cellWidth + cellPadding).attr("y", 5 + (cellHeight / 2)).text(function(d) {return labelFormat(d.stop[0]) + (d.stop[1].length > 0 ? " - " + labelFormat(d.stop[1]) : ""); });
                legend.target.selectAll("g.legendCells").attr("transform", function(d,i) {return "translate(0," + (i * (cellHeight + cellPadding)) + ")"; });
            }
            else {
                legend.target.selectAll("g.legendCells").attr("transform", function(d,i) {return "translate(" + (i * cellWidth) + ",0)"; });
                legend.target.selectAll("text.breakLabels").style("text-anchor", "middle").attr("x", 0).attr("y", -7).style("display", function(d,i) {return i === 0 ? "none" : "block";}).text(function(d) {return labelFormat(d.stop[0]); } );
            }
        }

        // init
        if (!legend.initDone) {
            var initObj = init();
            legend.target = initObj.target;
            legend.parentGroup = initObj.parentGroup;
            legend.parentGroup.call(drag);
            legend.initDone = true;
        }


        // remove previously painted rect and text
        legend.target.selectAll("g.legendCells").select("text.breakLabels").remove();
        legend.target.selectAll("g.legendCells").select("rect").remove();
        legend.target.selectAll(".legendTitle").remove();


        legend.target.selectAll("g.legendCells")
            .data(legendValues)
            .enter()
            .append("g")
            .attr("class", "legendCells")
            .attr("transform", function(d,i) {return "translate(" + (i * (cellWidth + cellPadding)) + ",0)"; });

        legend.target.selectAll("g.legendCells")
            .append("rect")
            .attr("class", "breakRect")
            .attr("height", cellHeight)
            .attr("width", cellWidth)
            .style("fill", function(d) { return d.color; })
            .style("stroke", function(d) {return "#000000"; /*d3.rgb(d.color).darker(); */});

        legend.target.selectAll("g.legendCells")
            .append("text")
            .attr("class", "breakLabels")
            .style("pointer-events", "none");

        legend.target.append("text")
            .text(labelUnits)
            .attr("y", -7)
            .attr("class", "legendTitle");

        redraw();
        updateBGSize(legend);
    }

    legend.initDone = false;
    legend.target;

    legend.inputScale = function(newScale) {
        var scale;
        if (!arguments.length) return scale;
        scale = newScale;
        legendValues = [];
        if (scale.invertExtent) {
            //Is a quantile scale
            scale.range().forEach(function(el) {
                var cellObject = {color: el, stop: scale.invertExtent(el) };
                legendValues.push(cellObject);
            });
        }
        else {
            scale.domain().forEach(function (el) {
                var cellObject = {color: scale(el), stop: [el,""] };
                legendValues.push(cellObject);
            });
        }
        return this;
    };

    legend.scale = function(testValue) {
        var foundColor = legendValues[legendValues.length - 1].color;
        for (var el in legendValues) {
            if(testValue < legendValues[el].stop[1]) {
                foundColor = legendValues[el].color;
                break;
            }
        }
        return foundColor;
    };

    legend.cellWidth = function(newCellSize) {
        if (!arguments.length) return cellWidth;
        cellWidth = newCellSize;
        return this;
    };

    legend.cellHeight = function(newCellSize) {
        if (!arguments.length) return cellHeight;
        cellHeight = newCellSize;
        return this;
    };

    legend.cellPadding = function(newCellPadding) {
        if (!arguments.length) return cellPadding;
        cellPadding = newCellPadding;
        return this;
    };

    legend.cellExtent = function(incColor,newExtent) {
        var selectedStop = legendValues.filter(function(el) {return el.color == incColor;})[0].stop;
        if (arguments.length == 1) return selectedStop;
        legendValues.filter(function(el) {return el.color == incColor;})[0].stop = newExtent;
        return this;
    };

    legend.cellStepping = function(incStep) {
        if (!arguments.length) return changeValue;
        changeValue = incStep;
        return this;
    };

    legend.units = function(incUnits) {
        if (!arguments.length) return labelUnits;
        labelUnits = incUnits;
        return this;
    };

    legend.orientation = function(incOrient) {
        if (!arguments.length) return orientation;
        orientation = incOrient;
        return this;
    };
 
    legend.labelFormat = function(incFormat) {
        if (!arguments.length) return labelFormat;
        labelFormat = incFormat;
        if (incFormat == "none") {
            labelFormat = function(inc) {return inc;};
        }
        return this;
    };

    legend.place = function(incCoordinates) {
        if (!arguments.length) return incCoordinates;
        coordinates = incCoordinates;
        return this;
    };

    return legend;

};