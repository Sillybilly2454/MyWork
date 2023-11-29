/**
 * A "controls" screen to show the player how to control the game
 */
var controlsState = {
  create: function() {
    game.add.image(0, 0, "background");
    //Controls text
    controlsText = " \n W = Up Player 1";
    controlsText += " \n S = Down Player 1";
    controlsText += " \n Up Arrow = Up Player 2";
    controlsText += " \n Down Arrow = Down Player 2";
    controlsText += " \n R = Restart";
    controlsText += " \n Spacebar = Start Round";
    controls = game.add.text(game.world.centerX, game.world.centerY, controlsText, {
      fill: '#ffffff'
    });
    controls.anchor.setTo(0.5, 0.5);

    controlsTitleText = "Controls";
    controlsTitle = game.add.text(game.world.centerX, game.world.centerY - 200, controlsTitleText, {
      fill: '#00ff00'
    });
    controlsTitle.anchor.setTo(0.5, 0.5);

    //Back button
    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(this.backToMenu);
    backText = game.add.text(backButton.x, backButton.y, 'Main Menu');
    backText.anchor.setTo(0.5, 0.5);
  },

  // Take the player back to the main menu
  backToMenu: function() {
    game.state.start('menu');
  }
};
