var level8State = {
  create: function() {
   game.add.image(0, 0, "sky");
   game.global.currentTime = 0;
   // creates a group to collect all the platforms
   platforms = game.add.group();
   // enable physics on the whole group
   platforms.enableBody = true;
   // add the ground
   ground = platforms.create(0, game.world.height - 64, "platform");
   // make it larger
   ground.scale.setTo(2, 2);
   // make all platforms startionary during collisions
   platforms.setAll("body.immovable", true);
   // make the player
   player = game.add.sprite(32, game.world.height - 150, "player");
   // enable physics for the player
   game.physics.arcade.enable(player);
   // set physics properties
   player.body.gravity.y = 350;
   player.body.collideWorldBounds = true;
   //create the cursor keys
   up = game.input.keyboard.addKey(Phaser.KeyCode.W);
   left = game.input.keyboard.addKey(Phaser.KeyCode.A);
   right = game.input.keyboard.addKey(Phaser.KeyCode.D);
   r = game.input.keyboard.addKey(Phaser.KeyCode.R);

 },

  update: function() {
     // physics checks
     hitPlatform = game.physics.arcade.collide(player, platforms);
     //move player
     if (left.isDown) {
       // move left with left animation
       player.body.velocity.x = -150;
     } else if (right.isDown) {
       // move right with right animation
       player.body.velocity.x = 150;
     } else {
       // stop animations, show a single frame
       player.body.velocity.x = 0;
     }
     if (r.justDown) {
       game.state.start('level1');
     }
     // jump if the up key is down and the player
     // is touching the top of a platform
     if (up.isDown && player.body.touching.down && hitPlatform) {
       player.body.velocity.y = -200;
     }
     // physic checks
     hitPlatform = game.physics.arcade.collide(player, platforms);
     }
 };
