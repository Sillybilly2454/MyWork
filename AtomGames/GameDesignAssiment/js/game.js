var config = {
  width: 1200,
  height: 700,
  renderer: Phaser.CANVAS,
  parent: 'game-world'
};

/* Our Phaser game object */
var game = new Phaser.Game(config);

// ( KEY, STATE_NAME)
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('controls', controlsState);
game.state.add('story', storyState);
game.state.add('credits', creditsState);
game.state.add('levelSelect', levelSelectState);
game.state.add('level1', level1State);
game.state.add('level2', level2State);
game.state.add('level3', level3State);
game.state.add('level4', level4State);
game.state.add('level5', level5State);
game.state.add('level5PayMode', level8PayModeState);
game.state.add('gameover', gameoverState);
game.state.add('win', winState);
game.state.add('finalWin', finalwinState);

//Varriables
game.global = {
  score: 0,
  lives: 10,
  maxLives: 10,
  bossLives: 200,
  bossMaxLives: 200,
  ammoInGun: 30,
  ammoInBag: 30,
  clipSize: 30,
  maxAmmo: 100,
  hasGun: false,
  gunReady: true,
  isReloading: false,
  hasJetPack: false,
  jetPackFuel: 100,
  maxJetPackFuel: 100,
  level1locked: false,
  level2locked: true,
  level3locked: true,
  level4locked: true,
  level5locked: true,
  level5PayModelocked: true,
  currentLvl: 0,
};

// Go to the boot state
game.state.start('boot');
