var tutorial3State = {
  create: function() {
    game.add.image(0, 0, "sky");
    // create text
    fastOrbText = game.add.text(game.world.centerX, game.world.centerY, 'This is a fast orb it launhes you forward.');
    fastOrbText.anchor.setTo(0.5, 0.5);
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
    // create warp block
    warps = game.add.group();
    warps.enableBody = true;
    warp = warps.create(950, 505, "warp");
    // create fast orb
    fastOrbs = game.add.group();
    fastOrbs.enableBody = true;
    fastOrb = fastOrbs.create(500, 505, "fastOrb");

    //create the cursor keys
    up = game.input.keyboard.addKey(Phaser.KeyCode.W);
    left = game.input.keyboard.addKey(Phaser.KeyCode.A);
    right = game.input.keyboard.addKey(Phaser.KeyCode.D);
    r = game.input.keyboard.addKey(Phaser.KeyCode.R);

  },

  warp: function() {
    game.state.start('tutorial4');
  },

  fast: function() {
    if (left.isDown) {
      player.body.x = (player.body.x - 200);
    } else if (right.isDown) {
      player.body.x = (player.body.x + 200);
    } else {
      player.body.x = (player.body.x + 200);
    }
  },

  update: function() {
    // physics checks
    hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, warps, this.warp);
    game.physics.arcade.overlap(player, fastOrbs, this.fast);
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
      player.frame = 4;
    }
    if (r.justDown) {
      game.state.start('tutorial3');
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
