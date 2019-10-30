var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  scale: {
      width: 800,
      height: 600
  },
  scene: [ MenuScene, MainScene, GameOverScene ]
};

var game = new Phaser.Game(config);