"use strict";

var React = require("react"),
    LeafletMap = require("./utils/LeafletMap.react"),
    DemoStore = require("../stores/DemoStore.react"),
    d3 = require("d3"),
    colorbrewer = require("colorbrewer"),

    statesGeoJson = require("./utils/statesGeoJson").features;

var id = 1,
    map = null,
    gj = null;

var BirthDeathMap = React.createClass({
    processLayers() {
        // console.log("processLayers", this.props);
        if(this.props.data && Object.keys(this.props.data).length !== 0) {
            /*
            let scale = d3.scale.quantile().domain(statesGeoJson.filter((el, i) => {
                    return parseInt(el.properties.STATE, 10).toString() in this.props.data;
                }).map((el, i) => {
                    return parseInt(this.props.data[parseInt(el.properties.STATE, 10).toString()][this.props.currYear]["job_creation_births"]) - parseInt(this.props.data[parseInt(el.properties.STATE, 10).toString()][this.props.currYear]["job_destruction_deaths"]);
                }).sort()
            ).range(['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)']);
            */


            let dd = [];
            for(let id in this.props.data) { // should really use jquery.each
                for(let yr in this.props.data[id]) {
                    let d = this.props.data[id][yr];
                    dd.push(d["job_creation_births"] - d["job_destruction_deaths"]);
                }
            }
            dd = dd.sort();
            // console.log(dd.sort());

            let scale = d3.scale.quantile().domain(dd)
                // .range(['rgb(178,24,43)','rgb(239,138,98)','rgb(253,219,199)','rgb(209,229,240)','rgb(103,169,207)','rgb(33,102,172)']);
            // .range(['rgb(202,0,32)','rgb(244,165,130)','rgb(247,247,247)','rgb(146,197,222)','rgb(5,113,176)']);
            .range(['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)']);
            // console.log(scale(-77));
            // .range(colorbrewer.Spectral[9]);

            // console.log(scale(-999));
            id += 1;
            // if(this.props.mapData && Object.keys(this.props.mapData).length !== 0) {
                // console.log("drawing");
            // ['rgb(103,0,31)','rgb(178,24,43)','rgb(214,96,77)','rgb(244,165,130)','rgb(253,219,199)','rgb(247,247,247)','rgb(209,229,240)','rgb(146,197,222)','rgb(67,147,195)','rgb(33,102,172)','rgb(5,48,97)']

            let data = this.props.data, currY = this.props.currYear; // bc `this` hanges
            return {
                geo: statesGeoJson,
                options: {
                    id,
                    zoomOnLoad: true,
                    style(feature) {
                        // console.log(feature);
                        // console.log(scale(parseInt(data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_creation_births"]) - parseInt(data[parseInt(feature.properties.STATE, 10).toString()][this.props.currYear]["job_destruction_deaths"])))
                        /*if(parseInt(feature.properties.STATE, 10).toString() in data){
                            console.log(scale(parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_creation_births"]) - parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_destruction_deaths"])));
                            console.log(parseInt(feature.properties.STATE, 10).toString(), parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_creation_births"])- parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_destruction_deaths"]))
                        }*/
                        // console.log(parseInt(feature.properties.STATE, 10).toString());
                        return {
                            fill: true,
                            fillColor: parseInt(feature.properties.STATE, 10).toString() in data && parseInt(currY) < 2013 ? scale(parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_creation_births"]) - parseInt(data[parseInt(feature.properties.STATE, 10).toString()][currY]["job_destruction_deaths"])) : "#000",
                            color: "#0000CC",
                            weight: 0.1,
                            opacity: 0.2,
                            fillOpacity: 0.4
                        };
                    }
                }
            };
        }
        else {
            return {
                // statesLayer: {
                id,
                geo: statesGeoJson,
                options: {
                    zoomOnLoad: true,
                    style(feature) {
                        return {
                            fillColor: "#000ACC",
                            color: "#000ACC",
                            weight: 0.5,
                            opacity: 0.2,
                            fillOpacity: 0.4
                        };
                    }
                }
                // }
            };
        }
        /*else {
            return {};
        }*/

    },
    componentDidMount() {
        var mapDiv = document.getElementById('map');
        mapDiv.setAttribute("style","height: 400px");
        var key = 'erickrans.4f9126ad',//am3081.kml65fk1,
            mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/"+key+"/{z}/{x}/{y}.png");

        map = L.map("map", {
          center: [39.8282, -98.5795],
          zoom: 4,
          layers: [mapquestOSM],//[mapquestOSM],
          zoomControl: true,
          attributionControl:false
        });

        let layer = this.processLayers();

        gj = L.geoJson(layer.geo, layer.options).addTo(map);

        /*Object.keys(this.props.layers).forEach(function(key){
            console.log(key, scope.props.layers[key]);
            var currLayer = scope.props.layers[key];
            layers[key] =  {
                id:currLayer.id,
                layer: L.geoJson(currLayer.geo,currLayer.options)
            };
            // L.geoJson(currLayer.geo,currLayer.options).addTo(map);
            // map.addLayer(L.geoJson(currLayer.geo,currLayer.options));
            map.addLayer(layers[key].layer);
            if(currLayer.options.zoomOnLoad && currLayer.geo.length > 0){
                var ezBounds = d3.geo.bounds(currLayer.geo);
                map.fitBounds(layers[key].layer.getBounds());
            }
        });*/
    },
    render() {
        if(gj) {
            gj.setStyle(this.processLayers().options.style);
        }
        // console.log(this.props, this.processLayers());
        return (
            <div>
                <div id="map"></div>
            </div>
        );
        // <LeafletMap layers={this.processLayers()} height="400px" style={{ marginTop: 10 }}/>

    }
});

module.exports = BirthDeathMap;
