"use strict"
var React = require("react"),
    L = require("leaflet"),
    d3 = require("d3"),

    // Components
    DemoStore = require("../stores/DemoStore.react"),
    DataMap = require("../components/DataMap.react"),
    YearGraph = require("../components/YearGraph.react"),
    AreaGraph = require("../components/AreaGraph.react");

var interval = null,
    inInterval = false,
    msaData = [],
    stData = [];

var DemoOne = React.createClass({
    getInitialState() {
        return {
            mapData: {
                st: DemoStore.getMapData("st"),
                msa: DemoStore.getMapData("msa")
            },
            geoType: "st",
            currYear: "1977",
            selected: "36",
            varField: "net_job_creation",
            varString: "Net Job Births",
            scale: false
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

        $(".varSelect").first().button("toggle");
        $("#total").button("toggle");

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
        if(e.keyCode == 13 && parseInt(this.state.currYear) < 2013) {
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
            }, 750);
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

    _changeSelected(newSel) {
        if(newSel[0] === "0") newSel = newSel[1];
        this.setState({
            selected: newSel
        });
    },

    _onButtonClick(vr) {
        // console.log(vr);
        $(".varSelect").removeClass("active");
        $("#" + vr).addClass("active");
        this.setState({
            varField: vr,
            varString: vr.replace(/_/g, " ")
                            .replace(/\w\S*/g, (txt) => {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            })
        });
    },

    _togglePercent(vr) {
        // $("#togglePercent").toggleClass("active");
        $(".togglePercent").removeClass("active");
        $("#" + vr).addClass("active");
        this.setState({
            scale: vr === "percent"
        });
    },

    render() {
        console.log(this.state);
        return (
            <div className="container-fluid main">
                <h1>Business Dynamics Statistics Job Creation</h1>
                <div className="row">
                    <div className="col-md-12">
                        <DataMap changeSelected={this._changeSelected} geoType={this.state.geoType} changeGeoType={this.changeGeoType} data={this.state.mapData[this.state.geoType]} currYear={this.state.currYear} />
                    </div>
                </div>
                <div className="row controls">
                    <div className="col-md-12">
                        <input id="yearSlider" type="range" min="1977" max="2012" step="1" defaultValue={this.state.currYear} />

                    </div>
                </div>
                <div className="row controls">
                    <div className="col-md-12">
                        <label><input id="yearSelect" type="number" defaultValue={this.state.currYear} onKeyDown={this._onChangeYear} name="year" /> </label>
                        <button type="button" onClick={this._handleClick} className="btn btn-default playpause"><span id="playpause" className="glyphicon glyphicon-play"></span></button>
                        <div className="btn-group" role="group" aria-label="...">
                            <button type="button" onClick={this._onButtonClick.bind(null, "net_job_creation")} id="net_job_creation" className="btn btn-default varSelect">Net Jobs Created</button>
                            <button type="button" onClick={this._onButtonClick.bind(null, "job_creation")} id="job_creation" className="btn btn-default varSelect">Jobs Created</button>
                            <button type="button" onClick={this._onButtonClick.bind(null, "job_destruction")} id="job_destruction" className="btn btn-default varSelect">Jobs Destroyed</button>
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="btn-group" role="group" aria-label="...">
                            <button type="button" onClick={this._togglePercent.bind(null, "total")} id="total" className="btn btn-default togglePercent">Total jobs</button>
                            <button type="button" onClick={this._togglePercent.bind(null, "percent")} id="percent" className="btn btn-default togglePercent">Percent jobs</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <YearGraph scale={this.state.scale} varString={this.state.varString} varField={this.state.varField} changeSelected={this._changeSelected} geoType={this.state.geoType} data={this.state.mapData[this.state.geoType]} currYear={this.state.currYear} />
                </div>
                <div className="row">
                    <AreaGraph scale={this.state.scale} varString={this.state.varString} varField={this.state.varField} geoType={this.state.geoType} data={this.state.mapData[this.state.geoType] ? this.state.mapData[this.state.geoType][this.state.selected] : null} selected={this.state.selected} />
                </div>
            </div>
        );
    }
});

module.exports = DemoOne;
