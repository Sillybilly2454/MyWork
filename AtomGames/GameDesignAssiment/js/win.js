/**
 * A "win" screen for the end of the game
 */
var winState = {
    create: function() {
      //Win text
      win = "Nice Job You beat the level";
      txtWin = game.add.text(game.world.centerX, game.world.centerY - 200, win, {
        fill: '#ffffff'
      });
      txtWin.anchor.setTo(0.5, 0);

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
      //Next Level Button
      btnNextLvl = game.add.button(game.world.centerX - 150, game.world.height - 200, 'button');
      btnNextLvl.anchor.setTo(0.5, 0.5);
      btnNextLvl.onInputDown.add(function() {
        btnBack.frame = 1;
      });
      btnNextLvl.onInputUp.add(function() {
          if (game.global.currentLvl == 1) {
            game.state.start('level2');
          } else if (game.global.currentLvl == 2) {
            game.state.start('level3');
          } else if (game.global.currentLvl == 3) {
            game.state.start('level4');
          } else if (game.global.currentLvl == 4) {
            game.state.start('level5PayMode');
          } else if (game.global.currentLvl == 5) {
            game.state.start('finalWin');
          } else {
            game.state.start('menu');
          }
        });
        txtNextLvl = game.add.text(btnNextLvl.x, btnNextLvl.y, 'Next Level');
        txtNextLvl.anchor.setTo(0.5, 0.5);
      }
    };
