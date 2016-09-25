# ironSource.atom Session SDK for JavaScript

[![License][license-image]][license-url]

atom-javascript-session is the official [ironSource.atom](http://www.ironsrc.com/data-flow-management) SDK for Web Browsers (with session support).

## Note
Please include the [atom js sdk](https://github.com/ironSource/atom-javascript) before this one in order to enable tracker functionality

## Change Log
### V1.1.0
- Fixing bug in user_id storage
- Fixing bug in session_id not sent
- Updating JS DOC
- Adding Support for custom sessionID & custom sessionLastActiv time
- Refactoring track function

### v1.0.0
- Basic features: 
    - sessionID & userID added to all events
    - sessionID generate randomly
    - userID generate randomly (if not set)
    - sessionID updates in 30 min in idle (by default)

## Example
```js
"use strict";

// NOTE: ATOM SDK MUST BE INCLUDED BEFORE THE SESSION SDK
// All of the following are optional
var options = {
    endpoint: "https://track.atom-data.io/",
    auth: "YOUR_AUTH_KEY",      // Auth Key (optional)
    userID: "abc123",           // Custom userID (optional)
    sessionID: "def456",        // Custom sessionID (optional)
    flushInterval: 30,          // Data sending interval
    bulkLen: 20,                // Number of records in each bulk request
    bulkSize: 40,               // The maximum bulk size in KB.
    sessionLifeTime: 60 * 1000, // Session ID life time in MS.
    debug: true                 // Enable print debug information
};

var session = new IronSourceAtomSession(options);
var data = {id: 1, string_col: "String"}; // Data that matches your DB structure
session.track("STREAM NAME", data);
session.flush(null, function (results) { // Optional on-demand flush
    console.log(results)
})
```

## License
[MIT](LICENSE)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
