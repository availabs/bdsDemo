var React = require("react"),
    c3 = require("c3"),
    d3 = require("d3");

var convertData = (data, varFunction, geoType) => {
    let toRet = [];
    for(let yr in data) {
        toRet.push({
            "yr": yr,
            "val": varFunction(data[yr])
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
            varFunction: (d) => parseInt(d["job_creation_births"]) - parseInt(d["job_destruction_deaths"])
        }
    },

    componentDidUpdate(prevProps, prevState) {
        console.log("compDidUpdate", prevProps, this.props);
        if(prevProps.data === null && this.props.data) {
            let graph = c3.generate({
                bindto: "#areaGraph",
                data: {
                    json: convertData(this.props.data, this.props.varFunction, this.props.geoType),
                    keys: {
                        x: "yr",
                        value: ["val"]
                    },
                    type: "line"
                },
                axis: {
                    x: {
                        type: "category"
                    },
                    y: {

                    }
                }
            });
            this.setState({
                graph
            });
        }
        else if(this.props.selected !== prevProps.selected) {
            this.state.graph.load({
                unload: true,
                json: convertData(this.props.data, this.props.varFunction, this.props.geoType),
                keys: {
                    x: "yr",
                    value: ["val"]
                },
                type: "line"
            });
        }
    },

    render() {
        // console.log(this.state, this.props);
        return (
            <div id="areaGraph"></div>
        );
    }
});

module.exports = AreaGraph;
