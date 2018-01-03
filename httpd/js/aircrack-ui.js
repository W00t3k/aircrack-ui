// Author: soliforte
// Email: soliforte@protonmail.com
// Git: github.com/soliforte
// Freeware, enjoy. If you do something really cool with it, let me know. Pull requests encouraged

(
  typeof define === "function" ? function (m) { define("plugin-aircrack-js", m); } :
  typeof exports === "object" ? function (m) { module.exports = m(); } :
  function(m){ this.aircrack = m(); }
)(function () {

  "use strict";

  var exports = {};

  // Flag we're still loading
  exports.load_complete = 0;

kismet_ui_tabpane.AddTab({
	id:    'aircrackui',
	tabTitle:    'Aircrack-NG',
  expandable: true,
	createCallback: function(div) {
    $(document).ready(function(){
$(div).append('<div id="aircrack-ui">');

$( "#aircrack-ui" ).load( "/plugin/aircrack-ui/main.html" );

    });//Close document.ready
    },//End of div
    priority: 	-800,
  });// We’re done loading
  exports.load_complete = 1;
  return exports;
});
