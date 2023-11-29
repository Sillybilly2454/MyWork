/**
 * A "story" screen to give some background to the game
 */
var storyState = {
   create: function() {
      //Story text
	  story = " The game will be set in 3047 and robots have taken";
    story += "\n over the world and you are one of the last human alive.";
    story += "\n So you have been given the chance to save the world by";
    story += "\n taking out their main command ship and termanating all";
    story += "\n robots in the vicinity of the milky way.";

	  txtStory = game.add.text(game.world.centerX, game.world.centerY - 200, story, {
		fill: '#ffffff'
  });
	  txtStory.anchor.setTo(0.5, 0);

      //Back button
      btnBack = game.add.button(game.world.centerX,game.world.height-50,'button');
      btnBack.anchor.setTo(0.5, 0.5);
      btnBack.onInputDown.add(function() { btnBack.frame = 1; });
      btnBack.onInputUp.add(function() { game.state.start('menu'); });
      txtBack = game.add.text(btnBack.x, btnBack.y, 'Main Menu');
      txtBack.anchor.setTo(0.5,0.5);
   }
};
