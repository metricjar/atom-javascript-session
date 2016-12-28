"use strict";
var Session = require('../../dist/session.sdk').Session;
var expect = require('chai').expect;
var chai = require("chai");
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var Tracker = require('../../dist/sdk.min.js').Tracker;
chai.use(sinonChai);


describe('Session class and methods', function () {
  var sessStorageObj;
  var lastActiveStorageObj;
  var userId;
  var s;

  this.timeout(5000);
  before(function() {
    localStorage.removeItem("ATOM_SESSION_" + "SESSION_ID");
    localStorage.removeItem("ATOM_SESSION_" + "SESSION_LAST_ACTIVE");
  });
  describe('Constructor tests', function () {
    before(function() {
      s = new Session();
    });
    it('should generate new Session object with default values', function () {
      expect(typeof s).to.be.eql('object')
    });
  });
  describe('Session track', function() {
    before(function() {
      s = new Session();
    });
    describe('Local object creation', function() {
      before(function() {
        sinon.stub(Tracker.prototype, 'track');
        s.track("aaa", {"a":"b"});
        sessStorageObj = localStorage.getItem("ATOM_SESSION_" + "SESSION_ID");
        lastActiveStorageObj = localStorage.getItem("ATOM_SESSION_" + "SESSION_LAST_ACTIVE");
        userId = localStorage.getItem("ATOM_SESSION_" + "USER_ID")
      });
      it('should generate a local session id object', function() {
        expect(sessStorageObj).to.not.be.null;
      });
      it('should generate a local session last active object', function() {
        expect(lastActiveStorageObj).to.not.be.null;
      });
      it('should call the track function of the atom javascript sdk', function() {
        expect(Tracker.prototype.track).to.be.called.once
      });
      after(function() {
        Tracker.prototype.track.restore()
      })
    });
    describe('Calling the atom javascript track function', function() {
      before(function() {
        sinon.stub(Tracker.prototype, 'track');
        s.track("aaa", {"a":"b"});
        sessStorageObj = localStorage.getItem("ATOM_SESSION_" + "SESSION_ID");
        lastActiveStorageObj = localStorage.getItem("ATOM_SESSION_" + "SESSION_LAST_ACTIVE");
        userId = localStorage.getItem("ATOM_SESSION_" + "USER_ID")
      });
      it('should be called with the stream and the session parameters', function() {
        expect(Tracker.prototype.track).to.have.been.calledWith('aaa', {
          ib_sessionid: sessStorageObj,
          ib_userid: userId,
          "a":"b"
        })
      });
      after(function() {
        Tracker.prototype.track.restore()
      })
    });
    describe('Local storage objects already exist', function() {
      describe('Created during the last 30 minutes', function() {
        before(function() {
          s = new Session({
            userID: '123',
            sessionID: 'abc'
          });
          sinon.stub(Tracker.prototype, 'track');
          s.track("aaa", {"a":"b"});
        });
        it('track should be called with the existing local storage object', function() {
          expect(Tracker.prototype.track).to.have.been.calledWith('aaa', {
            ib_sessionid: 'abc',
            ib_userid: '123',
            "a": "b"
          })
        });
        after(function() {
          Tracker.prototype.track.restore()
        })
      });
      describe('Created more than 30 minutes ago', function() {
        before(function() {
          s = new Session({
            userID: '123',
            sessionID: 'abc',
            sessionLastActive:1
          });
          sinon.stub(Tracker.prototype, 'track');
          s.track("aaa", {"a":"b"});
        });
        it('should generate a new Session id', function() {
          expect(Tracker.prototype.track).to.not.have.been.calledWith('aaa', {
            ib_sessionid: 'abc',
            ib_userid: '123',
            "a": "b"
          })
        });
        after(function() {
          Tracker.prototype.track.restore()
        })
      })
    })
  })
});
