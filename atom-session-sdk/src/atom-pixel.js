"use strict";

function ISTrackerPixelException(message) {
   this.message = message;
   this.name = "ISTrackerPixelException";
}

function TrackerPixel() {
  TrackerPixel.trackers = TrackerPixel.trackers || {};
  TrackerPixel.methods = TrackerPixel.methods || {
    'create': craeteTracker,
    'use': useTracker,
    'send': sendData
  };

  var method = arguments[0];

  if (method in TrackerPixel.methods) {
    var methodLink = TrackerPixel.methods[method];
    methodLink.apply(methodLink, arguments);
  } else {
    throw new ISTrackerPixelException("Method '" + method + "' not exists!");
  }
}

function craeteTracker() {
  if (arguments.length < 2) {
    throw new ISTrackerPixelException('Not enough arguments!');
  }

  var trackerUrl = arguments[1];
  var alias = arguments[2] || '';

  if (alias.length > 0) {
    TrackerPixel.trackers[alias] = trackerUrl;
  }
  
  TrackerPixel.currentTracker = trackerUrl;
}

function useTracker() {
  if (arguments.length < 2) {
    throw new ISTrackerPixelException('Not enough arguments!');
  }

  var alias = arguments[1];
  if (alias in TrackerPixel.trackers) {
    TrackerPixel.currentTracker = TrackerPixel.trackers[alias];
  } else {
    throw new ISTrackerPixelException("Tracker with alias '" + alias + "' not exists!");
  }
}

function sendData() {
  if (arguments.length < 3) {
    throw new ISTrackerPixelException('Not enough arguments!');
  }

  var stream = arguments[1];
  var data = arguments[2];

  if ((typeof data !== 'string' && !(data instanceof String))) {
    try {
      data = JSON.stringify(data);
    } catch (e) {
      throw new ISTrackerPixelException("Data is invalid - can't be stringified")
    }
  }
  var atomIframe = document.createElement('iframe');
  atomIframe.src = TrackerPixel.currentTracker + '?stream=' + encodeURIComponent(stream) + '&data=' + encodeURIComponent(data);
  atomIframe.height = "0px";
  atomIframe.width = "0px";
  document.body.appendChild(atomIframe);
};


var w = window;
if (w.ISTrackerPixel && w.ISTrackerPixel.q) {
  var eventQueue = w.ISTrackerPixel.q;

  if (eventQueue.length > 0) { 
    console.log("Flush queued events!");
    for (var index in eventQueue) {
      TrackerPixel.apply(TrackerPixel, eventQueue[index]);
    }
  }
}

w.ISTrackerPixel = TrackerPixel;

