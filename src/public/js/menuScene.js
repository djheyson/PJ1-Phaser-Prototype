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
  this.load.image('ship', 'assets/sprites/player/alien.png');
  this.load.image('otherPlayer', 'assets/sprites/player/alien.png');
  // this.load.image('ball', 'assets/sprites/ball/shinyball.png');
  this.load.image('ball', 'assets/sprites/ball/planet.png');
  this.load.audio('thud', ['assets/thud.mp3', 'assets/thud.ogg']);
}

function create () {
  this.socket = io();

  this.clickButton = this.add.text(20, 300, 'Start Game', { fill: '#0f0', boundsAlignH: 'center', boundsAlignV: 'middle' })
    .setInteractive()
    .on('pointerdown', () => {
      this.sound.add('thud')
      this.sound.play('thud', { volume: 0.75 })
      this.socket.emit('stateGame', { status: 'start' });
      this.scene.start('MainScene');
    })
    .on('pointerover', () => this.clickButton.setStyle({ fill: '#f00'}))
    .on('pointerout', () => this.clickButton.setStyle({ fill: '#0f0' }))
}
