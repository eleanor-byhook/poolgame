'use strict';

var config = {

  ball  : {
    ballRadius:0.4,
    linearDamping: 0.3 ,
    angularDamping: 0.3,
    restitution : 1,
    density : 1 ,
    friction : 0.1,
    mass:1
    },
  amountOfBalls:10,
  vectorDivisor:1.1,
  canvasWidth:950,
  canvasHeight:510,

  messages: {
    scratch:'You Scratched!'
  }

};

module.exports = config;
