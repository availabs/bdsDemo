"use strict";

var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),
    topojson = require("topojson"),

    // data
    geoJsons = (() => {
        var states = require("./utils/states.topo"),
            metro = require("./utils/msa.topo");
        return {
            st: topojson.feature(states, states.objects["states.geo"]),
            msa: topojson.feature(metro, metro.objects["fixMsa.geo"]) // b/c had to smallerify data
        };
    }());

var map = null,
    geoJson = null,
    layer = null,
    rawLayer = null,
    scales = {
        "msa": null,
        "st": null
    };

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
    componentWillReceiveProps(nextProps) {
        // console.log("will receive props", this.props, nextProps);

        this.setState({
            geoType: nextProps.geoType
        });
    },
    processLayers(type) {
        if(this.props.data && Object.keys(this.props.data).length !== 0) {
            let dataKey = this.props.geoType === "msa" ? "GEOID" : "STATE";

            if(!scales[this.state.geoType]) {
                let geoData = [];
                console.log("in scale")
                $.each(this.props.data, (id, val) => {
                    $.each(val, (yr, d) => {
                        geoData.push(parseInt(d["job_creation_births"] - d["job_destruction_deaths"]));
                    });
                });
                geoData = geoData.sort();

                scales[this.state.geoType] = d3.scale.quantile()
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
            }

            let data = this.props.data, currY = this.props.currYear, scale = scales[this.state.geoType]; // preserving this?

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
                    },
                    onEachFeature(feature, layer) {
                        // console.log("in oneachf")
                        if(feature.properties && parseInt(feature.properties[dataKey], 10).toString() in data) {
                            // console.log("actually in oneachf")
                            let popupOptions = {
                                maxWidth: 600,
                                className: "featurePopup"
                            },
                            thisData = data[parseInt(feature.properties[dataKey], 10).toString()][currY];
                            let name = feature.properties["NAME"],
                                code = type === "st" ? "NAICS " + feature.properties["STATE"] : "MSA " + feature.properties["GEOID"],
                                body = "<ul class=\"list-group\">\n" +
                                        Object.keys(thisData).map((key) => {
                                            if(key === "year2" || key === "state" || key === "msa") {
                                                return ""; // probably faster than reduce
                                            }
                                            let val = thisData[key];
                                            return "<li class=\"list-group-item popup\">" + // some terrible formatting
                                                "<span class=\"badge\">" + val + "</span>" + key // underscore_like_dis to Underscore Like Dis
                                                    .replace(/_/g, " ")
                                                    .replace(/\w\S*/g, (txt) => {
                                                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                                    }) + "</li>";
                                        }).join("\n") + "\n</ul>";
                            layer.bindPopup(`<h2>${name}&nbsp;<small>${code}</small></h2>${body}`, popupOptions);
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
        let key = "erickrans.4f9126ad",// am3081.kml65fk1, erickrans.4f9126ad
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

                return container;
            }
        });
        map.addControl(new modeToggle());
        $(".radioLabel").click((e) => {
            e.preventDefault();
            if(e.target.innerText === "State") {
                this.props.changeGeoType("st");

            }
            else if(e.target.innerText === "Metro") {
                this.props.changeGeoType("msa");
            }
        });

        rawLayer = this.processLayers(this.state.geoType),
            layer = L.geoJson(rawLayer.geo, rawLayer.options);
        map.addLayer(layer);
    },

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps, this.state);
        if((prevState.geoType !== this.state.geoType) || prevProps.data === undefined) { // for the first time draw when data loads
            console.log("redrawin");
            if(layer) {
                map.removeLayer(layer);
            }
            // console.log(this.state);
            rawLayer = this.processLayers(this.state.geoType),
                layer = L.geoJson(rawLayer.geo, rawLayer.options);
            map.addLayer(layer);
        }
    },

    render() {
        if(!this.props.data && map) { // bc won't draw w/ popups and data in comp did mount
            /*rawLayer = this.processLayers(this.state.geoType),
            layer = L.geoJson(rawLayer.geo, rawLayer.options);
            map.addLayer(layer);*/
        }

        if(layer) {
            layer.setStyle(this.processLayers().options.style); // reprocess
        }

        return (
            <div className="mapContainer">
                <div id="map"></div>
            </div>
        );
    }
});

module.exports = DataMap;
