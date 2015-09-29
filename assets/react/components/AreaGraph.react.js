var React = require("react"),
    c3 = require("c3"),
    d3 = require("d3"),

    sicsToAbbr = require("../utils/sicsToAbbr.json"),
    abbrToName = require("../utils/abbrToName.json"),
    msaIdToName = require("./utils/msaIdToName"),
    abbrToSics = ((obj) => {

        let new_obj = {};

        for (let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
              new_obj[obj[prop]] = prop;
            }
        }

        return new_obj;
    })(sicsToAbbr),
    thisProps;

var convertData = (data, varField, geoType, scale) => {
    console.log("converting data", data, varField, geoType, scale);
    let toRet = [];
    for(let yr in data) {
        // console.log(data[yr][varField], data[yr]["emp"]);
        toRet.push({
            "yr": yr,
            "val": data[yr][varField] / (scale ? data[yr]["emp"] : 1)
        });
    }
    return toRet;
}

var AreaGraph = React.createClass({
    getInitialState() {
        return {
            graph: null
        }
    },

    getDefaultProps() {

        return {
            data: null,
            geoType: "st",
            selected: "36", // NY
            varField: "net_job_creation",
            varString: "Net Job Creation",
            scale: false
        };
    },

    componentDidUpdate(prevProps, prevState) {
        // console.log("compDidUpdate", convertData(this.props.data, this.props.varField, this.props.geoType, this.props.scale));
        thisProps = this.props;
        if(prevProps.data === null && this.props.data) {
            let graph = c3.generate({
                bindto: "#areaGraph",
                data: {
                    json: convertData(this.props.data, this.props.varField, this.props.geoType, this.props.scale),
                    keys: {
                        x: "yr",
                        value: ["val"]
                    },
                    type: "area-spline"
                },
                axis: {
                    x: {
                        type: "category",
                        label: {
                            text: "Year",
                            position: "outer-center"
                        },
                        format(x) {
                            //TODO: fix.
                            if(thisProps.scale) {
                                return (x.toPrecision(2) * 100).toString() + "%";
                            }
                            else {
                                return x;
                            }
                        },
                    },
                    y: {
                        label: {
                            text: (thisProps.scale ? "Percent ": "") + this.props.varString,
                            position: "outer-middle"
                        }
                    }
                },
                tooltip: {
                    format: {
                        name() {
                            return (thisProps.scale ? "Percent ": "") + thisProps.varString;
                        },
                        value(value, ratio, id) {
                            // console.log(value, ratio, id);
                            return thisProps.scale ?  value.toPrecision(2).toString() + "%" : value;// + " " + thisProps.varString;
                        }
                    }
                },
                point: {
                    show: false
                },
                legend: {
                    show: false
                }
            });
            this.setState({
                graph
            });
        }
        else if((this.props.selected !== prevProps.selected) || (this.props.varField !== prevProps.varField) || (this.props.scale !== prevProps.scale)) {
            this.state.graph.load({
                unload: true,
                json: convertData(this.props.data, this.props.varField, this.props.geoType, this.props.scale),
                keys: {
                    x: "yr",
                    value: ["val"]
                }
            });
        }
    },

    render() {
        console.log("areagraph props", this.props);
        return (
            <div>
                <h2>{this.props.varString} for {this.props.geoType === "st" ? abbrToName[sicsToAbbr[this.props.selected.length === 1 ? "0" + this.props.selected : this.props.selected]] : msaIdToName[this.props.selected]}</h2>
                <div id="areaGraph"></div>
            </div>
        );
    }
});

module.exports = AreaGraph;
