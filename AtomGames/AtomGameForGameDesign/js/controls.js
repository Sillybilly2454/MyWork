var controlsState = {
  create: function() {
    game.add.image(0, 0, "sky");
    //Controls text
    controlsText = "How to play!";
    controlsText += " \n W = Jump";
    controlsText += " \n A = Left";
    controlsText += " \n D = Right";
    controlsText += " \n E = Shoot Fireball";
    controlsText += " \n Q = Shoot Gun";
    controlsText += " \n m = Retry";
    controls = game.add.text(game.world.centerX, game.world.centerY - 200, controlsText);
    controls.anchor.setTo(0.5, 0);

    //Back button
    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(this.backToMenu);
    backText = game.add.text(backButton.x, backButton.y, 'Back');
    backText.anchor.setTo(0.5, 0.5);
  },

  // Take the player back to the main menu
  backToMenu: function() {
    game.state.start('menu');
  }
};
