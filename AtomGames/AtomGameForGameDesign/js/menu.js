var menuState = {
  create: function() {
    game.add.image(0, 0, "sky");
    // Make title
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Best game ever made');
    titleText.anchor.setTo(0.5, 0.5);

    // Start button
    startButton = game.add.button(game.world.centerX, game.world.centerY - 50, 'button');
    startButton.anchor.setTo(0.5, 0.5);
    startButton.onInputUp.add(this.startGame);
    startText = game.add.text(startButton.x, startButton.y, 'Start');
    startText.anchor.setTo(0.5, 0.5);

    // Controls button
    controlsButton = game.add.button(game.world.centerX, game.world.centerY, 'button');
    controlsButton.anchor.setTo(0.5, 0.5);
    controlsButton.onInputUp.add(this.showControls);
    controlsText = game.add.text(controlsButton.x, controlsButton.y, 'Controls');
    controlsText.anchor.setTo(0.5, 0.5);

    // how to play button
    howToPlayButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'button');
    howToPlayButton.anchor.setTo(0.5, 0.5);
    howToPlayButton.onInputUp.add(this.showHowToPlay);
    howToPlayText = game.add.text(howToPlayButton.x, howToPlayButton.y, 'How To Play');
    howToPlayText.anchor.setTo(0.5, 0.5);

    // Credits button
    creditsButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'button');
    creditsButton.anchor.setTo(0.5, 0.5);
    creditsButton.onInputUp.add(this.showCredits);
    creditsText = game.add.text(creditsButton.x, creditsButton.y, 'Credits');
    creditsText.anchor.setTo(0.5, 0.5);
  },

  showControls: function() {
    game.state.start('controls');
  },

  showCredits: function() {
    game.state.start('credits');
  },

  showHowToPlay: function() {
    game.state.start('howToPlay');
  },

  startGame: function() {
    game.global.score = 0;
    game.global.baddiePowerUp = 0;
    game.global.powerUp = 0;
    game.global.lives = game.global.maxLives;
    game.global.currentAmmo = 15;
    game.global.maxAmmo = 15;
    game.global.hasGun = false;
    game.state.start("level2");
  }
};
