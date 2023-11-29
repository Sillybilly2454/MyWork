/**
 * Displays a game menu
 * Adjust as needed
 */
var level8PayModeState = {
  create: function() {

    // Add a background image to the scene

    scoreText = game.add.text(game.world.centerX - 50, game.world.centerY - 120, "Score: " + game.global.score, {
      fill: '#00ff00',
  });

    // Add a title to the scene
    txtTitle = game.add.text(game.world.centerX, game.world.centerY - 200, 'Pay Mode Boss level', {
      fill: '#00ff00',
    });
    txtTitle.anchor.setTo(0.5, 0.5);

    // Try To Pay button
    btnPay = game.add.button(game.world.centerX, game.world.centerY - 25, 'button'); // Create a button object
    btnPay.anchor.setTo(0.5, 0.5);                                                   // Change the anchor point to the center of the sprite
    btnPay.onInputDown.add(function() { btnStart.frame = 1; });                    // When the button is pressed down, change the frame
    btnPay.onInputUp.add(this.tryPayForLevel);                 // When the button is released, start 'level1'
    txtPay = game.add.text(btnPay.x, btnPay.y, '250 Coins');                  // Add some text over the top of the button
    txtPay.anchor.setTo(0.5, 0.5);

    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(function() { game.state.start('levelSelect'); });
    backText = game.add.text(backButton.x, backButton.y, 'Back');
    backText.anchor.setTo(0.5, 0.5);

},

 tryPayForLevel: function() {
    if (game.global.level5locked == false) {
      game.state.start('level5');
    } else if (game.global.score >= 250) {
      game.global.score -= 250;
      game.global.level8locked = false;
      game.state.start('level5');

    }
 },

};
