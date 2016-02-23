'use strict';

var BX = require('../util/Box2DShortCuts');
var config = require('../config') ;
var PoolBalls = require('./PoolBalls') ;
var PoolTable = require('./PoolTable') ;
var ScoreBoard = require('../scoreboard/Scoreboard') ;
var canvas = document.getElementById("canvas");
var mobileOffset = 1;

//adjust velocity calculation for mobile
if(navigator.appVersion.indexOf("Mobile") >= 0) {
  mobileOffset = 0.7;
  var elem = document.getElementsByTagName("myvideo");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

if(window.DeviceOrientationEvent) {
  document.addEventListener("orientationchange", function (e) {
    switch (window.orientation) {
      case -90:
      case 90:
        break;
      default:
        console.log('rotate your phone to landscape mode!');
    }
  });
}

var MainWorld = function () {
  this.destroyCueBall = false ;

  this.world = new BX.b2World(new BX.b2Vec2(0, 0), true) ;
  this.context = document.getElementById("canvas").getContext("2d");

  this.poolTable = new PoolTable(this.world) ;
  this.poolBalls = new PoolBalls(this.world, this.context) ;
  this.scoreboard = new ScoreBoard() ;

  //setup debug draw
  var debugDraw = new BX.b2DebugDraw();
  debugDraw.SetSprite(canvas.getContext("2d"));
  debugDraw.SetDrawScale(30.0);
  debugDraw.SetFillAlpha(0.5);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(BX.b2DebugDraw.e_shapeBit | BX.b2DebugDraw.e_jointBit);
  this.world.SetDebugDraw(debugDraw);

  window.setInterval(this.update.bind(this), 1000 / 60);
  canvas.addEventListener('touchstart', this.touchStart.bind(this));
  canvas.addEventListener('touchend', this.onClickHandler.bind(this));
  canvas.addEventListener('mousedown', this.onClickHandler.bind(this));


} ;

var mwproto = MainWorld.prototype ;

mwproto.update = function () {

  this.world.Step(
    1 / 60   //frame-rate
    ,  10       //velocity iterations
    ,  10       //position iterations
  );

  for(var i in this.destroyQueue) {

    this.poolBalls.destroyBall(this.destroyQueue[i]) ;
    this.world.DestroyBody(this.destroyQueue[i]) ;

  }

  this.destroyQueue=[] ;

  if(this.destroyCueBall) {
    this.poolBalls.destroyCueBall() ;
    this.scoreboard.changeMessage(config.messages.scratch) ;
    this.destroyCueBall = false ;
  }

  this.world.DrawDebugData();
  this.world.ClearForces();
  this.poolBalls.update() ;
  //this.context.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

} ;

mwproto.getOffRail = function(ball, rail) {

  var currentVelocity = ball.GetLinearVelocity() ;
  var newVelocity ;

  switch(rail) {
    case 'upper' :
          newVelocity = new BX.b2Vec2(0,(currentVelocity.y*-1))  ;
          break ;
    case 'lower' :
          newVelocity = new BX.b2Vec2(0,(currentVelocity.y*-1))  ;
          break ;
    case 'left' :
          newVelocity = new BX.b2Vec2((currentVelocity.x*-1),0)  ;
          break ;
    case 'right' :
          newVelocity = new BX.b2Vec2((currentVelocity.x*-1),0)  ;
          break ;
  }

  console.log(currentVelocity) ;
  //ball.SetLinearVelocity(newVelocity) ;
} ;

mwproto.touchStart = function (e) {
  canvas.style.backgroundColor="green";
  e.preventDefault();
  window.startX = e.changedTouches[0].pageX / 30;
  window.startY = e.changedTouches[0].pageY / 30;
};

mwproto.onClickHandler = function(e) {
  e.preventDefault();

  var balls = this.poolBalls.balls;
  console.table(balls);
  var cueBall = this.poolBalls.cueBall;
  var endX;
  var endY;
  var newVelocity;
  console.log(e);

  if (e.type === 'touchend') {
    console.log(e.type);
    canvas.style.backgroundColor = "yellow";

    if (e.type === 'touchend') {
      endX = (e.changedTouches[0].pageX ) / 30;
      endY = (e.changedTouches[0].pageY ) / 30;
    }
    newVelocity = {
      x: (endX - window.startX) * 3, ///config.vectorDivisor, //increase ball speed
      y: (endY - window.startY) * 3///config.vectorDivisor
    };

  } else {
    canvas.style.backgroundColor = "blue";
    endX = (e.clientX - cueBall.GetPosition().x ) / 30; //converts to meters for box2d
    endY = (e.clientY - cueBall.GetPosition().y ) / 30;
    newVelocity = {
      x: (endX - cueBall.GetPosition().x * mobileOffset), ///config.vectorDivisor, //increase ball speed
      y: (endY - cueBall.GetPosition().y * mobileOffset) ///config.vectorDivisor
    };
  }
  cueBall.SetAwake(true) ;
  var currentVelocity = cueBall.GetLinearVelocity();
  console.log(e);
  currentVelocity.Add(new BX.b2Vec2(newVelocity.x,newVelocity.y)) ;
  cueBall.SetLinearVelocity(currentVelocity);

} ;

BX.b2ContactListener.prototype.BeginContact = function(contact) {

  var a = contact.GetFixtureA().GetUserData();
  var b = contact.GetFixtureB().GetUserData();

  if (a.name === 'ball' && b.name === 'pocket') {

    console.log('POCKET!!!');
    window.world.destroyQueue.push(a.body);

  } else if (a.name === 'pocket' && b.name === 'ball') {

    window.world.destroyQueue.push(b.body);
    console.log('TEKCOP!!!');

  } else if (a.name==='cueball' && b.name === 'pocket') {

    window.world.destroyCueBall = true ;
    console.log("SCRATCH") ;

  } else if (a.name==='cueball' && b.name === 'cueball') {

    window.world.destroyCueBall = true
    console.log("SCRATCH") ;

  }
} ;

BX.b2ContactListener.prototype.EndContact = function(contact) {

  var a = contact.GetFixtureA().GetUserData();
  var b = contact.GetFixtureB().GetUserData();


} ;


module.exports = MainWorld ;

