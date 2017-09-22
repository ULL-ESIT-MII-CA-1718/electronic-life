//// The World Class

import {Vector} from "./vector.js";
import {directions} from "./critter.js";
import {View, charFromElement} from "./view.js";
import {Grid} from "./grid.js";

// Construct an element using the legend and character
function elementFromChar(legend, ch) {
  if (ch == " ") {
    return null;
  }
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend, container) {
  var grid = new Grid(map[0].length, map.length);

  this.grid = grid;
  this.legend = legend;
  this.container = container;

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    }
  });
}

World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};

var cellStyles = {
  "#": 'wall',
  "O": 'plant-eater',
  "*": 'plant'
};

var emoji = new EmojiConvertor();

emoji.init_env();
var auto_mode = emoji.replace_mode;
var fenotype = {
  "#": emoji.replace_colons(":door:"), 
  "O": emoji.replace_colons(":rabbit2:"), 
  "*": emoji.replace_colons(':herb:')};
/*
document.getElementById('out1').innerHTML = emoji.replace_colons(
  "hello :smile: world :heart:  :cinema:\n :christmas_tree: :rabbit2: :door:");
*/

function buildCell(char){
  var css = cellStyles[char];
  var f = fenotype[char] ||'';
  console.log(`${char} => ${f}`);
  var output = "<td class='" + css + "'>" +
               f + "</td>";
  return output;
}

World.prototype.toHtmlTable = function() {
  var table = "<table class='world-map'>";
  var row = "";
  for (var y = 0; y < this.grid.height; y++) {
    row = "<tr>";
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      row += buildCell(charFromElement(element));
    }
    row = row + "</tr>";
    table += row;
  }
  table = table + "</table>";
  return table;
};

World.prototype.turn = function() {
  var acted = []; // keep track of critters who have already had their turn
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
  this.draw();
};

World.prototype.draw = function() {
  this.container.innerHTML = this.toHtmlTable();
  console.log(this.toString());
};

// Define action types and their handlers
var actionTypes = {};

actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  // It costs 1 energy to move
  var cantMove = dest == null ||
                 critter.energy <= 1 ||
                 this.grid.get(dest) != null;
  if (cantMove) { return false; }
  // Spend energy and update position.
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};

actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null) { return false; }
  // Gain energy and eat the food at the destination
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);
  var cantReproduce = dest == null ||
                      critter.energy <= 2 * baby.energy ||
                      this.grid.get(dest) != null;
  if (cantReproduce) { return false; }
  // Spend energy and reproduce
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
                action.type in actionTypes &&
                actionTypes[action.type].call(this, critter, vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0) {
      this.grid.set(vector, null);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest)) {
      return dest;
    }
  }
};

export {World};

