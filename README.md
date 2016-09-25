# ironSource.atom Session SDK for JavaScript

[![License][license-image]][license-url]

atom-javascript-session is the official [ironSource.atom](http://www.ironsrc.com/data-flow-management) SDK for Web Browsers.

## Change Log
### v1.0.0
- Basic features: 
    - sessionID & userID added to all events
    - sessionID generate randomly
    - userID generate randomly (if not set)
    - sessionID updates in 30 min in idle (by default)

## Example
```js
"use strict";

// Need to include Atom SDK

var options = {
    endpoint: "https://track.atom-data.io/",
    auth: "<YOUR_AUTH_KEY>",
    userID: "<YOUR_UNIQUE_USER_ID>",
    flushInterval: 30, // Data sending interval
    bulkLen: 20, // Number of records in each bulk request
    bulkSize: 40, // The maximum bulk size in KB.
    sessionLifeTime: 2 * 1000, // Session ID life time
    debug: true // Enable print debug information
  };

var session = new IronSourceAtomSession(options);

session.track("test", "{\"test\": \"test1\"}")

session.flush(null, function (results) {
    console.log(results)
})
```

## License
[MIT](LICENSE)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE