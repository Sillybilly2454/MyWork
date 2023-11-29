/**
 * A "win" screen for the end of the game
 */
var finalwinState = {
    create: function() {
      game.global.lives = 3;
      //Win text
      win = "Nice Job You beat the Game";
      win += "\nThank you for playing our game";
      win += "\nPART 2 COMING SOON 2022";
      txtWin = game.add.text(game.world.centerX, game.world.centerY - 200, win, {
        fill: '#ffffff'
      });
      txtWin.anchor.setTo(0.5, 0);

      //Back button
      btnBack = game.add.button(game.world.centerX, game.world.height - 200, 'button');
      btnBack.anchor.setTo(0.5, 0.5);
      btnBack.onInputDown.add(function() {
        btnBack.frame = 1;
      });
      btnBack.onInputUp.add(function() {
        game.state.start('menu');
      });
      txtBack = game.add.text(btnBack.x, btnBack.y, 'Main Menu');
      txtBack.anchor.setTo(0.5, 0.5);
      }
    };
