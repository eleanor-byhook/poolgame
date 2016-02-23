'use strict' ;

var ScoreBoard = function () {

  this.message = document.getElementById('message') ;

} ;

var sbproto = ScoreBoard.prototype ;

sbproto.changeMessage = function(message) {

  this.message.innerHTML = message ;

} ;

module.exports = ScoreBoard ;
