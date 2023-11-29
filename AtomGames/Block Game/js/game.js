var game = new Phaser.Game(1000, 600, Phaser.CANVAS, 'game-world');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('levelSelect', levelSelectState);
game.state.add('level1', level1State);
game.state.add('level2', level2State);
game.state.add('level3', level3State);
game.state.add('level4', level4State);
game.state.add('level5', level5State);
game.state.add('level6', level6State);
game.state.add('level7', level7State);
game.state.add('level8', level8State);
game.state.add('tutorial', tutorialState);
game.state.add('tutorial1', tutorial1State);
game.state.add('tutorial2', tutorial2State);
game.state.add('tutorial3', tutorial3State);
game.state.add('tutorial4', tutorial4State);
game.state.add('tutorial5', tutorial5State);
game.state.add('tutorial6', tutorial6State);
game.state.add('tutorial7', tutorial7State);
game.state.add('gameover', gameoverState);
game.state.add('controls', controlsState);
game.state.add('credits', creditsState);
game.state.add('data', dataState);

// save some values for the whole game
game.global = {
  score: 0,
  holdingBlock: false,
  currentTime: 0,
  level1BestTime: 0,
  level2BestTime: 0,
  level3BestTime: 0,
  level4BestTime: 0,
  level5BestTime: 0,
  level6BestTime: 0,
  level7BestTime: 0,
  level8BestTime: 0,
};

game.state.start('boot');
