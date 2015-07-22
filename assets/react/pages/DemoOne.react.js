var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),

    BirthDeathMap = require("../components/BirthDeathMap.react");

var DemoOne = React.createClass({
    getInitialState() {
        return {
            mapData: DemoStore.getMapData()
        }
    },
    render() {
        console.log(this.state);
        return (
            <div>
                <h1>Demo One</h1>
                <BirthDeathMap />
            </div> );
    }
});

module.exports = DemoOne;
