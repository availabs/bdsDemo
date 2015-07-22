var React = require("react"),
    DemoStore = require("../stores/DemoStore.react"),

    BirthDeathMap = require("../components/BirthDeathMap.react");

var DemoOne = React.createClass({
    getInitialState() {
        return {
            mapData: DemoStore.getMapData()
        }
    },
    componentDidMount() {
        DemoStore.addChangeListener(this._onChange);
    },
    componentWillUnmount() {
        DemoStore.removeChangeListener(this._onChange);
    },
    _onChange() {
        this.setState({
            mapData: DemoStore.getMapData()
        });
    },
    render() {
        // console.log(this.state);
        return (
            <div>
                <h1>Demo One</h1>
                <BirthDeathMap data={this.state.mapData} />
            </div> );
    }
});

module.exports = DemoOne;
