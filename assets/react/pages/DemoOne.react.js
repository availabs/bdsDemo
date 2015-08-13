"use strict"
var React = require("react"),
    L = require("leaflet"),
    DemoStore = require("../stores/DemoStore.react"),

    DataMap = require("../components/DataMap.react");

var interval = null,
    inInterval = false;;

var DemoOne = React.createClass({
    getInitialState() {
        return {
            mapData: {
                st: DemoStore.getMapData("st"),
                msa: DemoStore.getMapData("msa")
            },
            geoType: "st",
            currYear: "1977"
        }
    },
    componentDidMount() {
        var rangeSlider = $("#yearSlider");
        var ruler = $("<div class=\"rangeslider__ruler\" />");
        var rulerStep = 1;
        // Initialize
        rangeSlider.rangeslider({
            polyfill: false,
            onInit: function() {
                ruler[0].innerHTML = range(1977, 2012, rulerStep);
                this.$range.prepend(ruler);
            }
        });

        function range(min, max, step = 1) {
            var range = '';
            var i = min;

            while (i <= max) {
                range += i + ' ';
                i = i + step;
            }
            return range;
        }

        $("#yearSlider").on("input", (e) => { // necessary b/c sliders don't go well with onchange
            // console.log(e.target.value);
            $("#yearSelect").val(e.target.value);
            this.setState({
                mapData: {
                    st: DemoStore.getMapData("st"),
                    msa: DemoStore.getMapData("msa")
                },
                geoType: this.state.geoType, // for some reason, doesn't work if i just remove this
                currYear: e.target.value
            });
            // console.log("yearSlider on");
            if(interval && !inInterval) {
                clearInterval(interval);
                interval = null;
                $("#playpause").toggleClass("glyphicon-play");
                $("#playpause").toggleClass("glyphicon-pause");
            }
        });


        DemoStore.addChangeListener(this._onChange);
    },
    componentWillUnmount() {
        DemoStore.removeChangeListener(this._onChange);
    },
    _onChange() {
        this.setState({
            mapData: {
                st: DemoStore.getMapData("st"),
                msa: DemoStore.getMapData("msa")
            },
            geoType: this.state.geoType,
            currYear: "1977"
        });
    },
    _onChangeYear(e) {
        if( e.keyCode == 13 && parseInt(this.state.currYear) < 2013) {
            // console.log("_onChangeYear")
            this.setState({
                mapData: {
                    st: DemoStore.getMapData("st"),
                    msa: DemoStore.getMapData("msa")
                },
                geoType: this.state.geoType,
                currYear: e.target.value
            });
            $("#yearSlider").val(e.target.value).change();
            if(interval && !inInterval) {
                clearInterval(interval);
                interval = null;
                $("#playpause").toggleClass("glyphicon-play");
                $("#playpause").toggleClass("glyphicon-pause");
            }
        }
    },
    _handleClick(e) {
        $("#playpause").toggleClass("glyphicon-play");
        $("#playpause").toggleClass("glyphicon-pause");
        if(interval) {
            clearInterval(interval);
            interval = null;
        }
        else {
            interval = setInterval(() => {
                inInterval = true;
                if(parseInt(this.state.currYear) > 2011) {
                    clearInterval(interval);
                    interval = null;
                    inInterval = false;
                    $("#playpause").toggleClass("glyphicon-play");
                    $("#playpause").toggleClass("glyphicon-pause");
                    this.setState({
                            mapData: {
                            st: DemoStore.getMapData("st"),
                            msa: DemoStore.getMapData("msa")
                        },
                        geoType: this.state.geoType,
                        currYear: "2012"
                    });
                }
                else {
                    this.setState({
                        mapData: {
                            st: DemoStore.getMapData("st"),
                            msa: DemoStore.getMapData("msa")
                        },
                        geoType: this.state.geoType,
                        currYear: (parseInt(this.state.currYear) + 1).toString()
                    });
                    $("#yearSlider").val(this.state.currYear).change();
                    $("#yearSelect").val(this.state.currYear);
                }
            }, 500);
        }
    },

    changeGeoType(type) { // callback prop
        this.setState({
                mapData: {
                st: DemoStore.getMapData("st"),
                msa: DemoStore.getMapData("msa")
            },
            geoType: type,
            currYear: this.state.currYear
        });
    },

    render() {
        return (
            <div className="container main">
                <h1>Demo One</h1>
                <div className="row">
                    <div className="col-md-12">
                        <DataMap geoType={this.state.geoType} changeGeoType={this.changeGeoType} data={this.state.mapData[this.state.geoType]} currYear={this.state.currYear} />
                    </div>
                </div>
                <div className="row controls">
                    <div className="col-md-12">
                        <input id="yearSlider" type="range" min="1977" max="2012" step="1" defaultValue={this.state.currYear} />
                        <div className="row">
                            <div className="col-md-6">
                                <label><input id="yearSelect" type="number" defaultValue={this.state.currYear} onKeyDown={this._onChangeYear} name="year" /> </label>
                                <button type="button" onClick={this._handleClick} className="btn btn-default playpause"><span id="playpause" className="glyphicon glyphicon-play"></span></button>
                            </div>
                            <div className="col-md-6">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DemoOne;
