var gameoverState = {
  create: function() {
    game.add.image(0, 0, "background");

    titleText = game.add.text(game.world.centerX, game.world.centerY - 100, 'Null Player Won', {
      fill: '#00ff00'
    });
    titleText.anchor.setTo(0.5, 0.5);

    if (game.global.winner == 1) {
      // set the text to the winner
      titleText.text = 'Player 1 Is The Winner';
    } else if (game.global.winner == 2) {
      titleText.text = 'Player 2 Is The Winner';
    }

    scoreText = game.add.text(game.world.centerX - 10, game.world.centerY, game.global.player1Score + " : " + game.global.player2Score, {
      fill: '#ffffff'
    });
    scoreText.anchor.setTo(0.5, 0.5);
    //Gameover text

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
