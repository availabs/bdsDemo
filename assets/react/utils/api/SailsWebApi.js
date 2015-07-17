'use strict';
/*
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 *.
 */

var io = require('./sails.io.js')();
var ServerActionCreator = require('../../actions/ServerActionsCreator');

module.exports = {
    init() {
        this.mapData(["job_creation_births", "job_destruction_deaths"]);
    },

    mapData(fields) {
        let fStr = "?" + fields.map((row) => "fields=" + row).join("&");
        io.socket.get("http://localhost:1337/firm/st" + fStr, (resData) => {
            ServerActionCreator.receiveMapData(resData);
        });
    }

  /*fipsTable: function(fipsType) {
    if(fipsType === "metro") {
      ServerActionCreators.receiveFips(fipsType, {});
    }
    else {
      io.socket.get('/' + fipsType + 'fips', function(resData) {
        ServerActionCreators.receiveFipsTable(fipsType, resData);
      });
    }
  }*/

};
