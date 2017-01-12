"use strict";

describe('Full E2E Test', function () {

  describe('Atom Session E2E Test', function () {
    var options;
    var data;
    this.timeout(12000);
    before(function () {
      options = {
        endpoint: "https://track.atom-data.io/",
        flushInterval: 1,
        bulkLen: 1,
        bulkSize: 1,
        sessionLifeTime: 1800000,
        debug: true
      };

      var number = Math.random() * 3000 + 1;
      data = {
        event_name: "ATOM-JS-SESSION-SDK-TEST-EVENT",
        string_value: "" + number,
        int_value: Math.round(number),
        float_value: number,
        ts: new Date()
      };
    });

    it('Should Finish E2E Test', function (done) {
      var session = new IronSourceAtomSession(options);
      session.track("sdkdev_sdkdev.public.atom_demo_events", data);
      setTimeout(function () {
        done();
      }, 4000);
    });
  });

  describe('Atom Pixel E2E Test', function () {
    this.timeout(10000);
    before(function () {
      var atomPixelScriptUrl = 'https://js-sdk.atom-data.io/session/test/atom-pixel.sdk.js';

      var number = Math.random() * 3000 + 1;
      var data = {
        event_name: "ATOM-JS-SESSION-SDK-PIXEL-TEST-EVENT",
        string_value: "" + number,
        int_value: Math.round(number),
        float_value: number,
        ts: new Date()
      };

      (function (windowObject, documentObject, elementType, scriptUrl, trackerPixelFunc, a, m) {
        // Save data until script loads
        windowObject[trackerPixelFunc] = windowObject[trackerPixelFunc] || function () {
            (windowObject[trackerPixelFunc].q = windowObject[trackerPixelFunc].q || []).push(arguments);
          };
        // Load the script with delay
        setTimeout(function () {
          a = documentObject.createElement(elementType);
          m = documentObject.getElementsByTagName(elementType)[0];
          a.async = 1;
          a.src = scriptUrl;
          m.parentNode.insertBefore(a, m);
        }, 3000);

      })(window, document, 'script', atomPixelScriptUrl, 'ISTrackerPixel');

      ISTrackerPixel('create', 'https://js-sdk.atom-data.io/session/test/track.html', 'testTracker');
      ISTrackerPixel('use', 'testTracker');
      ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);

    });

    it('Should Finish E2E Test', function (done) {
      setTimeout(function () {
        done();
      }, 5000);
    });
  });


});
