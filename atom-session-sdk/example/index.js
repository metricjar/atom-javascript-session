"use strict";

window.ironSourceAtomInit = function () {
  var options = {
    endpoint: "https://track.atom-data.io/",
    auth: "YOUR_AUTH_KEY",
    userID: "abc123",
    sessionID: "def456", // Custom sessionID
    flushInterval: 30, // Data sending interval
    bulkLen: 20, // Number of records in each bulk request
    bulkSize: 40, // The maximum bulk size in KB.
    sessionLifeTime: 60 * 1000, // Session ID life time
    debug: true // Enable print debug information
  };

  var stream = "";
  var session = new IronSourceAtomSession(options);

  var sessionAdd = document.getElementById("session-btn"),
    sessionFlush = document.getElementById("session-flush"),
    sessionClear = document.getElementById("session-clear");

  var authKey = document.getElementById("auth-key"),
    sessionStream = document.getElementById("session-stream"),
    sessionData = document.getElementById("session-data"),
    sessionBatch = document.getElementById("session-batch"),
    sessionResult = document.getElementById("session-result"),
    generateSessionData = document.getElementById('generate-session-data');

  authKey.addEventListener('blur', function () {
    options.auth = authKey.value;
    session = new IronSourceAtomSession(options);
  });

  // Tracker
  sessionAdd.addEventListener("click", function () {
    try {
      session.track(sessionStream.value, sessionData.value);
    } catch (e) {
      sessionResult.innerHTML = e;
      return;
    }
    updateBatch();
  });


  generateSessionData.addEventListener("click", function () {
    for (var i = 0; i < 4; i++) {
      var number = Math.random() * (3000 - 3) + 3;
      var genData = {
        event_name: "JS-SDK-TRACKER",
        string_value: String(number),
        int_value: Math.round(number),
        float_value: number,
        ts: new Date()
      };
      try {
        session.track(sessionStream.value, genData);
      } catch (e) {
        sessionResult.innerHTML = e;
        return;
      }
    }
    updateBatch();
  });


  sessionFlush.addEventListener("click", function () {
    session.flush(null, function (results) {
      var output = '[\n';
      results.forEach(function (result) {
        output += JSON.stringify(result) + '\n';
      });
      sessionResult.innerHTML = output + ']';
      updateBatch();
    });
  });

  sessionClear.addEventListener("click", function () {
    clearSessionInputs();
  });

  function updateBatch() {
    var output = '';
    for (stream in session.tracker_.accumulated) {
      var data = session.tracker_.accumulated[stream];
      output += 'Stream ' + stream + ': \n' + data.join(',\n') + '\n';
    }
    sessionBatch.innerHTML = output;
  }

  function clearSessionInputs() {
    sessionStream.value = "";
    sessionData.value = "";
  }
};