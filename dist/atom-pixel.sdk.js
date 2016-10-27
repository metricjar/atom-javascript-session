(function(window, document, undefined) {

"use strict";

/**
 * Tracker Factory - Returns a getTrackFrame function that's used to track data to Atom through iframe
 * */
function IronSourceAtomTrackerFactory(trackUrl) {
  var getTrackFrame = function (stream, data) {

    if ((typeof data !== 'string' && !(data instanceof String))) {
      try {
        data = JSON.stringify(data);
      } catch (e) {
        throw new Error("data is invalid - can't be stringified")
      }
    }
    var atomIframe = document.createElement('iframe');
    atomIframe.src = trackUrl + '?stream=' + encodeURIComponent(stream) + '&data=' + encodeURIComponent(data);
    atomIframe.height = "0px";
    atomIframe.width = "0px";
    document.body.appendChild(atomIframe);
  };
  return getTrackFrame;
}

window.IronSourceAtomTrackerFactory = IronSourceAtomTrackerFactory;
}(window, document));
