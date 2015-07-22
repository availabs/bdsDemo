"use strict";

// Libraries
var React = require("react"),
    Router = require("react-router"),
    Route = Router.Route,
    Routes = Router.Routes,
    Redirect = Router.Redirect,
    DefaultRoute = Router.DefaultRoute,

    SailsWebApi = require("./utils/api/SailsWebApi.react"),
// Layout
	App = require("./pages/layout.react"),
// Components
	Hello = require("./pages/Hello.react"),
    DemoOne = require("./pages/DemoOne.react");

SailsWebApi.init();

var routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="hello" path="/hello" handler={Hello} />
        <Route name="demo1" path="/demo1" handler={DemoOne} />
		<DefaultRoute handler={DemoOne} />
	</Route>
);

Router.run(routes, (Handler) => {
	React.render(<Handler/>, document.getElementById("route-wrapper"));
});
