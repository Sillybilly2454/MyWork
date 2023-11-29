var twoPlayerState = {
  create: function() {
    game.add.image(0, 0, "background");

		game.global.isRoundEnded = true;

    // Player1 creation & user input
    player1 = game.add.sprite(32, game.world.height - 150, "paddle");
    // enable physics for the player
    game.physics.arcade.enable(player1);

    player1.body.collideWorldBounds = true;

    up1 = game.input.keyboard.addKey(Phaser.KeyCode.W);
    down1 = game.input.keyboard.addKey(Phaser.KeyCode.S);
    up2 = game.input.keyboard.addKey(Phaser.KeyCode.UP);
    down2 = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    r = game.input.keyboard.addKey(Phaser.KeyCode.R);
		spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // Player2 creation & user input

    player2 = game.add.sprite(758, game.world.height - 150, "paddle");
    // enable physics for the player
    game.physics.arcade.enable(player2);

    player2.body.collideWorldBounds = true;
    player2.scale.setTo(-1);
    // Ball creation
    balls = game.add.group();
    balls.enableBody = true;
    ball = balls.create(game.world.centerX, game.world.centerY, "ball");
    ball.body.collideWorldBounds = true;
    ball.body.bounce.y = 1;
    ball.body.bounce.x = 1;

    // create goals group
    goals = game.add.group();
    goals.enableBody = true;
    // create left goal
    leftgoal = goals.create(game.world.centerX - 410, game.world.centerY - 300, "goal");
    // create right goal
    rightgoal = goals.create(game.world.centerX + 390, game.world.centerY - 300, "goal");

    // Score display creation
    scoreText = game.add.text(game.world.centerX - 10, game.world.centerY - 250, game.global.player1Score + " : " + game.global.player2Score, {
      fill: '#ffffff'
    });
  },

  update: function() {
    // Collision detection (collide & overlap)
    game.physics.arcade.overlap(player1, ball, this.launch1);
    game.physics.arcade.overlap(player2, ball, this.launch2);
    game.physics.arcade.overlap(rightgoal, ball, this.player1scored);
    game.physics.arcade.overlap(leftgoal, ball, this.player2scored);

    // Player1 input & movement
    if (up1.isDown) {
      // move left with left animation
      player1.body.velocity.y = -300;
    } else if (down1.isDown) {
      // move right with right animation
      player1.body.velocity.y = 300;
    } else {
      player1.body.velocity.y = 0;
    }

    // Player2 input & movement
    if (up2.isDown) {
      // move left with left animation
      player2.body.velocity.y = -300;
    } else if (down2.isDown) {
      // move right with right animation
      player2.body.velocity.y = 300;
    } else {
      player2.body.velocity.y = 0;
    }

    if (r.isDown) {
      game.state.start("twoPlayer");
      game.global.player1Score = 0;
      game.global.player2Score = 0;
    }

    if (spacebar.isDown) {
      if (game.global.isRoundEnded == true) {
				this.startNewRound();
      }
    }

  },

  // Launch the ball
  launch1: function() {
    // Give the ball a random x and y velocity
    ball.body.velocity.y = game.rnd.integerInRange(-200, 200);
    ball.body.velocity.x = game.rnd.integerInRange(200, 100);
    bounceSound.play();
  },

  launch2: function() {
    // Give the ball a random x and y velocity
    ball.body.velocity.y = game.rnd.integerInRange(-200, 200) * 2;
    ball.body.velocity.x = game.rnd.integerInRange(-200, -100) * 2;
    bounceSound.play();
  },

  player1scored: function() {
    playSound.play();
    game.global.player1Score += 1;
    twoPlayerState.newRound();
  },

  player2scored: function() {
    playSound.play();
    game.global.player2Score += 1;
    twoPlayerState.newRound();
  },

  newRound: function() {
    if (game.global.player1Score == 10) {
      game.global.winner = 1;
      twoPlayerState.gameover();
    } else if (game.global.player2Score == 10) {
      game.global.winner = 2;
      twoPlayerState.gameover();
    } else {
      ball.destroy();
      scoreText.text = game.global.player1Score + " : " + game.global.player2Score;

      ball = balls.create(game.world.centerX, game.world.centerY, "ball");
      ball.body.collideWorldBounds = true;
      ball.body.bounce.y = 1;
      ball.body.bounce.x = 1;

      game.global.isRoundEnded = true;
    }
  },

  startNewRound: function() {
		game.global.isRoundEnded = false;
    ball.body.velocity.y = game.rnd.integerInRange(-200, 200);
    ball.body.velocity.x = game.rnd.integerInRange(-200, 200) * 3;
  },

  // Go to the gameover state
  gameover: function() {
    game.state.start('gameover');
  }
};
