var creditsState = {
  create: function() {
    game.add.image(0, 0, "sky");
    //Credits text
    creditsText = "Made by Mason Gourlay";
    credits = game.add.text(game.world.centerX, game.world.centerY - 200, creditsText);
    credits.anchor.setTo(0.5, 0);

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
