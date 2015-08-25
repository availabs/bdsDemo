var React = require("react"),
    c3 = require("c3"),

    sicsToAbbr = require("../utils/sicsToAbbr.json"),
    abbrToName = require("../utils/abbrToName.json"),
    abbrToSics = ((obj) => {

        let new_obj = {};

        for (let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
              new_obj[obj[prop]] = prop;
            }
        }

        return new_obj;
    })(sicsToAbbr);

function invert (obj) {

  var new_obj = {};

  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
};

var convertData = (data, currYear, varFunction, geoType) => {
    let converted = [];
    for(let geoId in data) {
        let strGeoId = geoType === "st" ? (geoId.length === 1 ? "0" + geoId : geoId) : "" + geoId;
        // console.log(geoId.toString().length === 1 ? "0" + geoId.toString() : geoId.toString(), sicsToAbbr[geoId.toString().length === 1 ? "0" + geoId.toString() : geoId.toString()]);
        converted.push({
            geoId: strGeoId,
            abbr: geoType === "st" ? sicsToAbbr[strGeoId] : geoId,
            value: geoType === "st" ? varFunction(data[geoId][currYear]) : geoId
        });
    }
    return converted.sort((a, b) => a.value - b.value);
};

c3.chart.fn.axis.show_x = function (shown) {
    var $$ = this.internal, config = $$.config;
    config.axis_x_show = !!shown;
    $$.axes.x.style("visibility", config.axis_x_show ? "visible" : "hidden");
    $$.redraw();
};

var YearGraph = React.createClass({
    getInitialState() {
        return {
            graph: null
        }
    },

    getDefaultProps() {
        return {
            geoType: "st",
            data: null,
            currYear: "1977",
            varString: "Net Job Births",
            varFunction: (d) => parseInt(d["job_creation_births"]) - parseInt(d["job_destruction_deaths"])
        }
    },

    componentDidUpdate(prevProps, prevState) {
        let thisProps = this.props;
        if(!prevProps.data && this.props.data) {
            let converted = convertData(thisProps.data, thisProps.currYear, thisProps.varFunction, thisProps.geoType);
            // console.log(thisProps);
            console.log("creating graph", thisProps.geoType === "st")
            let graph = c3.generate({
                bindto: "#yearGraph",
                data: {
                    json: converted,
                    keys: {
                        x: "abbr",
                        value: ["value"],
                    },
                    type: "bar"
                },
                axis: {
                    x: {
                        label: {
                            text: this.props.geoType === "st" ? "FIPS" : "MSA",
                            position: "outer-center",
                        },
                        type: "category",
                        show: thisProps.geoType === "st"
                    },
                    y: {
                        label: {
                            text: this.props.varString,
                            position: "outer-middle"
                        }
                    }
                },
                tooltip: {
                    format: {
                        title(d) {// doesn't work, converted[d] doesn't vary betwee years
                            console.log(d, convertData(thisProps.data, thisProps.currYear, thisProps.varFunction, thisProps.geoType)[d], converted[d]);
                        },
                        name(name, ratio, id, index) { // DOESNT WORK
                            if(thisProps.geoType === "st") {
                                // let data = convertData(thisProps.data, thisProps.currYear, thisProps.varFunction, thisProps.geoType)
                                /*let d = converted[i].geoId.length === 1 ? "0" + converted[i].geoId : converted[i].geoId;
                                let padded = d.length === 1 ? "0" + d : d;
                                console.log(i, padded, abbrToName[padded], converted[i]);
                                return abbrToName[padded] +
                                    " - <small>" + abbrToSics[padded] + "</small>";*/
                                // console.log(name, ratio, id, index);
                                // return "hai";
                            }
                            else {
                                // return i;
                            }
                        },
                        value(value, ratio, id) {
                            // console.log(value, ratio, id);
                            return value + " " + thisProps.varString;
                        }
                    }
                },
                legend: {
                    show: false
                }
            });

            this.setState({
                graph: graph
            });
        }
        else if(thisProps.data && thisProps.currYear) {
            // console.log(convertData(thisProps.data, thisProps.currYear, thisProps.varFunction, thisProps.geoType));
            console.dir(this.state.graph);
            this.state.graph.load({
                json: convertData(thisProps.data, thisProps.currYear, thisProps.varFunction, thisProps.geoType),
                keys: {
                    x: "abbr",
                    value: ["value"]
                },
                unload: true
            });
            this.state.graph.axis.show_x(thisProps.geoType === "st");
        }

        if(this.props.varString !== thisProps.varString) {
            // change y label
        }
    },

    render() {
        return (
            <div id="yearGraph"></div>
        );
    }
});

module.exports = YearGraph;
