var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  scale: {
      width: 800,
      height: 600
  },
  scene: [ MenuScene, MainScene ]
};

var game = new Phaser.Game(config);