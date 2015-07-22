"use strict";
/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 */

var AppDispatcher = require("../dispatcher/AppDispatcher"),
    Constants = require("../constants/AppConstants"),
    EventEmitter = require("events").EventEmitter,
    assign = require("object-assign"),

    ActionTypes = Constants.ActionTypes,
    CHANGE_EVENT = "change";

var _mapData = {};


var zbpStore = assign({}, EventEmitter.prototype, {

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getMapData() {
    return _mapData;
  }
});

zbpStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    /*case ActionTypes.RECEIVE_ZIPCODES:
      _zipcodeList = action.zipcodes.data;
      zbpStore.emitChange();
    break;
    */
    case ActionTypes.RECEIVE_MAP_TYPES:
        _mapData = action.mapData;
        zbpStore.emitChange();
    break;

    default:
      // do nothing
  }

});

module.exports = zbpStore;
