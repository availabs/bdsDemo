"use strict";

// Libraries
var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    Routes = Router.Routes,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute,
// Layout
	App = require("./pages/layout.react"),
// Components
	Hello = require("./pages/Hello.react"),
    BirthDeathMap = require("./pages/BirthDeathMap.react");

console.log("in indexView.jsx");
var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="hello" path="/hello" handler={Hello} />
        <Route name="map" path="/map" handler={BirthDeathMap} />
		<DefaultRoute handler={BirthDeathMap} />
	</Route>
);

Router.run(routes, (Handler) => {
	React.render(<Handler/>, document.getElementById("route-wrapper"));
});
