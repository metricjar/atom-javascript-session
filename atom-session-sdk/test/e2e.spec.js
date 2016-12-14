// "use strict";
//
// var atomPixelScript = '../';
//
// var number = Math.random() * 3000 + 1;
// var data = {
//   event_name: "JS-SDK-PUT-EVENT-TEST",
//   string_value: String(number),
//   int_value: Math.round(number),
//   float_value: number,
//   ts: +new Date()
// };
//
// (function (windowObject, element, elementType, scriptUrl, trackerPixelFunc, a, m) {
//   // Save data until script loads
//   windowObject[trackerPixelFunc] = windowObject[trackerPixelFunc] || function () {
//       (windowObject[trackerPixelFunc].q = windowObject[trackerPixelFunc].q || []).push(arguments);
//     };
//   a = element.createElement(elementType), m = element.getElementsByTagName(elementType)[0];
//   a.async = 1;
//   a.src = scriptUrl;
//   m.parentNode.insertBefore(a, m);
// })(window, document, 'script', atomPixelScript, 'ISTrackerPixel');
//
// try {
//
//   /*
//    To create an Atom pixel tracker:
//    ISTrackerPixel('create', URL/track.html, TRACKER_ALIAS)
//    */
//
//   ISTrackerPixel('create', 'https://js-sdk.atom-data.io/session/latest/track.html', 'tracker1');
//   ISTrackerPixel('create', 'https://js-sdk.atom-data.io/session/latest/track.html', 'tracker2');
//   ISTrackerPixel('create', 'https://js-sdk.atom-data.io/session/latest/track.html', 'tracker3');
//
//   /*
//    To Use the created tracker:
//    ISTrackerPixel('use', 'TRACKER_NAME');
//    To send Data:
//    ISTrackerPixel('send', {"YOUR": "DATA"});
//    * */
//
//   ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);
//   ISTrackerPixel('use', 'tracker1');
//   ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);
//
//   ISTrackerPixel('use', 'tracker3');
//   ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);
//
//   setTimeout(function () {
//     ISTrackerPixel('use', 'tracker2');
//     ISTrackerPixel('send', 'sdkdev_sdkdev.public.atom_demo_events', data);
//   }, 5000);
// } catch (e) {
//   console.log(e.message);
// }