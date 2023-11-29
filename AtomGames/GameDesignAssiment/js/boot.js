/*
 * The very first stage of opening the game.
 * Use this to set game wide settings (eg scale and physics.)
 */
var bootState = {
	init: function() {
		if (game.device.desktop) {
			//  If you have any desktop specific settings, they can go in here

		} else {
			//  Same goes for mobile settings.
			//  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setMinMax(480, 260, 1024, 768);
			game.scale.forceLandscape = true;
			game.scale.pageAlignHorizontally = true;
		}
	},

	preload: function() {
		//  Here we load the assets required for our preloader (in this case a background and a loading bar)
		game.load.image('preloaderBackground', 'assets/sprites/preloader_background.png');
    game.load.image('preloaderBar', 'assets/sprites/preloader_bar.png');
	},

	create: function() {
		// Start the arcade physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Go to the load state
		game.state.start('load');
	}
};
