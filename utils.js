// Project from: http://eloquentjavascript.net/07_elife.html

// Helpers

/* jshint strict: global */

"use strict";

// Monkey patching Array
// Picks a random element from an array
Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random() * this.length)];
};


