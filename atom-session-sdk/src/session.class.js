'use strict';

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
 * @param {String} tag - class unique ID
 * @param {String} logData - Debug information
 * @param {Boolean} isDebug - Enable print debug information
 **/
function printLog(tag, logData, isDebug) {
  if (isDebug) {
    console.log(tag + ": " + logData);
  }
}

/**
 * This class implements a Atom Session
 * @param {Object} options
 * @param {String} [options.userID] - Custom User ID UUID-4
 * @param {String} [options.sessionID] - Custom Session ID UUID-4
 * @param {Boolean} [options.isDebug] - Enable debug printing
 * @param {Number} [options.sessionLastActive] - Custom Session Last Active Time (Unix time)
 * @param {Number} [options.sessionLifeTime=30 minutes] - Session life time in milliseconds
 *
 * Optional for ISAtom main object:
 * @param {Number} [options.flushInterval=30 seconds] - Data sending interval
 * @param {Number} [options.bulkLen=20] - Number of records in each bulk request
 * @param {Number} [options.bulkSize=40KB] - The maximum bulk size in KB.
 * @param {String} [options.endpoint] - Endpoint api url
 * @param {String} [options.auth] - Key for hmac authentication
 * @param {String} [options.userID] - Unique user ID
 * @param {Boolean} [options.debug] - Enable print debug information
 * @param {String} [options.sdkVersion] - Atom SDK Version
 * @param {String} [options.sdkType] - Atom SDK Type
 *
 * @constructor
 **/
function Session(options) {
  this.TAG_ = "ISA-Session";

  var SDK_VERSION = "1.1.0";
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

  this.sessionLifeTime_ = options.sessionLifeTime ? options.sessionLifeTime : 30 * 60 * 1000;

  // Set custom userID, sessionID and start time.
  if (this.userID) {
    printLog(this.TAG_, "UserID added: " + this.userID, this.isDebug);
    localStorage.setItem(this.STORAGE_PREFIX + this.USER_ID, this.userID);
  }

  if (this.sessionID) {
    printLog(this.TAG_, "Session added: " + this.sessionID, this.isDebug);
    printLog(this.TAG_, "Session Last Active: " + this.sessionLastActive, this.isDebug);
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
 *    endpoint: "https://track.atom-data.io/",
 *    auth: "YOUR_HMAC_AUTH_KEY", // Optional, depends on your stream config
 *    flushInterval: 10, // Optional, Tracker flush interval in seconds (default: 30 seconds)
 *    bulkLen: 50, // Optional, Number of events per bulk (batch) (default: 20)
 *    bulkSize: 20, // Optional, Size of each bulk in KB (default: 40KB)
 *    debug: true, // Optional, Print debug information
 *    userID: "YOUR_USER_ID" // Optional, unique user ID
 * }
 *
 * var session = new IronSourceAtom.Session(options); // Init a new session
 * var stream = "MY_STREAM_NAME", // Your target stream name
 * var data = {id: 1, string_col: "String"} // Data that matches your DB structure
 * session.track(stream, data); // Start tracking and empty on the described above conditions
 **/
Session.prototype.track = function (stream, data) {
  var self = this;

  function getSessionID_() {
    var sessionID = localStorage.getItem(self.STORAGE_PREFIX + self.SESSION_KEY);
    var sessionLastActive = localStorage.getItem(self.STORAGE_PREFIX + self.SESSION_LAST_ACTIVE);
    var currentTime = Date.now();

    printLog(self.TAG, "SessionID: " + sessionID, self.isDebug);
    printLog(self.TAG, "SessionLastActive: " + sessionLastActive, self.isDebug);
    printLog(self.TAG, "SessionLifeTime:"  + self.sessionLifeTime_, self.isDebug);
    if (!sessionID || (currentTime - sessionLastActive) >= self.sessionLifeTime_) {
      sessionID = generateRandomID();
      localStorage.setItem(self.STORAGE_PREFIX + self.SESSION_KEY, sessionID);
      localStorage.setItem(self.STORAGE_PREFIX + self.SESSION_LAST_ACTIVE, currentTime);

      printLog(self.TAG_, "Session ID updated: " + sessionID, self.isDebug);
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
    return userID;
  }

  dataContainer["ib_sessionid"] = getSessionID_();
  dataContainer["ib_userid"] = getUserID_();

  printLog(self.TAG_, "Added data to tracker: " + JSON.stringify(dataContainer), self.isDebug);

  self.tracker_.track(stream, dataContainer);
};

/**
 * Flush accumulated events to ironSource Atom Session
 * @param {String} targetStream - atom stream name
 * @param {sessionCallback} callback - The callback that handles the response.
 *
 * @example
 *
 *  // To Flush all events:
 *  session.flush(null, function (results) {
 *    //returns an array of results, for example:
 *    //data is: {"a":[{key: "value"}],"b":[{key: "value"}]}
 *    //result: [{"err":"Auth Error: \"a\"","data":null,"status":401} ,{"err":null,"data":{"Status":"OK"},"status":200}]
 *    NOTE: the results will be in the same order as the data.
 *  }); // Send accumulated data immediately
 *
 * // If you don't need the results, just do:
 * session.flush();
 * // OR to flush a single stream (optional callback)
 * session.flush(stream);
 **/
Session.prototype.flush = function (targetStream, callback) {
  this.tracker_.flush(targetStream, callback)
};