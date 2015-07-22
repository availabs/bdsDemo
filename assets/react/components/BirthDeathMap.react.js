var React = require("react"),
    LeafletMap = require("./utils/LeafletMap.react"),

    statesGeoJson = require("./utils/statesGeoJson");
var BirthDeathMap = React.createClass({
    processLayers() {

        console.log(statesGeoJson);
        if(this.props.mapData && Object.keys(this.props.mapData).length == 0) {
            return {
                statesLayer: {
                    id: 1,
                    geo: statesGeoJson
                },
                options: {
                    zoomOnLoad: true,
                    style(feature) {
                        return {
                            fillColor: "#0099FF",
                            color: "#0000CC",
                            weight: 0.5,
                            opacity: 0.3,
                            fillOpacity: 0.4
                        };
                    }
                }
            };
        }
        /*if(Object.keys(this.props.geo).length == 0) {
            //console.log("not done loading.")
            return {
                zipLayer: {
                    id: t,
                    geo: { "type": "FeatureCollection",
                            "features": []
                        },
                    options: {
                        zoomOnLoad:true,
                        style: function(feature) {
                                return {
                                    fillColor: "#0099FF",
                                    color: "#0000CC",
                                    weight: 0.5,
                                    opacity: 0.3,
                                    fillOpacity: 0.4
                                };
                            }
                    }
                }
            }
        }
        else {
            return {
                    zipLayer: {
                        id: t,
                        geo: this.props.geo, //our geoJSON, from server,
                        options: {
                            zoomOnLoad:true,
                            style: function(feature) {
                                return {
                                    fillColor: "#0099FF",
                                    color: "#0000CC",
                                    weight: 0.5,
                                    opacity: 0.3,
                                    fillOpacity: 0.4,
                                    className:"bds"
                                };
                            }
                        }
                }
            }
        }*/
    },
    render() {
        return (
            <div>
                <LeafletMap layers={this.processLayers()} height="800px" />
            </div>
        );
    }
});

module.exports = BirthDeathMap;
