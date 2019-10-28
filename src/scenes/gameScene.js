import player from '../assets/sprites/player/player.png'
// import ball from '../assets/sprites/ball/bomb.png'
import ball from '../assets/sprites/ball/balls.png'
import soccerField from '../assets/static/soccer-field.jpg'

var GameScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function GameScene ()
  {
      Phaser.Scene.call(this, { key: 'gameScene', active: true });

      this.player = null;
      this.cursors = null;
      this.score = 0;
      this.scoreText = null;
  },

  preload: function () {
    this.load.image('soccerField', soccerField);
    this.load.spritesheet('ball', ball, { frameWidth: 17, frameHeight: 17 });
    this.load.spritesheet('player', player, { frameWidth: 60, frameHeight: 60 });
  },

  create: function () {
    this.add.image(350, 245, 'soccerField');

    var player = this.physics.add.sprite(350, 245, 'player');
    var ball = this.physics.add.image(350, 245, 'ball');
    
    this.physics.add.collider(player, ball);

    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    
    player.body.setCircle(30);

    ball.body.setCircle(8.5);
    
    ball.setBounce(1);

    this.anims.create({
        key: 'move',
        frames: [ { key: 'player', frame: 3 } ],
        frameRate: 10,
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'player', frame: 1 } ],
      frameRate: 20
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.speed = 100;
    this.player = player;
    this.ball = ball;
  },

  update: function () {
    var cursors = this.cursors;
    var player = this.player;
    var ball = this.ball;

    if (ball.body.velocity.x !== 0) {
      if (ball.body.velocity.x > 0)
        ball.setVelocityX(ball.body.velocity.x - 1)
      else
        ball.setVelocityX(ball.body.velocity.x + 1)
    }

    if (ball.body.velocity.y !== 0) {
      if (ball.body.velocity.y > 0)
        ball.setVelocityY(ball.body.velocity.y - 1)
      else
        ball.setVelocityY(ball.body.velocity.y + 1)
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-this.speed);
      player.anims.play('move', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(this.speed);
      player.anims.play('move', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown){
      player.setVelocityY(-this.speed);
      player.anims.play('move', true);
    } else if (cursors.down.isDown){
      player.setVelocityY(this.speed);
      player.anims.play('move', true);
    } else {
      player.setVelocityY(0);
    }
  }

});

export default GameScene
