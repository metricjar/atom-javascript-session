var TrackerPixel = require('../../dist/atom-pixel.sdk').TrackerPixel;
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Atom Pixel Class Test', function () {
  describe('Pixel Tracker Creation', function () {
    before(function () {
      TrackerPixel('create', 'https://test.test/track.html', 'testTracker');
    });
    it('Should create an Atom Pixel Tracker', function () {
      expect(TrackerPixel.trackers.testTracker).to.equal('https://test.test/track.html');
    });
    after(function () {
      TrackerPixel('clear', 'testTracker');
    });
  });

  describe('Pixel Tracker Clearing', function () {
    before(function () {
      TrackerPixel('create', 'https://test.test/track.html', 'testTracker');
      TrackerPixel('clear', 'testTracker');
    });
    it('Should clear Atom Pixel Tracker', function () {
      expect(TrackerPixel.trackers.testTracker).to.be.undefined;
    });
  });

  describe('Pixel Tracker Usage', function () {
    before(function () {
      TrackerPixel('create', 'https://test.test/track.html', 'testTracker');
      TrackerPixel('create', 'https://other.test/track.html', 'testTracker2');
      TrackerPixel('use', 'testTracker');
    });
    it('Should set current tracker to alias', function () {
      expect(TrackerPixel.currentTracker).to.equal('https://test.test/track.html');
    });
    after(function () {
      TrackerPixel('clear', 'testTracker');
      TrackerPixel('clear', 'testTracker2');
    });
  });

  describe('Pixel Tracker Iframe Creation', function () {

    before(function () {
      TrackerPixel('create', 'http://track.to.atom/track.html', 'testTracker');
      TrackerPixel('use', 'testTracker');
      TrackerPixel('send', 'test', {'hello': "world"});
    });

    it('Should create an iframe for data tracking with correct parameters', function () {
      expect(document.getElementsByTagName("iframe")[0].src).to.equal("http://track.to.atom/track.html?stream=test&data=%7B%22hello%22%3A%22world%22%7D");
    });
    after(function () {
      TrackerPixel('clear', 'testTracker');
    });
  });
});