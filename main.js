//// Wall class

import {World} from "./world.js";

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
