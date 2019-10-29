const players = {};

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

function preload() {
  this.load.image('ship', 'assets/sprites/player/p.png');
  this.load.image('ball', 'assets/sprites/ball/shinyball.png');
}

function create() {
  const self = this;
  this.players = this.physics.add.group();

  this.scores = {
    blue: 0,
    red: 0
  };

  this.ball = this.physics.add.image(400, 300, 'ball');
  this.physics.add.collider(this.players);
  this.ball.setCollideWorldBounds(true);  
  this.ball.setBounce(1);
  this.ball.body.setCircle(16);

  this.physics.add.collider(this.players, this.ball, function (ball, player) {
    if (players[player.playerId].team === 'red') {
      self.scores.red += 10;
    } else {
      self.scores.blue += 10;
    }
    io.emit('updateScore', self.scores);
  });

  io.on('connection', function (socket) {
    console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue', //choose team
      input: {
        left: false,
        right: false,
        up: false,
        down: false
      }
    };
    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    // send the ball object to the new player
    socket.emit('ballLocation', { x: self.ball.x, y: self.ball.y });
    // send the current scores
    socket.emit('updateScore', self.scores);

    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });
  });
}

function update() {
  if (this.ball.body.velocity.x !== 0) {
    if (this.ball.body.velocity.x > 0)
      this.ball.setVelocityX(this.ball.body.velocity.x - 1)
    else
      this.ball.setVelocityX(this.ball.body.velocity.x + 1)
  }

  if (this.ball.body.velocity.y !== 0) {
    if (this.ball.body.velocity.y > 0)
      this.ball.setVelocityY(this.ball.body.velocity.y - 1)
    else
      this.ball.setVelocityY(this.ball.body.velocity.y + 1)
  }

  io.emit('ballLocation', { x: this.ball.x, y: this.ball.y });

  this.players.getChildren().forEach((player) => {
    const input = players[player.playerId].input;

    if (input.left) {
      player.setVelocityX(-100);
    } else if (input.right) {
      player.setVelocityX(100);
    } else {
      player.setVelocityX(0);
    }
  
    if (input.up) {
      player.setVelocityY(-100);
    } else if (input.down) {
      player.setVelocityY(100);
    }else {
      player.setVelocityY(0);
    }

    players[player.playerId].x = player.x;
    players[player.playerId].y = player.y;
  });
  this.physics.world.wrap(this.players, 5);
  io.emit('playerUpdates', players);
}

function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
    }
  });
}

function addPlayer(self, playerInfo) {
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5);
  player.body.setCircle(20);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}

const game = new Phaser.Game(config);
window.gameLoaded();
