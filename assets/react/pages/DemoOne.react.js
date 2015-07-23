"use strict"
var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),

    BirthDeathMap = require("../components/BirthDeathMap.react");

require("react/addons");

var DemoOne = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
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
        console.log(ruler);
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
        this.setState({
            mapData: DemoStore.getMapData(),
            currYear: e.target.value
        });
        $("#yearSlider").val(e.target.value).change();
    },
    render() {
        // console.log(this.state);
        return (
            <div>
                <h1>Demo One</h1>
                <BirthDeathMap data={this.state.mapData} currYear={this.state.currYear} />
                <input id="yearSlider" type="range" min="1977" max="2012" step="1" defaultValue={this.state.currYear} />
                <label><input id="yearSelect" type="number" value={this.state.currYear} onChange={this._onChangeYear} name="year" /> </label>
            </div>
        );
    }
});

module.exports = DemoOne;
