var MenuScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function MenuScene ()
  {
    Phaser.Scene.call(this, { key: 'MenuScene', active: true });
  },

  preload: preload,
  create: create
});

function preload () {
  this.load.image('bg', '../assets/static/bg.jpg');
  this.load.image('ship', 'assets/sprites/player/p.png');
  this.load.image('otherPlayer', 'assets/sprites/player/p.png');
  this.load.image('ball', 'assets/sprites/ball/shinyball.png');
}

function create () {
  this.input.on('pointerup', function (pointer) {
    this.scene.start('MainScene');
  }, this);
}
