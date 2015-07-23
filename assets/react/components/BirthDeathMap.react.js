"use strict";

var React = require("react"),
    LeafletMap = require("./utils/LeafletMap.react"),
    DemoStore = require("../stores/DemoStore.react"),
    d3 = require("d3"),

    statesGeoJson = require("./utils/statesGeoJson").features;

var BirthDeathMap = React.createClass({
    processLayers() {
        if(this.props.data && Object.keys(this.props.data).length !== 0) {
            let scale = d3.scale.threshold().domain(statesGeoJson.filter((el, i) => {
                    return parseInt(el.properties.STATE, 10).toString() in this.props.data;
                }).map((el, i) => {
                    return parseInt(this.props.data[parseInt(el.properties.STATE, 10).toString()][this.props.currYear]["job_creation_births"]) - parseInt(this.props.data[parseInt(el.properties.STATE, 10).toString()][this.props.currYear]["job_destruction_deaths"]);
                })
            )
            .range(['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)']);
            console.log(scale(535));
            // if(this.props.mapData && Object.keys(this.props.mapData).length !== 0) {
                // console.log("drawing");
            // ['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)']
            return {
                statesLayer: {
                    id: 1,
                    geo: statesGeoJson,
                    options: {
                        // zoomOnLoad: true,
                        style(feature) {
                            console.log(feature);
                            console.log(scale(parseInt(this.props.data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_creation_births"]) - parseInt(this.props.data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_destruction_deaths"])))
                            return {
                                fill: true,
                                fillColor: parseInt(feature.properties.STATE, 10).toString() in this.props.data ? scale(parseInt(this.props.data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_creation_births"]) - parseInt(this.props.data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_destruction_deaths"])) : "#000",
                                color: "#0000CC",
                                weight: 0.5,
                                opacity: 0.3,
                                fillOpacity: 0.4
                            };
                        }
                    }
                }
            };
        }
        else {
            return {
                statesLayer: {
                    id: 1,
                    geo: statesGeoJson,
                    options: {
                        zoomOnLoad: true,
                        style(feature) {
                            return {
                                fillColor: "#0000CC",
                                color: "#0000CC",
                                weight: 0.5,
                                opacity: 0.3,
                                fillOpacity: 0.4
                            };
                        }
                    }
                }
            };
        }
    },
    render() {
        console.log(this.props);
        return (
            <div>
                <LeafletMap layers={this.processLayers()} height="400px" style={{ marginTop: 10 }}/>
            </div>
        );
    }
});

module.exports = BirthDeathMap;
