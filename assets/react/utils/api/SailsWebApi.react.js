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
        this.mapData("msa", ["job_creation_births", "job_destruction_deaths"]);
        this.mapData("st", ["job_creation_births", "job_destruction_deaths"]);
    },

    // type: msa or st
    mapData(type, fields) {
        let fStr = "?" + fields.map((row) => "fields=" + row).join("&");
        io.socket.get("/firm/" + type + "/yr" + fStr, (resData) => {
            let realData = {};
            for(let prop in resData) {
                realData[prop] = {};
                $.each(resData[prop], (_, i) => {
                    realData[prop][i["year2"]] = {
                        "job_creation_births": i["job_creation_births"],
                        "job_destruction_deaths": i["job_destruction_deaths"]
                    };
                });
            }

            ServerActionCreator.receiveMapData(type, realData);
        });
    }
};
