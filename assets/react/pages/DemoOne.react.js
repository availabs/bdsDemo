"use strict"
var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),

    BirthDeathMap = require("../components/BirthDeathMap.react");

var interval = null,
    inInterval = false;;

var DemoOne = React.createClass({
    getInitialState() {
        return {
            mapData: DemoStore.getMapData(),
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
            $("#yearSelect").val(e.target.value);
            this.setState({
                mapData: DemoStore.getMapData(),
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
            mapData: DemoStore.getMapData(),
            currYear: "1977"
        });
    },
    _onChangeYear(e) {
        if( e.keyCode == 13 ) {
            // console.log("_onChangeYear")
            this.setState({
                mapData: DemoStore.getMapData(),
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
        // console.log(e);
        // console.log("_handleClick");
        $("#playpause").toggleClass("glyphicon-play");
        $("#playpause").toggleClass("glyphicon-pause");
        if(interval) {
            clearInterval(interval);
            interval = null;
        }
        else {
            /*this.setState({
                mapData: DemoStore.getMapData(),
                currYear: "1977"
            });*/
            interval = setInterval(() => {
                inInterval = true;
                if(parseInt(this.state.currYear) > 2012) {
                    clearInterval(interval);
                    interval = null;
                    inInterval = false;
                    $("#playpause").toggleClass("glyphicon-play");
                    $("#playpause").toggleClass("glyphicon-pause");
                }
                else {
                    this.setState({
                        mapData: DemoStore.getMapData(),
                        currYear: (parseInt(this.state.currYear) + 1).toString()
                    });
                    $("#yearSlider").val(this.state.currYear).change();
                    $("#yearSelect").val(this.state.currYear);
                }
            }, 500);
        }
    },
    render() {
        // console.log(this.state);
        return (
            <div>
                <h1>Demo One</h1>
                <BirthDeathMap data={this.state.mapData} currYear={this.state.currYear} />
                <input id="yearSlider" type="range" min="1977" max="2012" step="1" defaultValue={this.state.currYear} />
                <label><input id="yearSelect" type="number" defaultValue={this.state.currYear} onKeyDown={this._onChangeYear} name="year" /> </label>
                <button type="button" onClick={this._handleClick} className="btn btn-default"><span id="playpause" className="glyphicon glyphicon-play"></span></button>
            </div>
        );
    }
});

module.exports = DemoOne;
