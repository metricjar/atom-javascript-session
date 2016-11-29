"use strict";

window.ironSourceAtomInit = function () {
  var options = {
    endpoint: "https://track.atom-data.io/",
    auth: "YOUR_AUTH_KEY",      // Auth Key
    debug: true                 // Enable print debug information
  };

  var stream = "";
  var atomSession = new IronSourceAtomSession(options);

  var sessionAdd = document.getElementById("session-btn"),
    sessionFlush = document.getElementById("session-flush"),
    sessionClear = document.getElementById("session-clear");

  var authKey = document.getElementById("auth-key"),
    sessionStream = document.getElementById("session-stream"),
    sessionData = document.getElementById("session-data"),
    sessionCUserID = document.getElementById("session-userid"),
    sessionCSessionID = document.getElementById("session-sessionid"),
    sessionCLifeTime = document.getElementById("session-lifetime"),
    sessionBatch = document.getElementById("session-batch"),
    sessionResult = document.getElementById("session-result"),
    generateSessionData = document.getElementById('generate-session-data');

  // Auth
  authKey.addEventListener('blur', function () {
    options.auth = authKey.value;
    atomSession = new IronSourceAtomSession(options);
  });

  // Session Custom User ID
  sessionCUserID.addEventListener('blur', function () {
    options.userID = sessionCUserID.value;
    atomSession = new IronSourceAtomSession(options);
  });

  // Session Custom User ID
  sessionCSessionID.addEventListener('blur', function () {
    options.sessionID = sessionCSessionID.value;
    atomSession = new IronSourceAtomSession(options);
  });

  // Session Custom User ID
  sessionCLifeTime.addEventListener('blur', function () {
    options.sessionLifeTime = sessionCLifeTime.value;
    atomSession = new IronSourceAtomSession(options);
  });

  // Tracker
  sessionAdd.addEventListener("click", function () {
    try {
      atomSession.track(sessionStream.value, sessionData.value);
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
        atomSession.track(sessionStream.value, genData);
      } catch (e) {
        sessionResult.innerHTML = e;
        return;
      }
    }
    updateBatch();
  });

  sessionFlush.addEventListener("click", function () {
    atomSession.flush(null, function (results) {
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
    for (stream in atomSession.tracker_.accumulated) {
      var data = atomSession.tracker_.accumulated[stream];
      output += 'Stream ' + stream + ': \n' + data.join(',\n') + '\n';
    }
    sessionBatch.innerHTML = output;
  }

  function clearSessionInputs() {
    sessionStream.value = "";
    sessionData.value = "";
    sessionCLifeTime.value = "";
    sessionCSessionID.value = "";
    sessionCUserID.value = "";
    options = {};
    options.debug = true;
    for (stream in atomSession.tracker_.accumulated) {
      atomSession.tracker_.accumulated[stream] = [];
    }
    updateBatch();
  }
};