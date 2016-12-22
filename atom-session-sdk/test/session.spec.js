var Session = require('../../dist/session.sdk').Session;
var expect = require('chai').expect;
var sinon = require('sinon');

describe.skip('Tracker class and methods', function () {

  this.timeout(5000);

  describe('Constructor tests', function () {

    it('should generate new Tracker object with default values', function () {

    });

    it('should generate new Tracker objects with custom values', function () {

    });
  });

  describe('Track method tests', function () {

    it('should accumulate data in a backlog before flush', function () {
    });

    it('should throw an error when stream is empty', function () {

    });

    it('should flush each time when reaching the interval', function () {

    });

    it('should flush after a certain bulk length has been reached', function () {
    });

    it('should flush after a certain bulk size has been reached', function () {
    });

    it('should run flush with params', function () {
    });

    it('should handle bad auth - 401', function () {
    });

    it('should retry to flush on 500', function (done) {
    });

    it('should get a timeout on too long retry time', function (done) {

    });

  });
});