

//// The View Class

function View(world, vector) {
  this.world = world;
  this.vector = vector;
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


//// The World Class

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

function charFromElement(element) {
  if (element == null) {
    return " ";
  } else {
    return element.originChar;
  }
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
}

function buildCell(char){
  var css = cellStyles[char];
  var output = "<td class='" + css + "'>" +
               char + "</td>"
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
                      this.grid.get(dest) != null
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
    critter.energy -= 0.2
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

//// Wall class

function Wall() {}

//// Animation Loop

function animate(world) {
  var container = document.getElementById('#world');

}

//// Run program
function init() {
  var plan = ["############################",
              "#####                 ######",
              "##   ***                **##",
              "#   *##**         **  O  *##",
              "#    ***     O    ##**    *#",
              "#       O         ##***    #",
              "#                 ##**     #",
              "#   O       #*             #",
              "#*          #**       O    #",
              "#***        ##**    O    **#",
              "##****     ###***       *###",
              "############################"];

  var container = document.getElementById('world');
  var world = new World(plan, { "#": Wall, "O": PlantEater, "*": Plant }, container);

  (function loop(){
    world.turn(container);
    setTimeout(loop, 1000);
  })();
}

init();
