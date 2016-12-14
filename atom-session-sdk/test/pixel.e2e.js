"use strict";

describe('Atom Pixel E2E Test', function () {
  this.timeout(10000);
  before(function () {
    var atomPixelScript = 'localhost:9876/dist/atom-pixel.sdk.js';

    var number = Math.random() * 3000 + 1;
    var data = {
      event_name: "ATOM-JS-SESSION-SDK-TEST-EVENT",
      string_value: String(number),
      int_value: Math.round(number),
      float_value: number,
      ts: new Date()
    };

    (function (windowObject, element, elementType, scriptUrl, trackerPixelFunc, a, m) {
      // Save data until script loads
      windowObject[trackerPixelFunc] = windowObject[trackerPixelFunc] || function () {
          (windowObject[trackerPixelFunc].q = windowObject[trackerPixelFunc].q || []).push(arguments);
        };
      a = element.createElement(elementType), m = element.getElementsByTagName(elementType)[0];
      a.async = 1;
      a.src = scriptUrl;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', atomPixelScript, 'ISTrackerPixel');


    /*
     To create an Atom pixel tracker:
     ISTrackerPixel('create', URL/track.html, TRACKER_ALIAS)
     */

    ISTrackerPixel('create', 'https://js-sdk.atom-data.io/session/latest/track.html', 'testTracker');
    ISTrackerPixel('use', 'testTracker');
    ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);
  });

  it('Should Finish E2E Test', function (done) {
    setTimeout(done, 5000);
  });


});
