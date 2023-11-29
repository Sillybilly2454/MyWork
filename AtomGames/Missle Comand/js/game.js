var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-world');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level', levelState);
game.state.add('gameover', gameoverState);

game.global = {
  score: 0,
  lives: 6,
  wave: 0
};

game.state.start('boot');
