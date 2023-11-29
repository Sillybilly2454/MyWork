var menuState = {
  create: function() {
    game.add.image(0, 0, "sky");
    // Make title
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Block Game');
    titleText.anchor.setTo(0.5, 0.5);

    // Start button
    startButton = game.add.button(game.world.centerX, game.world.centerY - 50, 'button');
    startButton.anchor.setTo(0.5, 0.5);
    startButton.onInputUp.add(this.startGame);
    startText = game.add.text(startButton.x, startButton.y, 'Levels');
    startText.anchor.setTo(0.5, 0.5);

    // tutorial
    tutorialButton = game.add.button(game.world.centerX, game.world.centerY, 'button');
    tutorialButton.anchor.setTo(0.5, 0.5);
    tutorialButton.onInputUp.add(this.tutorial);
    tutorialText = game.add.text(tutorialButton.x, tutorialButton.y, 'Tutorial');
    tutorialText.anchor.setTo(0.5, 0.5);

    // Controls button
    controlsButton = game.add.button(game.world.centerX, game.world.centerY + 50, 'button');
    controlsButton.anchor.setTo(0.5, 0.5);
    controlsButton.onInputUp.add(this.showControls);
    controlsText = game.add.text(controlsButton.x, controlsButton.y, 'Controls');
    controlsText.anchor.setTo(0.5, 0.5);

    // Credits button
    creditsButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'button');
    creditsButton.anchor.setTo(0.5, 0.5);
    creditsButton.onInputUp.add(this.showCredits);
    creditsText = game.add.text(creditsButton.x, creditsButton.y, 'Credits');
    creditsText.anchor.setTo(0.5, 0.5);

    dataButton = game.add.button(game.world.centerX, game.world.centerY + 150, 'button');
    dataButton.anchor.setTo(0.5, 0.5);
    dataButton.onInputUp.add(this.data);
    dataText = game.add.text(dataButton.x, dataButton.y, 'Load/Save Data');
    dataText.anchor.setTo(0.5, 0.5);
  },

  showControls: function() {
    game.state.start('controls');
  },

  showCredits: function() {
    game.state.start('credits');
  },

  tutorial: function() {
    game.state.start('tutorial');
  },

  startGame: function() {
    game.global.score = 0;
    game.global.holdingBlock = false;
    game.state.start("levelSelect");
  },

  data: function() {
    game.state.start('data');
  },
};
