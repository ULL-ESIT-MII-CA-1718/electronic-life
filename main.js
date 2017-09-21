//// Wall class

import {World} from "./world.js";
import {PlantEater} from "./plant-eater.js";
import {Plant} from "./plant.js";

function Wall() {}

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
