var MainScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function MainScene ()
  {
    Phaser.Scene.call(this, { key: 'MainScene' });
    this.cursors = null;
  },

  create: create,
  update: update
});

function create() {
  this.add.image(400, 300, 'bg')

  var self = this;
  this.socket = io();
  this.players = this.add.group();

  this.ball = this.add.image(400, 300, 'ball');

  this.greenScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#00FF00' });
  this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship');
      } else {
        displayPlayers(self, players[id], 'otherPlayer');
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'otherPlayer');
  });

  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  this.socket.on('playerUpdates', function (players) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setPosition(players[id].x, players[id].y);
        }
      });
    });
  });

  this.socket.on('updateScore', function (scores) {
    if (scores.green <= 5000 && scores.red <= 5000) {
      self.greenScoreText.setText('Green: ' + scores.green);
      self.redScoreText.setText('Red: ' + scores.red);
    } else {
      if (self.scene.key === 'MainScene') {
        self.socket.emit('stateGame', { status: 'gameover' });
        self.scene.switch('GameOverScene');
      }
    }
  });

  this.socket.on('ballLocation', function (ballLocation) {
    if (!self.ball) {
      self.ball = self.add.image(ballLocation.x, ballLocation.y, 'ball');
    } else {
      self.ball.setPosition(ballLocation.x, ballLocation.y);
    }
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
  this.downKeyPressed = false;
  this.spaceKeyPressed = false;
}

function update() {
  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;
  const down = this.downKeyPressed;
  const space = this.spaceKeyPressed;

  if (this.cursors.space.isDown) {
    this.spaceKeyPressed = true;
  } else {
    this.spaceKeyPressed = false;
  }

  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
  } else if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
  } else {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
  }

  if (this.cursors.up.isDown) {
    this.upKeyPressed = true;
  } else if (this.cursors.down.isDown) {
    this.downKeyPressed = true;
  } else {
    this.downKeyPressed = false;
    this.upKeyPressed = false;
  }

  if (left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed || down !== this.downKeyPressed || space !== this.spaceKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed, down: this.downKeyPressed, space: this.spaceKeyPressed });
  }
}

function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5);
  if (playerInfo.team === 'green') player.setTint(0x00ff00);
  else player.setTint(0xff0000);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}
