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
    })(sicsToAbbr);

var convertData = (data, varField, geoType, scale) => {
    let toRet = [];
    for(let yr in data) {
        toRet.push({
            "yr": yr,
            "val": data[yr][varField] / scale ? data[yr]["emp"] : 1
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
        console.log("compDidUpdate", convertData(this.props.data, this.props.varField, this.props.geoType, this.props.scale));
        let thisProps = this.props;
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
                        }
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
                        name(name, ratio, id, index) { // DOESNT WORK

                            // return null;
                            return thisProps.varString;
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
        else if((this.props.selected !== prevProps.selected) || (this.props.varField !== prevProps.varField)) {
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
        // console.log(this.props);
        return (
            <div>
                <h2>{this.props.varString} for {this.props.geoType === "st" ? abbrToName[sicsToAbbr[this.props.selected.length === 1 ? "0" + this.props.selected : this.props.selected]] : msaIdToName[this.props.selected]}</h2>
                <div id="areaGraph"></div>
            </div>
        );
    }
});

module.exports = AreaGraph;
