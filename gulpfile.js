var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("serve", shell.task("static-server -p 8080"));

/*  Open and configure one of these browsers:
    * Safari 10.1.
    * Chrome Canary 60 – behind the Experimental Web Platform flag in chrome:flags.
    * Firefox 54 – behind the dom.moduleScripts.enabled setting in about:config.
    * Edge 15 – behind the Experimental JavaScript Features setting in about:flags.:
*/

gulp.task("lint", shell.task([
      "jshint *.js",
      "html-lint *.html",
      "csslint *.css"
]));
