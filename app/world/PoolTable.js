'use strict';

var BX = require('../util/Box2DShortCuts') ;
var config = require('../config') ;

var PoolTable = function(world) {

  this.world = world ;

  this.fixDef = new BX.b2FixtureDef;
  this.bodyDef = new BX.b2BodyDef;

  this.fixDef.density = 1.0;
  this.fixDef.friction = 0.1;
  this.fixDef.restitution = 1;

  this.bodyDef.type = BX.b2Body.b2_staticBody;
  this.fixDef.shape = new BX.b2PolygonShape;
  this.fixDef.userData = {name : 'rail', rail:'lower'} ;
  this.fixDef.shape.SetAsBox(13.0, 1);
  this.bodyDef.position.Set(15.85, 16.8);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
  this.fixDef.userData = {name : 'rail', rail:'upper'} ;
  this.bodyDef.position.Set(15.85, 1.2);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
  this.fixDef.shape.SetAsBox(1, 6.2);
  this.bodyDef.position.Set(1.1, 9);
  this.fixDef.userData = {name : 'rail', rail:'left'} ;
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
  this.bodyDef.position.Set(30.5, 9);
  this.fixDef.userData = {name : 'rail', rail:'right'} ;
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.fixDef.shape = new BX.b2CircleShape(0.8);
  this.fixDef.userData = {name : 'pocket'} ;

  this.bodyDef.position.Set(1.9, 1.9);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.bodyDef.position.Set(15.8, 1.9);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.bodyDef.position.Set(1.9, 16.12);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.bodyDef.position.Set(29.8, 1.9);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.bodyDef.position.Set(15.8, 16.12);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

  this.bodyDef.position.Set(29.8, 16.12);
  this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

} ;

var ptproto = PoolTable.prototype ;

ptproto.update = function() {

} ;

module.exports = PoolTable ;
