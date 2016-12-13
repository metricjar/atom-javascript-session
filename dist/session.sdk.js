(function(window, document, undefined) {

'use strict';

/**
 * This class implements an Atom Session
 * @param {Object} options
 * @param {String} [options.userID] - Custom User ID UUID-4
 * @param {String} [options.sessionID] - Custom Session ID UUID-4
 * @param {Number} [options.sessionLastActive] - Custom Session Last Active Time (UnixTime)
 * @param {Number} [options.sessionLifeTime=30 minutes] - Session life time in milliseconds
 * @param {Boolean} [options.debug] - Enable print debug information
 *
 * Optional for ISAtom main object:
 * @param {Number} [options.flushInterval=30 seconds] - Data sending interval
 * @param {Number} [options.bulkLen=20] - Number of records in each bulk request
 * @param {Number} [options.bulkSize=40KB] - The maximum bulk size in KB.
 * @param {String} [options.endpoint] - Endpoint api url
 * @param {String} [options.auth] - Key for hmac authentication
 * @param {String} [options.sdkVersion] - Atom SDK Version
 * @param {String} [options.sdkType] - Atom SDK Type
 *
 * @constructor
 **/
function Session(options) {
  this.TAG = "ISA-Session";

  var SDK_VERSION = "1.1.7";
  var SDK_TYPE = "atom-js-session";

  // Local storage keys
  this.STORAGE_PREFIX = "ATOM_SESSION_";
  this.SESSION_KEY = "SESSION_ID";
  this.SESSION_LAST_ACTIVE = "SESSION_LAST_ACTIVE";
  this.USER_ID = "USER_ID";

  options = options || {};
  this.userID = options.userID;
  this.sessionID = options.sessionID;
  this.sessionLastActive = options.sessionLastActive || Date.now();
  this.isDebug = options.debug || false;

  if (window.IronSourceAtom) {
    options.sdkVersion = SDK_VERSION;
    options.sdkType = SDK_TYPE;
    this.tracker_ = new IronSourceAtom.Tracker(options);
  } else {
    throw new Error("Please include the ironSource Atom SDK in order to use the session sdk");
  }

  this.sessionLifeTime = options.sessionLifeTime ? options.sessionLifeTime : 30 * 60 * 1000;

  // Set custom userID, sessionID and start time.
  if (this.userID) {
    printDebug(this.TAG, "UserID added: " + this.userID, this.isDebug);
    localStorage.setItem(this.STORAGE_PREFIX + this.USER_ID, this.userID);
  }

  if (this.sessionID) {
    printDebug(this.TAG, "Session added: " + this.sessionID, this.isDebug);
    printDebug(this.TAG, "Session Last Active: " + this.sessionLastActive, this.isDebug);
    localStorage.setItem(this.STORAGE_PREFIX + this.SESSION_KEY, this.sessionID);
    localStorage.setItem(this.STORAGE_PREFIX + this.SESSION_LAST_ACTIVE, this.sessionLastActive);
  }

}

window.IronSourceAtomSession = Session;

/**
 * Start tracking events to ironSource Atom tracker
 * @param {String} stream - atom stream name
 * @param {String|Object} data - data to be tracked to atom.
 *
 * @example
 * var options = {
 *    endpoint: "https://track.atom-data.io/", // Optional  atom endpoint
 *    auth: "YOUR_HMAC_AUTH_KEY",              // Optional, depends on your stream config
 *    flushInterval: 10,                       // Optional, Tracker flush interval in seconds (default: 30 seconds)
 *    bulkLen: 50,                             // Optional, Number of events per bulk (batch) (default: 20)
 *    bulkSize: 20,                            // Optional, Size of each bulk in KB (default: 40KB)
 *    debug: true,                             // Optional, Enable print debug information (optional)
 *    userID: "CUSTOM_USER_ID",                // Optional, Custom userID
 *    sessionID: "CUSTOM_SESSION_ID",          // Optional,Custom sessionID
 *    sessionLifeTime: 30000                   // Optional, Custom Session ID lifetime in MS.
 * }
 *
 * var atomSession = new IronSourceAtom.Session(options); // Init a new session
 * var stream = "MY_STREAM_NAME", // Your target stream name
 * var data = {id: 1, string_col: "String"} // Data that matches your DB structure
 * atomSession.track(stream, data); // Start tracking and empty on the described above conditions
 **/
Session.prototype.track = function (stream, data) {
  var self = this;

  function getSessionID_() {
    var sessionID = localStorage.getItem(self.STORAGE_PREFIX + self.SESSION_KEY);
    var sessionLastActive = localStorage.getItem(self.STORAGE_PREFIX + self.SESSION_LAST_ACTIVE);
    var currentTime = Date.now();

    printDebug(self.TAG, "SessionID: " + sessionID, self.isDebug);
    printDebug(self.TAG, "SessionLastActive: " + sessionLastActive, self.isDebug);
    printDebug(self.TAG, "SessionLifeTime:" + self.sessionLifeTime, self.isDebug);
    if (!sessionID || (currentTime - sessionLastActive) >= self.sessionLifeTime) {
      sessionID = generateRandomID();
      localStorage.setItem(self.STORAGE_PREFIX + self.SESSION_KEY, sessionID);
      localStorage.setItem(self.STORAGE_PREFIX + self.SESSION_LAST_ACTIVE, currentTime);

      printDebug(self.TAG, "Session ID updated: " + sessionID, self.isDebug);
      return sessionID;
    }

    // Update session time
    localStorage.setItem(self.STORAGE_PREFIX + self.SESSION_LAST_ACTIVE, currentTime);
    return sessionID;
  }

  var dataContainer = {};
  if ((typeof data !== 'string' && !(data instanceof String))) {
    dataContainer = data;
  } else {
    try {
      dataContainer = JSON.parse(data);
    } catch (e) {
      throw new Error("Invalid JSON String - can't be converted to Object", e);
    }
  }

  function getUserID_() {
    var userID = localStorage.getItem(self.STORAGE_PREFIX + self.USER_ID);
    if (!userID) {
      userID = generateRandomID();
      localStorage.setItem(self.STORAGE_PREFIX + self.USER_ID, userID);
    }
    printDebug(self.TAG, "UserID: " + userID, self.isDebug);
    return userID;
  }

  dataContainer["ib_sessionid"] = getSessionID_();
  dataContainer["ib_userid"] = getUserID_();

  self.tracker_.track(stream, dataContainer);
};

/**
 * Flush accumulated events to ironSource Atom Session
 * @param {String} [targetStream] - atom stream name
 * @param {atomCallback} [callback] - The callback that handles the response.
 *
 * @example
 *
 *  // To Flush all events:
 *  atomSession.flush(null, function (results) {
 *    // returns an array of results, for example:
 *    // data is: {"a":[{key: "value"}],"b":[{key: "value"}]}
 *    // result: [{"err":"Auth Error: \"a\"","data":null,"status":401} ,{"err":null,"data":{"Status":"OK"},"status":200}]
 *    NOTE: the results will be in the same order as the data.
 *  }); // Send accumulated data immediately
 *
 * // If you don't need the results, just do:
 * atomSession.flush();
 * // OR to flush a single stream (optional callback)
 * atomSession.flush(streamName);
 **/
Session.prototype.flush = function (targetStream, callback) {
  this.tracker_.flush(targetStream, callback)
};

/**
 * Atom Callback function
 * @callback atomCallback
 * @param {String} error - error if exists else null
 * @param {Object} data - response from server
 * @param {Integer} status - response status from server
 */

/**
 * Generate random ID UUID-4
 * @param {Number} [length=32] - length for generated ID
 **/
function generateRandomID(length) {
  var idLength = length ? length : 32;

  var uuid = "";
  for (var index = 0; index < idLength; index++) {
    switch (index) {
      case 8:
      case 20:
        uuid += (Math.random() * 16 | 0).toString(16);
        break;
      case 16:
        uuid += (Math.random() * 4 | 8).toString(16);
        break;
      default:
        uuid += (Math.random() * 16 | 0).toString(16);
    }
  }
  return uuid;
}

/**
 * Print debug information
 * @param {String} tag - Class unique ID
 * @param {String} logData - Debug information
 * @param {Boolean} isDebug - Enable print debug information
 **/
function printDebug(tag, logData, isDebug) {
  if (isDebug) {
    console.log(tag + ": " + logData);
  }
}
}(window, document));
