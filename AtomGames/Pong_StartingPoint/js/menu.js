var menuState = {
  create: function() {

    game.add.image(0, 0, "background");
    // Title text
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Pong', {
      fill: '#00ff00'
    });
    titleText.anchor.setTo(0.5, 0.5);

    // Start button
    twoPlayerstartButton = game.add.button(game.world.centerX, game.world.centerY, 'button');
    twoPlayerstartButton.anchor.setTo(0.5, 0.5);
    twoPlayerstartButton.onInputUp.add(this.twoPlayerMode);
    twoPlayerstartText = game.add.text(twoPlayerstartButton.x, twoPlayerstartButton.y, 'Two Players');
    twoPlayerstartText.anchor.setTo(0.5, 0.5);

    onePlayerstartButton = game.add.button(game.world.centerX, game.world.centerY - 50, 'button');
    onePlayerstartButton.anchor.setTo(0.5, 0.5);
    onePlayerstartButton.onInputUp.add(this.onePlayerMode);
    onePlayerstartText = game.add.text(onePlayerstartButton.x, onePlayerstartButton.y, 'One Player');
    onePlayerstartText.anchor.setTo(0.5, 0.5);

    // Controls button
    controlsButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'button');
    controlsButton.anchor.setTo(0.5, 0.5);
    controlsButton.onInputUp.add(this.showControls);
    controlsText = game.add.text(controlsButton.x, controlsButton.y, 'How to play');
    controlsText.anchor.setTo(0.5, 0.5);
  },

  twoPlayerMode: function() {
    game.state.start('twoPlayer');
    game.global.player1Score = 0;
    game.global.player2Score = 0;
  },

  onePlayerMode: function() {
    game.state.start('onePlayer');
    game.global.player1Score = 0;
    game.global.player2Score = 0;
  },

  showControls: function() {
    game.state.start('controls');
  }
};
