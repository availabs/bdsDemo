"use strict";

var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),
    d3 = require("d3"),
    topojson = require("topojson"),

    // data
    geoJsons = (() => {
        var states = require("./utils/states.topo"),
            metro = require("./utils/msa.topo");
        return {
            st: topojson.feature(states, states.objects["states.geo"]),
            msa: topojson.feature(metro, metro.objects["msa.geo"])
        };
    }());
    /*geoJsons = {
        state: topojson(require("./utils/states.topo")).features,
        metro: require("./utils/msa.topo").features
    };*/

var map = null,
    geoJson = null,
    layer = null,
    rawLayer = null;

/*
    Props:
        geoType: "st" or "msa", (for consistency)
        data: (whatever data from bdsAPI),
        currYear: (the year to plot)
*/

var DataMap = React.createClass({
    getInitialState() {
        return {
            geoType: this.props.geoType
        };
    },
    processLayers(type) {
        if(this.props.data && Object.keys(this.props.data).length !== 0) {
            let dataKey = this.props.geoType === "msa" ? "GEOID" : "STATE";

            let geoData = [];
            $.each(this.props.data, (id, val) => {
                $.each(val, (yr, d) => {
                    geoData.push(d["job_creation_births"] - d["job_destruction_deaths"]);
                });
            });
            geoData = geoData.sort();
            console.log("geoData", geoData);
            let scale = d3.scale.quantile()
                .domain(geoData)
                .range([
                    "rgb(103,0,31)",
                    "rgb(178,24,43)",
                    "rgb(214,96,77)",
                    "rgb(244,165,130)",
                    "rgb(253,219,199)",
                    "rgb(247,247,247)",
                    "rgb(209,229,240)",
                    "rgb(146,197,222)",
                    "rgb(67,147,195)",
                    "rgb(33,102,172)",
                    "rgb(5,48,97)"
                ]);

            let data = this.props.data, currY = this.props.currYear; // preserving this?
            console.log("geojson", geoJsons[type]);
            return {
                geo: geoJsons[type],
                options: {
                    zoomOnLoad: true,
                    style(feature) {
                        let valid = parseInt(feature.properties[dataKey], 10).toString() in data && parseInt(currY) < 2013;
                        return {
                            fill: true, // redund parseInt then toSTring to handle leading zeros
                            fillColor: valid ? scale(parseInt(data[parseInt(feature.properties[dataKey], 10).toString()][currY]["job_creation_births"]) - parseInt(data[parseInt(feature.properties[dataKey], 10).toString()][currY]["job_destruction_deaths"])) : "#000",
                            color: "#0000CC",
                            weight: 0.1,
                            opacity: 0.2,
                            fillOpacity: valid ? 0.4 : 0.0
                        }
                    }
                }
            }
        }
        else {
            return {
                geo: geoJsons[type],
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
            }
        }
    },

    componentDidMount() {
        /*
        <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-default">
                <input type="radio" id="state" name="state" value="state" /> State
            </label>
            <label className="btn btn-default">
                <input type="radio" id="metro" name="metro" value="metro" /> Metro
            </label>
        </div>
        */
        let key = 'erickrans.4f9126ad',// am3081.kml65fk1, erickrans.4f9126ad
            mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/"+key+"/{z}/{x}/{y}.png");

        map = L.map("map", {
          center: [39.8282, -98.5795],
          zoom: 4,
          layers: [mapquestOSM],
          zoomControl: true,
          attributionControl: false
        });

        let modeToggle = L.Control.extend({
            options: {
                position: "topleft"
            },
            onAdd(map) {
                var container = L.DomUtil.create("div", "btn-group");
                container.setAttribute("data-toggle", "buttons");
                var stateLabel = L.DomUtil.create("label", "btn btn-default radioLabel active", container),
                    metroLabel = L.DomUtil.create("label", "btn btn-default radioLabel", container);

                var stateInput = L.DomUtil.create("input", "radio", stateLabel),
                    metroInput = L.DomUtil.create("input", "radio", metroLabel);

                stateInput.setAttribute("type", "radio");
                stateInput.setAttribute("id", "state");
                stateInput.setAttribute("name", "state");
                stateInput.setAttribute("value", "state");
                stateLabel.appendChild(document.createTextNode("State"));

                metroInput.setAttribute("type", "radio");
                metroInput.setAttribute("id", "metro");
                metroInput.setAttribute("name", "metro");
                metroInput.setAttribute("value", "metro");
                metroLabel.appendChild(document.createTextNode("Metro"));

                console.log("container", container);

                return container;
                // var stateInput =
            }
        });
        map.addControl(new modeToggle());
        $(".radioLabel").click((e) => {
            e.preventDefault();
            if(e.target.innerText === "State") {
                console.log("state");
                this.setState({
                    geoType: "st"
                });
            }
            else if(e.target.innerText === "Metro") {
                console.log("metro");
                this.setState({
                    geoType: "msa"
                });
            }
        });
        // layer = this.processLayers(this.state.geoType);

        // geoJson = L.geoJson(layer.geo, layer.options).addTo(map);
        rawLayer = this.processLayers(this.state.geoType),
            layer = L.geoJson(rawLayer.geo, rawLayer.options);
        map.addLayer(layer);
    },

    componentDidUpdate(prevProps, prevState) {
        if(layer) {
            map.removeLayer(layer);
        }
        console.log(this.state);
        rawLayer = this.processLayers(this.state.geoType),
            layer = L.geoJson(rawLayer.geo, rawLayer.options);
        map.addLayer(layer);
    },

    render() {

        if(layer) {
            layer.setStyle(rawLayer.options.style);
        }

        return (
            <div className="mapContainer">
                <div id="map"></div>
            </div>
        );
    }
});

module.exports = DataMap;
