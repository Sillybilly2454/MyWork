var levelState = {
  create: function() {

    // Prepare sound effects
    pointSound = game.add.audio('point');
    winSound = game.add.audio('win');
    lossSound = game.add.audio('loss');

    //Environment
    game.add.sprite(0, 0, 'bg');
    ground = game.add.sprite(0, game.world.height, 'ground');
    ground.y -= ground.height;

    //Meteors
    meteors = game.add.group();
    meteors.enableBody = true;

    //Tower
    tower = game.add.image(game.world.centerX, game.world.height - 140, 'tower');
    tower.anchor.x = 0.5;
    tower.scale.setTo(2);
    game.physics.enable(tower, Phaser.Physics.ARCADE);

    //Weapon
    weapon = game.add.weapon(10, 'missile'); // create a weapon system (10 bullets at once, looks like 'missile')
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS; // destroyed when off-screen
    weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE; // destroyed after a given distance
    weapon.bulletSpeed = 200; // speed (pixels per second)
    weapon.fireRate = 500; // delay in milliseconds
    weapon.trackSprite(tower);
    weapon.setBulletFrames(0, 6, true);

    //Cities & Lives
    cities = game.add.group();
    cities.enableBody = true;
    for (i = 0; i < 2; i++) {
      for (j = 0; j < 3; j++) {
        c = cities.create(70 + (i * 400) + (j * 100), game.height - 90, 'city');
        c.frame = game.rnd.integerInRange(0, 2); // Which city image to use
        c.scale.setTo(1);
        c.isDestroyed = false; // Is the city destroyed? (no)
      }
    }
    game.global.lives = cities.countLiving();

    // UI Display
    scoreText = game.add.text(game.world.centerX - 200, 32, 'Score: ' + game.global.score, {
      fontSize: '32px',
      fill: '#ff0000'
    });
    scoreText.anchor.setTo(0.5);
    waveText = game.add.text(game.world.centerX + 200, 32, 'Wave: ' + game.global.wave, {
      fontSize: '32px',
      fill: '#ff0000'
    });
    waveText.anchor.setTo(0.5);
    livesText = game.add.text(game.world.centerX, 32, 'Lives: ' + game.global.lives, {
      fontSize: '32px',
      fill: '#ff0000'
    });
    livesText.anchor.setTo(0.5);

    this.SpawnWave(); //Spawn the first wave
  },

  update: function() {
    //Collision detection
    game.physics.arcade.overlap(cities, weapon.bullets, this.CityStruck, null, this);
    game.physics.arcade.overlap(cities, meteors, this.CityStruck, null, this);
    game.physics.arcade.overlap(meteors, weapon.bullets, this.MeteorStruck, null, this);
    game.physics.arcade.overlap(meteors, ground, this.MeteorStruck, null, this);

    //Is the player firing a missile?
    if (game.input.activePointer.leftButton.isDown && tower.alive) {
      weapon.fireAtPointer();
      weapon.bulletKillDistance = game.physics.arcade.distanceToPointer(tower); //Bullets are destroyed at the mouse location
    }

    //Remove any meteors that have fallen out of the bottom of the world
    meteors.forEach(function(m) {
      if (m.y > (game.world.height - 90)) {
        meteors.remove(m);
        this.CheckLastMeteor();
      }
    }, this);
  },

  //Spawns a new wave of meteors (gets bigger over time)
  SpawnWave: function() {
    game.global.wave++;
    for (i = 0; i < (game.global.wave * 0.5) + 5; i++) {
      randX = game.rnd.integerInRange(0, game.width); //Spawn at a random X-coordinate
      m = meteors.create(randX, -64, 'meteor');
      targetX = game.rnd.integerInRange(0, game.width); //Head towards a random X-coordinate
      game.physics.arcade.moveToXY(m, targetX, game.world.height); //Move towards target
      m.body.gravity.y = game.rnd.integerInRange(6, 15);
      m.body.setCircle(m.scale);
      m.frame = game.rnd.integerInRange(0, 3); //Which meteor image to use
    }
    waveText.text = 'Wave: ' + game.global.wave;
  },

  //If a city is struck
  CityStruck: function(city, other) {
    if (city.isDestroyed == true) {
      return; // If the city is already destroyed, skip the rest of this function
    }
    other.kill();
    game.global.lives--;
    city.isDestroyed = true; // Set the city as destroyed
    city.frame += 3; // Change to the destroyed frame
    livesText.text = 'Lives: ' + game.global.lives;
    if (game.global.lives < 1) { //If the last city is destroyed
      game.time.events.add(1000, () => {
        this.Lose();
      });
    }
    this.CheckLastMeteor();
  },

  //If a meteor is struck
  MeteorStruck: function(meteor, other) {
    pointSound.play();
    this.createExplosion(meteor.body.x, meteor.body.y, meteor);
    other.kill();
    game.global.score += 10;
    scoreText.text = 'Score: ' + game.global.score;
    this.CheckLastMeteor();
  },

  // Check to see if the last meteor was destroyed
  CheckLastMeteor: function() {
    //If that was the last meteor, spawn a new wave
    if (meteors.total < 1) {
      winSound.play();
      game.time.events.add(1000, () => {
        this.SpawnWave();
      });
    }
  },

  //When the play loses
  Lose: function() {
    lossSound.play();
    game.time.events.add(1000, () => {
      game.state.start('gameover');
    });
  },

  createExplosion: function(x, y, meteor) {
  explosion = game.add.sprite(x, y, 'explosion');  // Add the explosion object
  explosion.anchor.setTo(0.5, 0.5);  // Center the explosion on the coordinates
  meteor.kill();
  explosionanimation = explosion.animations.add('bang', [0, 1, 2, 3, 4, 5, 6], 10, false);  //Add an animation to the object
  explosionanimation.onComplete.add(this.destroyExplosion, this); // Call a function (DestroyExplosion) when the animation finishes
  explosion.animations.play('bang');  // Start the animation playing
},

  destroyExplosion: function() {
    explosion.kill();
  },

};
