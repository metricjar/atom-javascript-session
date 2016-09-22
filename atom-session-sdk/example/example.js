"use strict";

var options = {
    endpoint: "https://track.atom-data.io/",
    auth: "",
    debug: true,
    userID: "test_name"
};

var session = new IronSourceAtom.Session(options); 

session.track("test", "{\"test\": \"test1\"}")

session.flush(null, function (results) {
    console.log(results)
})