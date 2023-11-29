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
      game.load.image("platform", "assets/platform.png");
      game.load.image("sky", "assets/sky.png");
      game.load.image("spike", "assets/spike.png");
      game.load.image("warp", "assets/Warp.png");
      game.load.image("jumpBoost", "assets/JumpBoost.png");
      game.load.image("fastOrb", "assets/FastOrb.png");
      game.load.image("teleportOrb", "assets/TeleportOrb.png");
      game.load.image("moveableBlock", "assets/MoveableBlock.png");
      game.load.image("antiGravityOrb", "assets/AntiGravityOrb.png");
      game.load.spritesheet("player", "assets/player.png", 32, 32);
   },

   create: function()
   {
      game.state.start('menu');
   }

};
