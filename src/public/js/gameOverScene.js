var GameOverScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function GameOverScene ()
  {
    Phaser.Scene.call(this, { key: 'GameOverScene' });
  },

  create: create
});

function create () {
  this.add.image(400, 300, 'bg')
  this.socket = io();
  
  this.restartBtn = this.add.text(20, 300, 'Restart Game', { fill: '#0f0', boundsAlignH: 'center', boundsAlignV: 'middle' })
    .setInteractive()
    .on('pointerdown', () => {
      this.sound.add('thud')
      this.sound.play('thud', { volume: 0.75 })
      this.socket.emit('stateGame', { status: 'restart' });
      this.scene.start('MainScene');
    } )
    .on('pointerover', () => this.restartBtn.setStyle({ fill: '#f00'}) )
    .on('pointerout', () => this.restartBtn.setStyle({ fill: '#0f0' }) )
}
