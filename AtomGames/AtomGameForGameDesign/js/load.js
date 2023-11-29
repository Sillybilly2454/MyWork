/**
 * Use this state to load all of your assets
 */
var loadState = {
   preload: function() {
      loadingLabel = game.add.text(80, 150, 'Just wait....', {
         font: '30px Courier',
         fill: '#ffffff'
      });

      // load all assets
      game.load.image("button", "assets/button.png");
      game.load.image("cloud", "assets/cloud.png");
      game.load.image("diamond", "assets/diamond.png");
      game.load.image("healthPickup", "assets/HealthPickup.png");
      game.load.image("healthbar", "assets/healthbar.png");
      game.load.image("platform", "assets/platform.png");
      game.load.image("sky", "assets/sky.png");
      game.load.image("star", "assets/star.png");
      game.load.image("mushroomPickup", "assets/MushroomPickup.png");
      game.load.image("fireball", "assets/Fireball.png");
      game.load.image("gun", "assets/Gun.png");
      game.load.image("bullet", "assets/Bullet.png");
      game.load.image("ammoPickup", "assets/AmmoPickup.png");
      game.load.image("blood", "assets/Blood.png");
      game.load.spritesheet("ghost", "assets/Ghost.png");
      game.load.spritesheet("player", "assets/player.png", 32, 48);
      game.load.spritesheet("baddie", "assets/baddie.png", 32, 32);
      game.load.audio("collectCoin", "assets/CoinCollect.wav");
      game.load.audio("collectHealth", "assets/HealthPickup.wav");
      game.load.audio("collectMushroom", "assets/Mushroomcollect.mp3");
      game.load.audio("damage", "assets/TakingDamage.mp3");
      game.load.audio("shootGun", "assets/GunShoot.mp3");
   },

   create: function()
   {
      game.state.start('menu');
      collectCoinSound = game.add.audio("collectCoin");
      collectHealthSound = game.add.audio("collectHealth");
      collectMushroomSound = game.add.audio("collectMushroom");
      takingDamageSound = game.add.audio("damage");
      shootGunSound = game.add.audio("shootGun");
   }

};
