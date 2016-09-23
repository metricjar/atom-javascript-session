(function(window, document, undefined) {

'use strict';
// can be deleted
function generateNumbericRandomID(length) {
    var idLength = length ? length : 32;
    var sessionID = "";
    var possible = "0123456789";

    for (var index = 0; index < idLength; index++) {
        sessionID += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return sessionID
}

/**
 * Generate random ID UUID-4
 * @param {Number} length - length for generated ID
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
};

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
 * @param {Number} [options.flushInterval=30 seconds] - Data sending interval
 * @param {Number} [options.bulkLen=20] - Number of records in each bulk request
 * @param {Number} [options.bulkSize=40KB] - The maximum bulk size in KB.
 *
 * Optional for ISAtom main object:
 * @param {String} [options.endpoint] - Endpoint api url
 * @param {String} [options.auth] - Key for hmac authentication
 * @param {String} [options.userID] - Unique user ID
 * @param {Boolean} [options.debug] - Enable print debug information
 * @param {Number} [options.sessionLifeTime] - Session life time
 * @constructor
 **/
function Session(options) {
    this.TAG_ = "IronSourceAtomSession"

    this.STORAGE_PREFIX_ = "ATOM_SESSION_";
    this.SESSION_KEY_ = "SESSION_ID";
    this.SESSION_KEY_CREATE_ = "SESSION_START_TIME";

    options = options || {};
    this.userID_ = options.userID;
    this.isDebug_ = options.debug;

    this.tracker_ = new IronSourceAtom.Tracker(options);
    this.sessionLifeTime_ = options.sessionLifeTime ? options.sessionLifeTime : 30 * 60 * 1000;

    if (this.userID_) {
        printLog(this.TAG_, "User added: " + this.userID_, this.isDebug_)
        localStorage.setItem(this.STORAGE_PREFIX_ + this.USER_KEY_, this.userID_);
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
Session.prototype.track = function(stream, data) {
    var self = this;

    function getSessionID_() {
        var sessionID = localStorage.getItem(self.STORAGE_PREFIX_ + self.SESSION_KEY_);
        var sessionStartTime = localStorage.getItem(self.STORAGE_PREFIX_ + self.SESSION_KEY_CREATE_);

        var currentTime = Date.now();

        function updateSessionID_() {
            sessionID = generateRandomID()
            localStorage.setItem(self.STORAGE_PREFIX_ + self.SESSION_KEY_, sessionID);
            localStorage.setItem(self.STORAGE_PREFIX_ + self.SESSION_KEY_CREATE_, currentTime);

            printLog(self.TAG_, "Session ID updated: " + sessionID, self.isDebug_)
            return sessionID;
        }

        if (!sessionID) {
            return updateSessionID_();
        }

        if ((currentTime - sessionStartTime) >= self.sessionLifeTime_) {
            return updateSessionID_();
        }

        // update session time
        localStorage.setItem(self.STORAGE_PREFIX_ + self.SESSION_KEY_CREATE_, currentTime);
        return sessionID;
    }

    var dataContainer = {}
    if ((typeof data !== 'string' && !(data instanceof String))) {
        dataContainer = data;
    } else {
        try {
            dataContainer = JSON.parse(data);
        } catch (e) {
            /* istanbul ignore next */
            throw new Error("Invalid JSON String - can't be converted to Object", e);
        }
    }

    function getUserID_() {
        var userID = localStorage.getItem(self.STORAGE_PREFIX_ + self.USER_KEY_);
        if (!userID) {
            userID = generateRandomID();
            localStorage.setItem(self.STORAGE_PREFIX_ + self.USER_KEY_, userID);
        }

        return userID;
    }

    dataContainer["sessionID"] = getSessionID_();
    dataContainer["userID"] = self.userID_ ? self.userID_ : getUserID_();

    printLog(self.TAG_, "Added data to tracker: " + JSON.stringify(dataContainer), self.isDebug_)

    self.tracker_.track(stream, data);
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
Session.prototype.flush = function(targetStream, callback) {
    this.tracker_.flush(targetStream, callback)
};
}(window, document));
