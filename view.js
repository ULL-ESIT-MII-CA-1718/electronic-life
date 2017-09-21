//// The View Class

import {directions} from "./critter.js";

function View(world, vector) {
  this.world = world;
  this.vector = vector;
}

function charFromElement(element) {
  if (element == null) {
    return " ";
  } else {
    return element.originChar;
  }
}

View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target)) {
    return charFromElement(this.world.grid.get(target));
  } else {
    return "#";
  }
};

// find all grid spaces with a given character
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions) {
    if (this.look(dir) == ch) {
      found.push(dir);
    }
  }
  return found;
};

// find one grid space with a given character
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0) { return null; }
  return found.randomElement();
};

export {View, charFromElement};

