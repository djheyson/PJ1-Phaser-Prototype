import Phaser from "phaser";
import GameScene from './scenes/gameScene'

var config = {
  type: Phaser.AUTO,
  scale: {
      // mode: Phaser.Scale.FIT,
      parent: 'phaser-project',
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 700,
      height: 490
  },
  physics: {
      default: 'arcade',
      arcade: {
          // gravity: { y: 300 },
          debug: false
      }
  },
  scene: GameScene
};

const game = new Phaser.Game(config);
