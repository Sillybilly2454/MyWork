/**
 * A "game over" screen for the end of the game
 */
var gameoverState = {
  create: function() {
    game.global.lives = game.global.maxLives;
    //Gameover text
    lost = "You Died";
    txtLost = game.add.text(game.world.centerX, game.world.centerY - 200, lost, {
      fill: '#ffffff'
    });
    txtLost.anchor.setTo(0.5, 0);

    //Back button
    btnBack = game.add.button(game.world.centerX + 150, game.world.height - 200, 'button');
    btnBack.anchor.setTo(0.5, 0.5);
    btnBack.onInputDown.add(function() {
      btnBack.frame = 1;
    });
    btnBack.onInputUp.add(function() {
      game.state.start('menu');
    });
    txtBack = game.add.text(btnBack.x, btnBack.y, 'Main Menu');
    txtBack.anchor.setTo(0.5, 0.5);
    //Retry button
    btnRetry = game.add.button(game.world.centerX - 150, game.world.height - 200, 'button');
    btnRetry.anchor.setTo(0.5, 0.5);
    btnRetry.onInputDown.add(function() {
      btnBack.frame = 1;
    });
    btnRetry.onInputUp.add(function() {
      if (game.global.currentLvl == 1) {
        game.state.start('level1');
      } else if (game.global.currentLvl == 2) {
        game.state.start('level2');
      } else if (game.global.currentLvl == 3) {
        game.state.start('level3');
      } else if (game.global.currentLvl == 4) {
        game.state.start('level4');
      } else if (game.global.currentLvl == 5) {
        game.state.start('level5');
      } else {
        game.state.start('menu');
      }
    });
    txtRetry = game.add.text(btnRetry.x, btnRetry.y, 'Retry');
    txtRetry.anchor.setTo(0.5, 0.5);
  }
};
