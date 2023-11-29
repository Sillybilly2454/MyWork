var levelSelectState = {
  create: function() {
    game.add.image(0, 0, "sky");
    // Make title
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Level Selecter', {
      fill: '#ffffff'
    });
    titleText.anchor.setTo(0.5, 0.5);

    // Start button
    startLevel1Button = game.add.button(game.world.centerX - 370, game.world.centerY - 50, 'button');
    startLevel1Button.anchor.setTo(0.5, 0.5);
    startLevel1Button.onInputUp.add(this.startLevel1);
    startLevel1Text = game.add.text(startLevel1Button.x, startLevel1Button.y, 'Level 1');
    startLevel1Text.anchor.setTo(0.5, 0.5);

    startLevel2Button = game.add.button(game.world.centerX - 120, game.world.centerY - 50, 'button');
    startLevel2Button.anchor.setTo(0.5, 0.5);
    startLevel2Button.onInputUp.add(this.startLevel2);
    startLevel2Text = game.add.text(startLevel2Button.x, startLevel2Button.y, 'Level 2');
    startLevel2Text.anchor.setTo(0.5, 0.5);

    startLevel3Button = game.add.button(game.world.centerX + 130, game.world.centerY - 50, 'button');
    startLevel3Button.anchor.setTo(0.5, 0.5);
    startLevel3Button.onInputUp.add(this.startLevel3);
    startLevel3Text = game.add.text(startLevel3Button.x, startLevel3Button.y, 'Level 3');
    startLevel3Text.anchor.setTo(0.5, 0.5);

    startLevel4Button = game.add.button(game.world.centerX + 380, game.world.centerY - 50, 'button');
    startLevel4Button.anchor.setTo(0.5, 0.5);
    startLevel4Button.onInputUp.add(this.startLevel4);
    startLevel4Text = game.add.text(startLevel4Button.x, startLevel4Button.y, 'Level 4');
    startLevel4Text.anchor.setTo(0.5, 0.5);

    startLevel5Button = game.add.button(game.world.centerX, game.world.centerY + 50, 'button');
    startLevel5Button.anchor.setTo(0.5, 0.5);
    startLevel5Button.scale.x = 2;
    startLevel5Button.onInputUp.add(this.startLevel5);
    startLevel5Text = game.add.text(startLevel5Button.x, startLevel5Button.y, 'Level 5/Boss Level');
    startLevel5Text.anchor.setTo(0.5, 0.5);

    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(this.backToMenu);
    backText = game.add.text(backButton.x, backButton.y, 'Back');
    backText.anchor.setTo(0.5, 0.5);
  },

  startLevel1: function() {
    game.state.start("level1");
  },

  startLevel2: function() {
    if (game.global.level2locked == false) {
      game.state.start("level2");
    }
  },

  startLevel3: function() {
    if (game.global.level3locked == false) {
      game.state.start("level3");
    }
  },

  startLevel4: function() {
    if (game.global.level4locked == false) {
      game.state.start("level4");
    }
  },

  startLevel5: function() {
    if (game.global.level5PayModelocked == false) {
      game.state.start('level5PayMode');
    }
  },

  backToMenu: function() {
    game.state.start('menu');
  }
};
