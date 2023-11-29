/*
 * The very first stage of opening the game.
 * Use this to set game wide settting (eg physics.)
 */
var bootState = {
	create: function() {
		// Start the arcade physics engine
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// Go to the load state
		game.state.start('load');
	}
};
