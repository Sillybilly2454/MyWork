var creditsState = {
  create: function() {
    game.add.image(0, 0, "sky");
    //Credits text
    creditsText = "Code by Mason Gourlay.";
    credits = game.add.text(game.world.centerX, game.world.centerY - 200, creditsText);
    credits.anchor.setTo(0.5, 0);

    aidenText = "Level desgin by Aiden Bright";
    aiden = game.add.text(game.world.centerX, game.world.centerY - 150, aidenText);
    aiden.anchor.setTo(0.5, 0);

    williamText = "Sprites by William Davis.";
    william = game.add.text(game.world.centerX, game.world.centerY - 100, williamText);
    william.anchor.setTo(0.5, 0);

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
