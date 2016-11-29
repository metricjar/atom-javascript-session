# ironSource.atom SDK for JavaScript with session support

[![License][license-image]][license-url]
[![Docs][docs-image]][docs-url]

atom-javascript-session is the official [ironSource.atom](http://www.ironsrc.com/data-flow-management) SDK for Web Browsers (with session support).

- [Signup](https://atom.ironsrc.com/#/signup)
- [Documentation][docs-url]
- [Installation](#installation)
- [Usage](#usage)
- [Change Log](#change-log)
- [Example](#example)

## Installation

### Installation with Bower

```sh
$ bower install --save atom-sdk-js-session
```

```html
<script src="bower_components/atom-sdk-js-session/dist/session.sdk.min.js"></script>
```

### Installation with Atom CDN
```html
To install a certain version just do:
<script src="https://js-sdk.atom-data.io/session/{VERSION_NUMBER_HERE}/session.sdk.min.js"></script>
OR for the latest version:
<script src="https://js-sdk.atom-data.io/session/latest/session.sdk.min.js"></script>

For example:
<script src="https://js-sdk.atom-data.io/session/1.1.6/session.sdk.js"></script>
OR
<script src="https://js-sdk.atom-data.io/session/1.1.6/session.sdk.min.js"></script>

The CDN supports both HTTP and HTTPS
```

### Note

**This SDK requires the [atom js sdk](https://github.com/ironSource/atom-javascript) in order to work.**

## Usage

```js
// NOTE: ATOM SDK MUST BE INCLUDED BEFORE THE SESSION SDK
// All of the following parameters are optional, see the doc for more info
var options = {
  endpoint: "https://track.atom-data.io/", // Optional  Atom endpoint
  auth: "YOUR_HMAC_AUTH_KEY",              // Optional, Depends on your stream config
  flushInterval: 10,                       // Optional, Tracker flush interval in seconds (default: 30 seconds)
  bulkLen: 50,                             // Optional, Number of events per bulk (batch) (default: 20)
  bulkSize: 20,                            // Optional, Size of each bulk in KB (default: 40KB)
  debug: true,                             // Optional, Enable print debug information (optional)
  userID: "CUSTOM_USER_ID",                // Optional, Custom userID
  sessionID: "CUSTOM_SESSION_ID",          // Optional, Custom sessionID
  sessionLifeTime: 30000                   // Optional, Custom Session ID lifetime in MS.
}
var session = new IronSourceAtomSession(options);
var data = {id: 1, string_col: "String"}; // Data that matches your DB structure
session.track("STREAM NAME", data);
session.flush(null, function (results) { // Optional on-demand flush
    console.log(results)
})
```

## Change Log

### V1.1.6
- Fixed flush process - queue iteration errors
- Added pixel cleanup

### V1.1.2
- Added pixel tracking code + example

### V1.1.1
- Improved example
- Improved README
- Adding Bower
- Adding JSDOC
- Adding CDN

### V1.1.0
- Fixing bug in user_id storage
- Fixing bug in session_id not sent
- Updating JS DOC
- Adding Support for custom sessionID & custom sessionLastActive time
- Refactoring track function

### v1.0.0
- Basic features:
    - sessionID & userID added to all events
    - sessionID generate randomly
    - userID generate randomly (if not set)
    - sessionID updates in 30 min in idle (by default)

## Example

You can use our [example][example-url] for sending data to Atom:

![Example Image](https://cloud.githubusercontent.com/assets/7361100/18834366/27340b48-83fe-11e6-98fb-7453848ead73.png)

## License
[MIT](LICENSE)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[example-url]: atom-session-sdk/example
[docs-image]: https://img.shields.io/badge/docs-latest-blue.svg
[docs-url]: https://ironsource.github.io/atom-javascript-session/
