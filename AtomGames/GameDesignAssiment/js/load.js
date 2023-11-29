/*
 * Use this state to load all of your assets
 */
var loadState = {
  preload: function() {
    game.add.sprite(0, 0, 'preloaderBackground');
    // Some simple loading... text
    txtLoading = game.add.text(80, 150, 'loading...', {
      font: '30px Courier',
      fill: '#ffffff'
    });

    /* Add the preloadbar */
    loadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'preloaderBar');
    game.load.setPreloadSprite(loadBar);

    /* Load all the sprites */
    game.load.image("healthbar", "assets/sprites/healthbar.png");
    game.load.image("sky", "assets/sprites/sky.png");
    game.load.image("explosiveBarrel", "assets/sprites/ExplotionBarrel.png");
    game.load.image("bullet", "assets/sprites/bullet.png");
    game.load.image("coin", "assets/sprites/coin.png");
    game.load.image("gun", "assets/sprites/gun.png");
    game.load.image("ammoPickup", "assets/sprites/AmmoPickup.png");
    game.load.image("ground", "assets/sprites/ground.png");
    game.load.image("healthPickup", "assets/sprites/medkit.png");
    game.load.image("chest", "assets/sprites/chest.png");
    game.load.image("portal", "assets/sprites/Portal.png");
    game.load.image("bunker", "assets/sprites/Bunker.png");
    game.load.image("jetPack", "assets/sprites/JetPack.png");
    game.load.image("wall", "assets/sprites/wall.png");

    /* Load all the spritesheets */
    game.load.spritesheet('button', 'assets/sprites/button_blank.png', 190, 49); // Frame 0 = up, Frame 1 = down
    game.load.spritesheet("player", "assets/sprites/player.png", 32, 48);
    game.load.spritesheet("boss", "assets/sprites/boss.png", 84, 90);
    game.load.spritesheet("cyborg", "assets/sprites/cyborg.png", 32, 32);
    game.load.spritesheet("zombie", "assets/sprites/zombie.png", 32, 32);
    game.load.spritesheet("platform", "assets/sprites/platform.png", 400, 32);
    game.load.spritesheet("explotion", "assets/sprites/Explotion.png", 32, 32);
    /* Load all the sounds effects */

  },

  // Once everything is loaded, go to the menu state
  create: function() {
    game.state.start('menu');


  }
};
