"use strict";
/*
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 *.
 */

// var io = require("./sails.io.js")();
var sailsIO = require("sails.io.js"),
    socketClient = require("socket.io-client");
var ServerActionCreator = require("../../actions/ServerActionsCreator");

var io = sailsIO(socketClient);

io.sails.url = 'http://localhost:1337'; // for API

module.exports = {
    init() {
        this.mapData(["job_creation_births", "job_destruction_deaths"]);
    },

    mapData(fields) {
        let fStr = "?" + fields.map((row) => "fields=" + row).join("&");
        io.socket.get("/firm/st" + fStr, (resData) => {
            // console.log("resData", resData);
            /*let realData = Object.keys(resData).map((val, i) => {

            });*/
            let realData = {};
            for(let prop in resData) {
                // realData[prop]
                realData[prop] = {};
                for(let i of resData[prop]) {
                    realData[prop][i["year2"]] = {
                        "job_creation_births": i["job_creation_births"],
                        "job_destruction_deaths": i["job_destruction_deaths"]
                    }
                }
            }
            ServerActionCreator.receiveMapData(realData);
        });
    }

  /*fipsTable: function(fipsType) {
    if(fipsType === "metro") {
      ServerActionCreators.receiveFips(fipsType, {});
    }
    else {
      io.socket.get("/" + fipsType + "fips", function(resData) {
        ServerActionCreators.receiveFipsTable(fipsType, resData);
      });
    }
  }*/

};
