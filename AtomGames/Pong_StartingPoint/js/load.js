/*
 * Use this state to load all of your assets
 */
var loadState = {
	preload: function() {

		loadingLabel = game.add.text(80, 150, 'loading...', {
			font: '30px Courier',
			fill: '#ffffff'
		});

		game.load.image('background', 'assets/sprites/background.png');
    game.load.image('button', 'assets/sprites/button.png');
		game.load.image('paddle', 'assets/sprites/paddle.png');
		game.load.image('ball', 'assets/sprites/ball.png');
		game.load.image('goal', 'assets/sprites/goal.png');
		game.load.audio('bounce', 'assets/audio/Bounce.wav');
		game.load.audio('play', 'assets/audio/Play.wav');
		game.load.audio('win', 'assets/audio/Win.wav');
	},

	create: function() {
		game.state.start('menu');
		bounceSound = game.add.audio("bounce");
		playSound = game.add.audio("play");
		winSound = game.add.audio("win");
	}
};
