/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 */

var AppDispatcher = require("../dispatcher/AppDispatcher");
var Constants = require("../constants/AppConstants");

var ActionTypes = Constants.ActionTypes;

module.exports = {
    receiveMapData(mapData) {
        console.log("ServerActionsCreator receiving", mapData);
        AppDispatcher.handleServerAction({
            type: ActionTypes.RECEIVE_MAP_DATA,
            mapData: mapData
        });
    }/*,
    receiveGeoJSON: function(geoJSON) {
        AppDispatcher.handleServerAction({
            type:ActionTypes.RECEIVE_GEOJSON,
            geoJSON: geoJSON
        });
    }*/

};
