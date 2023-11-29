var level2State = {
  create: function() {
    game.add.image(0, 0, "sky");

    // creates a group to collect all the platforms
    platforms = game.add.group();
    // enable physics on the whole group
    platforms.enableBody = true;
    // add the ground
    ground = platforms.create(0, game.world.height - 64, "platform");
    // make it larger
    ground.scale.setTo(2, 2);
    // make Ledges
    platforms.create(400, 400, "platform");
    platforms.create(-150, 250, "platform");
    platforms.create(400, 100, "platform");
    // make all platforms startionary during collisions
    platforms.setAll("body.immovable", true);
    // make the player
    player = game.add.sprite(32, game.world.height - 150, "player");
    // enable physics for the player
    game.physics.arcade.enable(player);
    // set physics properties
    player.body.gravity.y = 300;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    // animate the player
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    // health bar
    healthBar = game.add.image(game.world.width - 20, 20, "healthbar");
    healthBar.anchor.setTo(1, 0);
    healthBar.width = game.global.lives / game.global.maxLives * 200;
    // create movement with keybaord keys
    up = game.input.keyboard.addKey(Phaser.KeyCode.W);
    left = game.input.keyboard.addKey(Phaser.KeyCode.A);
    right = game.input.keyboard.addKey(Phaser.KeyCode.D);
    e = game.input.keyboard.addKey(Phaser.KeyCode.E);
    q = game.input.keyboard.addKey(Phaser.KeyCode.Q);
    m = game.input.keyboard.addKey(Phaser.KeyCode.M);
    // add cursor keys input
    cursors = game.input.keyboard.createCursorKeys();
    //create stars
    stars = game.add.group();
    stars.enableBody = true;
    // create diamonds
    diamonds = game.add.group();
    diamonds.enableBody = true;
    // create health pickup
    healthPickups = game.add.group();
    healthPickups.enableBody = true;
    // create mushroom power up
    mushroomPickups = game.add.group();
    mushroomPickups.enableBody = true;
    // create fireball
    fireballs = game.add.group();
    fireballs.enableBody = true;
    // create baddie fireballs
    baddiefireballs = game.add.group();
    baddiefireballs.enableBody = true;
    // create gun
    guns = game.add.group();
    guns.enableBody = true;
    // create blood
    bloods = game.add.group();
    bloods.enableBody = true;
    // create bullet
    bullets = game.add.group();
    bullets.enableBody = true;
    // create ammo pickup
    ammoPickups = game.add.group();
    ammoPickups.enableBody = true;
    // create give up stuff
    giveUps = game.add.group();
    giveUps.enableBody = true;
    // create baddie
    baddie = game.add.sprite(600, 350, "baddie");
    game.physics.arcade.enable(baddie);
    baddie.body.gravity.y = 300;
    baddie.body.bounce.y = 0.2;
    baddie.body.collideWorldBounds = true;

    ghost = game.add.sprite(32, 150, "ghost");
    // enable physics for the ghost
    game.physics.arcade.enable(ghost);
    // set physics properties
    ghost.body.collideWorldBounds = true;

    // animate the baddie
    baddie.animations.add('left', [0, 1], 10, true);
    baddie.animations.add('right', [2, 3], 10, true);
    baddie.animations.add('stop', [1], 10, true);
    //create 12 stars
    for (let i = 0; i < 12; i++) {
      star = stars.create(i * 70, -22, "star");
      star.body.gravity.y = 6;
      //random bounce factor
      star.body.bounce.y = 0.7 + Math.random() * 0.3;
    }
    // add a the score text block to the screen
    scoreText = game.add.text(16, 16, "Score: " + game.global.score, {});
    // create health pickups
    for (let i = 0; i < 2; i++) {
      healthPickup = healthPickups.create(i * 400, -22, "healthPickup");
      healthPickup.body.gravity.y = 10;
      healthPickup.body.bounce.y = 0.5;
    }
    // create mushroom pickup
    for (let i = 0; i < 2; i++) {
      mushroomPickup = mushroomPickups.create(i * 500, 200, "mushroomPickup");
      mushroomPickup.body.gravity.y = 10;
      mushroomPickup.body.bounce.y = 0;
      mushroomPickup.body.collideWorldBounds = true;
    }
    // create diamonds
    for (let i = 0; i < 1 + Math.random(); i++) {
      diamond = diamonds.create(i * 70, -22, "diamond");
      diamond.body.gravity.y = 8;
      //random bounce factor
      diamond.body.bounce.y = 0.5 + Math.random() * 0.3;
    }
    // create guns
    for (let i = 0; i < 1; i++) {
      gun = guns.create(i * 70, -22, "gun");
      gun.body.gravity.y = 8;
      //random bounce factor
      gun.body.bounce.y = 0.5 + Math.random() * 0.3;
    }

    for (let i = 0; i < 2; i++) {
      ammoPickup = ammoPickups.create(i * 500, -22, "ammoPickup");
      ammoPickup.body.gravity.y = 8;
      //random bounce factor
      ammoPickup.body.bounce.y = 0.5 + Math.random() * 0.3;
    }
  },

  spawnCloud: function() {
    var cloudY = Phaser.Math.between(0, 200);
    cloud = clouds.create(200, cloudY, 'cloud');
    var cloudV = Phaser.Math.between(20, 100);
    cloud.body.velocity.x = cloudV;
    cloud.body.gravity.y = 0;
  },


  collectstar: function(player, star) {
    // increase the score
    game.global.score += 10;
    // display the new score
    scoreText.text = "Score: " + game.global.score;
    //remove the star
    star.kill();
    // play collect star sound
    collectCoinSound.play();
    if (stars.countLiving() == 0) {
      // start the next level after delay
      game.time.events.add(1000, () => {
        game.state.start("menu");
      });
    }
  },

  giveUp: function() {
      game.state.start("level2");
  },

  collecthealth: function(player, healthpickup) {
    if (game.global.lives == 3) {} else {
      healthpickup.kill();
      // play collect star sound
      collectHealthSound.play();
      // give player health
      level2State.addLives(1);
    }
  },

  collectDiamond: function(player, diamond) {
    game.global.score += 50;
    scoreText.text = "Score: " + game.global.score;
    // destroy diamond after collecting it
    diamond.kill();
    // play collect star sound
    collectCoinSound.play();
  },

  collectAmmo: function(player, ammoPickup) {
    if (game.global.hasGun == true) {
      game.global.currentAmmo = 15;
      // destroy diamond after collecting it
      ammoPickup.kill();
      // play collect star sound
      collectCoinSound.play();
      ammoText.text = "Ammo: " + game.global.currentAmmo + "/" + "15";
    }
  },

  collectMushroom: function(player, mushroomPickup, powerUp) {
    // destroy Mushroom
    mushroomPickup.kill();
    // play collect star sound
    collectMushroomSound.play();
    // setting the value for the power up
    player.scale.x += 0.2;
    player.scale.y += 0.2;
    player.body.velocity.y = -200;
    game.global.powerUp = true;
    game.time.events.add(20000, () => {
      game.global.powerUp = false;
      player.scale.x -= 0.2;
      player.scale.y -= 0.2;
    });
  },

  baddieCollectMushroom: function(baddie, mushroomPickup, baddiePowerUp) {
    // destroy Mushroom
    mushroomPickup.kill();
    // play collect star sound
    collectMushroomSound.play();
    // setting the value for the power up
    baddie.scale.x += 0.2;
    baddie.scale.y += 0.2
    baddie.body.velocity.y = -200;
    game.global.baddiePowerUp = true;
    game.time.events.add(25000, () => {
      game.global.baddiePowerUp = false;
      baddie.scale.x -= 0.2;
      baddie.scale.y -= 0.2;
    });
  },

  shootFireball: function(fireball, baddie) {
    if (game.global.powerUp == true) {
      // Create fireball and shoot in direction that the player is facing
      if (left.isDown) {
        fireball = fireballs.create(player.x - 20, player.y + 20, "fireball");
        fireball.body.velocity.x = -100;
      } else if (right.isDown) {
        fireball = fireballs.create(player.x + 20, player.y + 20, "fireball");
        fireball.body.velocity.x = 100;
      } else {
        fireball = fireballs.create(player.x + 20, player.y + 20, "fireball");
        fireball.body.velocity.x = 100;
      }
      fireball.body.gravity.y = 0;
      fireball.body.bounce.y = 0;
      fireball.body.collideWorldBounds = false;
      // destroy fireball after 10 secounds
      game.time.events.add(10000, () => {
        fireball.kill();
      });
    }
  },

  baddieShootFireball: function(fireball) {
    if (game.global.baddiePowerUp >= 1) {
      // Create fireball and shoot in direction that the baddie is facing
      if (player.x < baddie.x) {
        baddiefireball = baddiefireballs.create(baddie.x - 20, baddie.y + 20, "fireball");
        baddiefireball.body.velocity.x = -100;
      } else {
        baddiefireball = baddiefireballs.create(baddie.x + 20, baddie.y + 20, "fireball");
        baddiefireball.body.velocity.x = 100;
      }

      baddiefireball.body.gravity.y = 0;
      baddiefireball.body.bounce.y = 0;
      baddiefireball.body.collideWorldBounds = false;
      // destroy fireball after 10 secounds
      game.time.events.add(10000, () => {
        baddiefireball.kill();
      });
    }
  },

  killPlayerFireball: function(player, baddiefireball) {
    baddiefireball.kill();
    level2State.removeLives(3);
  },

  killBaddie: function(baddie, fireball) {
    baddie.kill();
    fireball.kill();
  },

  killBaddieBullet: function(baddie, bullet) {
    baddie.kill();
    bullet.kill();
  },
  shootGun: function(gun, baddie) {
    if (game.global.hasGun == true) {
      if (game.global.currentAmmo >= 1) {
        // Create bullit and shoot in direction that the player is facing
        if (left.isDown) {
          bullet = bullets.create(player.x - 20, player.y + 20, "bullet");
          bullet.body.velocity.x = -200;
          bullet.scale.x = -1
        } else if (right.isDown) {
          bullet = bullets.create(player.x + 20, player.y + 20, "bullet");
          bullet.body.velocity.x = 200;
        } else {
          bullet = bullets.create(player.x + 20, player.y + 20, "bullet");
          bullet.body.velocity.x = 200;
        }
        bullet.body.gravity.y = 0;
        bullet.body.bounce.y = 0;
        bullet.body.collideWorldBounds = false;
        game.global.currentAmmo -= 1;
        shootGunSound.play();
        // destroy fireball after 10 secounds
        game.time.events.add(10000, () => {
          bullet.kill();
        });
        ammoText.text = "Ammo: " + game.global.currentAmmo + "/" + "15";
      }
    }
  },

  collectGun: function() {
    if (game.global.hasGun == false) {
      game.global.hasGun = true;
      gun.kill();
      ammoText = game.add.text(16, 50, "Ammo: " + "15" + "/" + "15", {});
    }
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

  hitBaddie: function(player, baddie) {
    if (player.body.touching.right) {
      player.x -= 32;
    } else if (player.body.touching.left) {
      player.x += 32;
    } else {
      player.body.velocity.y = -350;
    }
    level2State.removeLives(1);
    // play damage sound effect
    takingDamageSound.play();
  },

  update: function() {
    hitPlatform = game.physics.arcade.collide(player, platforms);
    //move player
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
    // player shoot fireball
    if (e.justDown) {
      level2State.shootFireball();
    }
    if (q.justDown) {
      level2State.shootGun();
    }
    if (m.justDown) {
      level2State.giveUp();
    }

    // jump if the up key is down and the player
    // is touching the top of a platform
    if (up.isDown && player.body.touching.down && hitPlatform) {
      player.body.velocity.y = -350;
    }
    // physic checks
    hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, this.collectstar);
    game.physics.arcade.collide(baddie, platforms);
    game.physics.arcade.overlap(player, baddie, this.hitBaddie);
    game.physics.arcade.overlap(player, ghost, this.hitBaddie);
    game.physics.arcade.collide(healthPickups, platforms);
    game.physics.arcade.overlap(player, healthPickups, this.collecthealth);
    game.physics.arcade.collide(mushroomPickups, platforms);
    game.physics.arcade.overlap(player, mushroomPickups, this.collectMushroom);
    game.physics.arcade.collide(fireballs, platforms);
    game.physics.arcade.overlap(baddie, fireballs, this.killBaddie);
    game.physics.arcade.collide(diamonds, platforms);
    game.physics.arcade.overlap(player, diamonds, this.collectDiamond);
    game.physics.arcade.collide(baddiefireballs, platforms);
    game.physics.arcade.overlap(player, baddiefireballs, this.killPlayerFireball);
    game.physics.arcade.collide(mushroomPickups, platforms);
    game.physics.arcade.overlap(baddie, mushroomPickups, this.baddieCollectMushroom);
    game.physics.arcade.collide(gun, platforms);
    game.physics.arcade.overlap(player, gun, this.collectGun);
    game.physics.arcade.collide(bullets, platforms);
    game.physics.arcade.overlap(baddie, bullets, this.killBaddieBullet);
    game.physics.arcade.collide(ammoPickup, platforms);
    game.physics.arcade.overlap(player, ammoPickup, this.collectAmmo);
    // moving baddie
    var distance = player.x - baddie.x;
    var distance2 = mushroomPickup.x - baddie.x;
    if (distance2 < 0 && distance2 > -200 && baddie.x > 400) {
      if (distance2 < 0 && distance2 > -200 && baddie.x > 400) {
        baddie.body.velocity.x = -70;
        baddie.animations.play("left");
      } else if (distance2 > 0 && distance2 < 200 && baddie.x < game.world.width) {
        baddie.body.velocity.x = 70;
        baddie.animations.play("right");
      } else {
        baddie.body.velocity.x = 0;
        baddie.animations.play("stop");
      }
    } else {
      if (distance < 0 && distance > -200 && baddie.x > 400) {
        baddie.body.velocity.x = -70;
        baddie.animations.play("left");
      } else if (distance > 0 && distance < 200 && baddie.x < game.world.width) {
        baddie.body.velocity.x = 70;
        baddie.animations.play("right");
      } else {
        baddie.body.velocity.x = 0;
        baddie.animations.play("stop");
      }
    }

    var distanceX = player.x - ghost.x;
    if (distanceX < 0 && distanceX > -400) {
      ghost.body.velocity.x = -70;
    } else if (distanceX > 0 && distanceX < 400) {
      ghost.body.velocity.x = 70;
    } else {
      ghost.body.velocity.x = 0;
    }

    var distanceY = player.y - ghost.y;
    if (distanceY < 0 && distanceY > -400) {
      ghost.body.velocity.y = -70;
    } else if (distanceY > 0 && distanceY < 400) {
      ghost.body.velocity.y = 70;
    } else {
      ghost.body.velocity.y = 0;
    }

    // baddie shoot fireball
    if (distance < 0 && distance > -200 && baddie.x > 400) {
      level2State.baddieShootFireball();
    } else if (distance > 0 && distance < 200 && baddie.x < game.world.width) {
      level2State.baddieShootFireball();
    }


    // make mushroom run from player
    var distance3 = player.x - mushroomPickup.x;
    if (distance3 < 0 && distance3 > -100 && mushroomPickup.x > 400) {
      mushroomPickup.body.velocity.x = 70;
    } else if (distance3 > 0 && distance < 100 && mushroomPickup.x < game.world.width) {
      mushroomPickup.body.velocity.x = -70;
    } else {
      mushroomPickup.body.velocity.x = 0;
    }

  }
};
