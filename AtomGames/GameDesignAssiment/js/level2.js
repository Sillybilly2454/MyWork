var level2State = {
  /* Run once as the state starts */
  create: function() {
    game.add.image(0, 0, "sky");

    game.global.currentLvl = 2;
    // creates a group to collect all the platforms
    platforms = game.add.group();
    // enable physics on the whole group
    platforms.enableBody = true;
    // add the ground
    ground = platforms.create(0, game.world.height - 64, "ground");
    ground.scale.setTo(2, 2);
    ground.width = game.world.width;
    // make Ledges
    platform1 = platforms.create(650, 525, "platform");
    platform1.width = 250;

    endPlatform = platforms.create(-200, 300, "platform");

    platform2 = platforms.create(500, 425, "platform");
    platform2.width = 150;

    platform3 = platforms.create(700, 325, "platform");
    platform3.width = 125;

    platform4 = platforms.create(600, 150, "platform");
    platform4.width = 150;

    platform5 = platforms.create(800, 210, "platform");
    platform5.width = 120;

    platform7 = platforms.create(300, 200, "platform");
    platform7.width = 200;

    platform8 = platforms.create(1000, 150, "platform");
    platform8.width = 200;



    // make all platforms startionary during collisions
    platforms.setAll("body.immovable", true);


    // make the player
    player = game.add.sprite(32, game.world.height - 150, "player");
    // enable physics for the player
    game.physics.arcade.enable(player);
    // set physics properties
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    healthBar = game.add.image(game.world.width - 20, 20, "healthbar");
    healthBar.anchor.setTo(1, 0);
    healthBar.width = game.global.lives / game.global.maxLives * 200;

    //create the cursor keys
    up = game.input.keyboard.addKey(Phaser.KeyCode.W);
    left = game.input.keyboard.addKey(Phaser.KeyCode.A);
    right = game.input.keyboard.addKey(Phaser.KeyCode.D);
    r = game.input.keyboard.addKey(Phaser.KeyCode.R);
    v = game.input.keyboard.addKey(Phaser.KeyCode.V);
    e = game.input.keyboard.addKey(Phaser.KeyCode.E);
    spaceBar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // create the cyborgs
    cyborgs = game.add.group();
    cyborgs.enableBody = true;
    cyborg = cyborgs.create(350, 160, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(425, 160, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(1050, 100, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(750, 600, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(750, 290, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(650, 100, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);

    cyborg = cyborgs.create(550, 390, "zombie");
    cyborg.health = 3;
    game.physics.arcade.enable(cyborg);
    cyborg.body.gravity.y = 300;
    cyborg.body.bounce.y = 0.2;
    cyborg.body.collideWorldBounds = true;
    // animate the cyborg
    cyborg.animations.add('left', [0, 1], 10, true);
    cyborg.animations.add('right', [2, 3], 10, true);
    cyborg.animations.add('stop', [1], 10, true);





    // add a the score text block to the screen
    scoreText = game.add.text(16, 16, "Score: " + game.global.score, {});

    if (game.global.hasGun == true) {
      ammoText = game.add.text(16, 50, "Ammo: " + game.global.ammoInGun + "/" + game.global.ammoInBag, {});
    }

    // Sound creation

    // Background creation

    // Level creation

    // Player creation

    // Other creation

    // UI creation

    //Weapon
    weapon = game.add.weapon(100, 'bullet'); // create a weapon system
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS; // destroyed when off-screen
    weapon.bulletSpeed = 1000; // speed (pixels per second)
    weapon.fireRate = 500; // delay in milliseconds
    weapon.trackSprite(player);
    weapon.trackOffset.y = 30;
    weapon.trackOffset.x = 10;

    //create coins
    coins = game.add.group();
    coins.enableBody = true;

    //create bullets
    bullets = game.add.group();
    bullets.enableBody = true;

    // create health pickup
    healthPickups = game.add.group();
    healthPickups.enableBody = true;

    healthPickup = healthPickups.create(70, 250, "healthPickup");
    healthPickup.body.gravity.y = 8;
    healthPickup.body.bounce.y = 0.5;
    healthPickup.isAlive = true;

    // create expolosive Barrels
    explosiveBarrels = game.add.group();
    explosiveBarrels.enableBody = true;

    explosiveBarrel = explosiveBarrels.create(390, 160, "explosiveBarrel");
    explosiveBarrel.body.gravity.y = 8;
    explosiveBarrel.body.drag.x = 1000;
    explosiveBarrel.body.collideWorldBounds = true;

    explosiveBarrel = explosiveBarrels.create(700, 595, "explosiveBarrel");
    explosiveBarrel.body.gravity.y = 8;
    explosiveBarrel.body.drag.x = 1000;
    explosiveBarrel.body.collideWorldBounds = true;

    //create portal
    portals = game.add.group();
    portals.enableBody = true;
    portal = portals.create(1150, 87, "portal");

    ammoPickups = game.add.group();
    ammoPickups.enableBody = true;
  },

  update: function() {
    /* Collision and overlap checks */
    hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(cyborgs, platforms);
    game.physics.arcade.overlap(player, cyborgs, this.cyborgHitPlayer);
    game.physics.arcade.collide(coins, platforms);
    game.physics.arcade.overlap(player, coins, this.collectcoin);
    game.physics.arcade.overlap(cyborgs, weapon.bullets, this.cyborghitwithbullet);
    game.physics.arcade.overlap(platforms, weapon.bullets, this.bulletHitPlatform);
    game.physics.arcade.collide(healthPickups, platforms);
    game.physics.arcade.overlap(player, portals, this.portal);
    game.physics.arcade.collide(explosiveBarrels, platforms);
    hitbarrel = game.physics.arcade.collide(explosiveBarrels, player);
    game.physics.arcade.collide(explosiveBarrels, cyborgs);
    game.physics.arcade.overlap(weapon.bullets, explosiveBarrels, this.bulletHitExplosiveBarrel);
    game.physics.arcade.collide(ammoPickups, platforms);
    game.physics.arcade.overlap(player, ammoPickups, this.collectAmmo);

    /* Player input and movement */
    if (left.isDown) {
      // move left with left animation
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (right.isDown) {
      // move right with right animation
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      // stop animations, show a single frame
      player.body.velocity.x = 0;
      player.animations.stop();
      player.frame = 4;
    }

    if (up.isDown && player.body.touching.down && (hitPlatform || hitbarrel)) {
      player.body.velocity.y = -350;
    }


    // interaction system
    // healthpack distance
    var healthPickupdistanceX = Math.abs(healthPickup.x - player.x);
    var healthPickupdistanceY = Math.abs(healthPickup.y - player.y);

    if (e.isDown) {
      if (healthPickupdistanceX < 50 && healthPickupdistanceY < 100 && healthPickup.isAlive) {
        level2State.collectHealthPickup();
      }
    }

    // shooting mechanics
    if (game.input.activePointer.leftButton.isDown && game.global.hasGun == true && game.global.ammoInGun >= 1 && game.global.isReloading == false) {
      success = weapon.fireAtPointer();
      if (success != null) {
        game.global.ammoInGun -= 1;
        ammoText.text = "Ammo: " + game.global.ammoInGun + "/" + game.global.ammoInBag;
      }
    }

    /* Other actions */
    if (r.justDown) {
      level2State.reload();
    }

    if (v.justDown) {
      game.state.start('level2');
    }

    // moving baddie
    cyborgs.forEach(function(cyborg) {
      var distanceCyborgX = player.x - cyborg.x;
      var distanceCyborgY = player.y - cyborg.y;
      if ((distanceCyborgX < 0 && distanceCyborgX > -200) && (distanceCyborgY < 150 && distanceCyborgY > -150)) {
        cyborg.body.velocity.x = -70;
        cyborg.animations.play("left");
      } else if ((distanceCyborgX > 0 && distanceCyborgX < 200) && (distanceCyborgY < 150 && distanceCyborgY > -150)) {
        cyborg.body.velocity.x = 70;
        cyborg.animations.play("right");
      } else {
        cyborg.body.velocity.x = 0;
        cyborg.animations.play("stop");
      }
    });
  },

  reload: function() {
    if (game.global.hasGun == true && game.global.isReloading == false && game.global.ammoInGun != 30) {
      game.global.isReloading = true;

      game.time.events.add(1000, () => {
        if (game.global.ammoInGun + game.global.ammoInBag >= 30) {
          game.global.ammoInBag -= game.global.clipSize - game.global.ammoInGun;
          game.global.ammoInGun = game.global.clipSize;
        }
        ammoText.text = "Ammo: " + game.global.ammoInGun + "/" + game.global.ammoInBag;
        game.global.isReloading = false;
      });
    }
  },

  cyborgHitPlayer: function(player, cyborg) {
    if (player.body.touching.right) {
      player.x -= 10;
    } else if (player.body.touching.left) {
      player.x += 10;
    }
    level2State.removeLives(1);
  },

  removeLives: function(lives) {
    game.global.lives -= lives;
    if (game.global.lives <= 0) {
      game.state.start("gameover");
    } else {
      healthBar.width = game.global.lives / game.global.maxLives * 200;
    }
  },

  addLives: function(lives) {
    game.global.lives = Math.min(game.global.lives + lives, game.global.maxLives);
    healthBar.width = game.global.lives / game.global.maxLives * 200;
  },

  cyborghit: function(cyborg, bullet, damage) {
    cyborg.damage(damage);
    bullet.kill();
    if (cyborg.health <= 0) {
      //create coins dropped from killing a cyborg
      coin = coins.create(cyborg.x, cyborg.y - 50, "coin");
      coin.body.gravity.y = 200;
      coin.body.bounce.y = 0.4;
      coin.scale.x = 0.65;
      coin.scale.y = 0.65;
      //kill cyborg
      cyborg.kill();


      if (Phaser.Math.random(1, 10) <= 3) {
        ammoPickup = ammoPickups.create(cyborg.x, cyborg.y - 30, "ammoPickup");
        ammoPickup.body.gravity.y = 8;
        ammoPickup.body.bounce.y = 0.5;
        ammoPickup.scale.x = 0.65;
        ammoPickup.scale.y = 0.65;
      }
    }
  },

  collectcoin: function(player, coin) {
    // increase the score
    game.global.score += game.rnd.integerInRange(5, 10);
    // display the new score
    scoreText.text = "Score: " + game.global.score;
    //remove the star
    coin.kill();
  },

  collectAmmo: function(player, ammoPickup) {
    if (game.global.hasGun == true) {
      game.global.ammoInBag += 20;

      if (game.global.ammoInBag >= 100) {
        game.global.ammoInBag = 100;
      }
      // destroy diamond after collecting it
      ammoPickup.kill();
      // play collect star sound
      ammoText.text = "Ammo: " + game.global.ammoInGun + "/" + game.global.ammoInBag;
    }
  },


  lose: function() {
    game.state.start('gameover');
  },

  /* Go to the win state */
  win: function() {
    game.state.start('win');
  },

  bulletHitPlatform: function(platform, bullet) {
    bullet.kill();
  },

  collectHealthPickup: function() {
    if (game.global.lives != 10) {
      healthPickup.kill();
      healthPickup.isAlive = false;
      // give player health
      level2State.addLives(3);
    }
  },

  cyborghitwithbullet: function(cyborg, bullet) {
    level2State.cyborghit(cyborg, bullet, 1);
  },

  portal: function() {
    game.time.events.add(2000, () => {
      var portaldistanceX = Math.abs(portal.x - player.x);
      var portaldistanceY = Math.abs(portal.y - player.y);
      if (portaldistanceX < 30 && portaldistanceY < 60) {
        game.global.level3locked = false;
        game.state.start('win');
      }
    });
  },

  bulletHitExplosiveBarrel: function(bullet, explosiveBarrel) {
    bullet.kill();

    var distanceX = Math.abs(explosiveBarrel.x - player.x);
    var distanceY = Math.abs(explosiveBarrel.y - player.y);
    if (distanceX < 100 && distanceY < 125) {
      level3State.removeLives(2);
    }

    cyborgs.forEach(function(cyborg) {
      var distance1X = Math.abs(explosiveBarrel.x - cyborg.x);
      var distance1Y = Math.abs(explosiveBarrel.y - cyborg.y);
      if (distance1X < 100 && distance1Y < 125) {
        level3State.cyborghit(cyborg, bullet, 3);
      }
    });

    explosiveBarrel.kill();
  },

};
// End of the file -- NOTHING CAN GO BELOW THIS LINE!!!
