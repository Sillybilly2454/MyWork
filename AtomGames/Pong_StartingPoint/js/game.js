var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-world');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('controls', controlsState);
game.state.add('twoPlayer', twoPlayerState);
game.state.add('onePlayer', onePlayerState);
game.state.add('gameover', gameoverState);

game.global = {
	player1Score: 0,
  player2Score: 0,
	winner: 0,
	isRoundEnded: true,
};

// Go to the boot state
game.state.start('boot');
