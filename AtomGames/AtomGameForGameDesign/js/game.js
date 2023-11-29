var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-world');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level1', level1State);
game.state.add('level2', level2State);
//game.state.add('level3', level3State);
game.state.add('gameover', gameoverState);
game.state.add('controls', controlsState);
game.state.add('credits', creditsState);
game.state.add('howToPlay', howtoplayState);

// save some values for the whole game
game.global = {
  score: 0,
  lives: 3,
  maxLives: 3,
  powerUp: false,
  baddiePowerUp: false,
  currentAmmo: 15,
  maxAmmo: 15,
  hasGun: false,
};

game.state.start('boot');
