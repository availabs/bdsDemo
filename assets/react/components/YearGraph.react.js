var React = require("react"),
    c3 = require("c3");

var convertData = (data, currYear, varFunction) => {
    let converted = [];
    for(let geoId in data) {
        converted.push({
            geoId,
            value: varFunction(data[geoId][currYear])
        });
    }
    return converted;
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

    componentWillReceiveProps(nextProps) {
        if(!this.props.data && nextProps.data) {
            console.log("creating graph")
            let graph = c3.generate({
                bindto: "#yearGraph",
                data: {
                    json: convertData(nextProps.data, nextProps.currYear, nextProps.varFunction),
                    keys: {
                        x: "geoId",
                        value: ["value"]
                    },
                    type: "bar"
                },
                axis: {
                    x: {
                        label: this.props.geoType === "st" ? "FIPS" : "MSA",
                        type: "category"
                    },
                    y: {
                        label: this.props.varString
                    }
                }
            });
            console.log(graph);
            this.setState({
                graph: graph
            });
        }
        else if(nextProps.data && nextProps.currYear) {
            console.log(convertData(nextProps.data, nextProps.currYear, nextProps.varFunction));
            this.state.graph.load({
                json: convertData(nextProps.data, nextProps.currYear, nextProps.varFunction),
                keys: {
                    x: "geoId",
                    value: ["value"]
                },
                unload: true
            });
        }

        if(this.props.varString !== nextProps.varString) {
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
