/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Check the operating environment.
 */

// NOTE: This is run in the HEAD of the document, and must support IE8+.
// No ES5/ES6 features!

// This is loaded in the HEAD of the doc & uses a modified version of
// https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.FxaHead.Environment = factory();
  }
}(window, function () {
  'use strict';

  function Environment(win) {
    this.window = win;
  }

  Environment.prototype = {
    hasGetUserMedia: function () {
      var nav = this.window.navigator;

      return !! (nav.mediaDevices ||
                 nav.getUserMedia ||
                 nav.webkitGetUserMedia ||
                 nav.mozGetUserMedia ||
                 nav.msGetUserMedia);
    },

    hasPasswordRevealer: function () {
      var document = this.window.document;

      // dirty hack and check IE >= 10 directly.
      return !! (document.documentMode && document.documentMode >= 10);
    },

    hasTouchEvents: function () {
      var win = this.window;
      var document = win.document;

      // BEGIN MODERNIZR BASED CODE
      /*!
       * This code comes from Modernizr v2.7.1
       * www.modernizr.com
       *
       * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
       * Available under the BSD and MIT licenses: www.modernizr.com/license/
       */

      // touch event check.
      return !! (('ontouchstart' in win) || win.DocumentTouch && document instanceof win.DocumentTouch);
      // END MODERNIZR BASED CODE
    },

    isFramed: function () {
      var win = this.window;

      // HACK:
      // These are the iframe names when used in a native browser iframe.
      // Do not consider windows with these names framed.
      //
      // 'remote' is for about:accounts
      // 'payflow' is for Mozilla Payments reset PIN flow on Fx for Android.
      //   See #2607

      // use a hash instead of an array and array.indexOf
      // b/c this module can only use ES3.
      var nativeNames = {
        payflow: true,
        remote: true
      };

      var isNativelyEmbedded = nativeNames[win.name];

      return !! (
                 win.top &&
                 win.top !== win &&
                 ! isNativelyEmbedded
                );
    },

    /**
     * Detects if environment is about:accounts
     * @returns {Boolean}
     */
    isAboutAccounts: function () {
      var win = this.window;
      var isValidNativeFrame = !! (win.top && win.top !== win && win.name === 'remote');
      // cannot use url.js module here because environment.js is on its own.
      var isForced = win.location.search.indexOf('forceAboutAccounts=true') > 0;
      return isValidNativeFrame || isForced;
    },

    isFxiOS: function () {
      // User agent sniffing. Gross.
      return /FxiOS/.test(this.window.navigator.userAgent);
    },

    /**
     * Is the user in Firefox for iOS 10 or above?
     *
     * @param {String} [userAgent=navigator.userAgent] UA string
     * @returns {Boolean}
     */
    isFxiOS10OrAbove: function (userAgent) {
      var fxRegExp = /FxiOS\/(\d{2,}\.\d{1,})/;
      var matches = fxRegExp.exec(userAgent || this.window.navigator.userAgent);

      if (matches && matches[1]) {
        return parseFloat(matches[1]) >= 10;
      }

      return false;
    },

    /**
     * Is the user in Firefox (Desktop or Android) 57 or above?
     *
     * @param {String} [userAgent=navigator.userAgent] UA string
     * @returns {Boolean}
     */
    isFx57OrAbove: function (userAgent) {
      var fxRegExp = /Firefox\/(\d{2,}\.\d{1,})$/;
      var matches = fxRegExp.exec(userAgent || this.window.navigator.userAgent);

      if (matches && matches[1]) {
        return parseFloat(matches[1]) >= 57;
      }

      return false;
    },

    hasSendBeacon: function () {
      return typeof this.window.navigator.sendBeacon === 'function';
    }
  };

  return Environment;
}));