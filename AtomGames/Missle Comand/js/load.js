var loadState = {
  preload: function() {
    loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

    /* Some values might need to be adjusted */
    game.load.image('bg', 'assets/background.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.spritesheet('city', 'assets/cities.png', 64, 64);
    game.load.spritesheet('meteor', 'assets/asteroids.png', 48, 48);
    game.load.image('tower', 'assets/tower.png');
    game.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
    game.load.spritesheet('missile', 'assets/missile.png', 32, 32);
    game.load.image('button', 'assets/button.png');
    game.load.audio('point', 'assets/point.mp3');
    game.load.audio('win', 'assets/win.mp3');
    game.load.audio('loss', 'assets/loss.mp3');
  },

  create: function() {
    game.state.start('menu');
  }

};
