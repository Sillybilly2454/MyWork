/**
 * A "credits" screen to reference all sources
 */
var creditsState = {
   create: function() {
		//Credits text
		credits = "Credits";


    credits1 = "Made By Mason Gourlay, William Davis, and Aiden Bright";

    txtCredits1 = game.add.text(game.world.centerX, game.world.centerY-100, credits1, {
      fill: '#ffffff'
    });
    txtCredits1.anchor.setTo(0.5, 0);

		txtCredits = game.add.text(game.world.centerX, game.world.centerY-200, credits, {
			fill: '#ffffff'
		});
		txtCredits.anchor.setTo(0.5, 0);

		//Back button
		btnBack = game.add.button(game.world.centerX, game.world.height-50, 'button');
		btnBack.anchor.setTo(0.5, 0.5);
		btnBack.onInputDown.add(function() { btnBack.frame = 1; });
    btnBack.onInputUp.add(function() { game.state.start('menu'); });
		txtBack = game.add.text(btnBack.x, btnBack.y, 'Main Menu');
		txtBack.anchor.setTo(0.5, 0.5);
   }
};
