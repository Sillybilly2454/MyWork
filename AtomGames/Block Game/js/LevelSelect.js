var levelSelectState = {
  create: function() {
    game.add.image(0, 0, "sky");
    // Make title
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Level Selecter');
    titleText.anchor.setTo(0.5, 0.5);

    // Start button
    startLevel1Button = game.add.button(game.world.centerX - 370, game.world.centerY - 50, 'button');
    startLevel1Button.anchor.setTo(0.5, 0.5);
    startLevel1Button.onInputUp.add(this.startLevel1);
    startLevel1Text = game.add.text(startLevel1Button.x, startLevel1Button.y, 'Level 1');
    startLevel1Text.anchor.setTo(0.5, 0.5);
    level1BestTimeText = game.add.text(startLevel1Button.x, startLevel1Button.y + 60, game.global.level1BestTime);
    level1BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel2Button = game.add.button(game.world.centerX - 120, game.world.centerY - 50, 'button');
    startLevel2Button.anchor.setTo(0.5, 0.5);
    startLevel2Button.onInputUp.add(this.startLevel2);
    startLevel2Text = game.add.text(startLevel2Button.x, startLevel2Button.y, 'Level 2');
    startLevel2Text.anchor.setTo(0.5, 0.5);
    level2BestTimeText = game.add.text(startLevel2Button.x, startLevel2Button.y + 60, game.global.level2BestTime);
    level2BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel3Button = game.add.button(game.world.centerX + 130, game.world.centerY - 50, 'button');
    startLevel3Button.anchor.setTo(0.5, 0.5);
    startLevel3Button.onInputUp.add(this.startLevel3);
    startLevel3Text = game.add.text(startLevel3Button.x, startLevel3Button.y, 'Level 3');
    startLevel3Text.anchor.setTo(0.5, 0.5);
    level3BestTimeText = game.add.text(startLevel3Button.x, startLevel3Button.y + 60, game.global.level3BestTime);
    level3BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel4Button = game.add.button(game.world.centerX + 380, game.world.centerY - 50, 'button');
    startLevel4Button.anchor.setTo(0.5, 0.5);
    startLevel4Button.onInputUp.add(this.startLevel4);
    startLevel4Text = game.add.text(startLevel4Button.x, startLevel4Button.y, 'Level 4');
    startLevel4Text.anchor.setTo(0.5, 0.5);
    level4BestTimeText = game.add.text(startLevel4Button.x, startLevel4Button.y + 60, game.global.level4BestTime);
    level4BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel5Button = game.add.button(game.world.centerX - 370, game.world.centerY + 70, 'button');
    startLevel5Button.anchor.setTo(0.5, 0.5);
    startLevel5Button.onInputUp.add(this.startLevel5);
    startLevel5Text = game.add.text(startLevel5Button.x, startLevel5Button.y, 'Level 5');
    startLevel5Text.anchor.setTo(0.5, 0.5);
    level5BestTimeText = game.add.text(startLevel5Button.x, startLevel5Button.y + 60, game.global.level5BestTime);
    level5BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel6Button = game.add.button(game.world.centerX - 120, game.world.centerY + 70, 'button');
    startLevel6Button.anchor.setTo(0.5, 0.5);
    startLevel6Button.onInputUp.add(this.startLevel6);
    startLevel6Text = game.add.text(startLevel6Button.x, startLevel6Button.y, 'Level 6');
    startLevel6Text.anchor.setTo(0.5, 0.5);
    level6BestTimeText = game.add.text(startLevel6Button.x, startLevel6Button.y + 60, game.global.level6BestTime);
    level6BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel7Button = game.add.button(game.world.centerX + 130, game.world.centerY + 70, 'button');
    startLevel7Button.anchor.setTo(0.5, 0.5);
    startLevel7Button.onInputUp.add(this.startLevel7);
    startLevel7Text = game.add.text(startLevel7Button.x, startLevel7Button.y, 'Level 7');
    startLevel7Text.anchor.setTo(0.5, 0.5);
    level7BestTimeText = game.add.text(startLevel7Button.x, startLevel7Button.y + 60, game.global.level7BestTime);
    level7BestTimeText.anchor.setTo(0.5, 0.5);

    startLevel8Button = game.add.button(game.world.centerX + 380, game.world.centerY + 70, 'button');
    startLevel8Button.anchor.setTo(0.5, 0.5);
    startLevel8Button.onInputUp.add(this.startLevel8);
    startLevel8Text = game.add.text(startLevel8Button.x, startLevel8Button.y, 'Level 8');
    startLevel8Text.anchor.setTo(0.5, 0.5);
    level8BestTimeText = game.add.text(startLevel8Button.x, startLevel8Button.y + 60, game.global.level8BestTime);
    level8BestTimeText.anchor.setTo(0.5, 0.5);

    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(this.backToMenu);
    backText = game.add.text(backButton.x, backButton.y, 'Back');
    backText.anchor.setTo(0.5, 0.5);
  },

  startLevel1: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level1");
  },

  startLevel2: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level2");
  },

  startLevel3: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level3");
  },

  startLevel4: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level4");
  },

  startLevel5: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level5");
  },

  startLevel6: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level6");
  },

  startLevel7: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level7");
  },

  startLevel8: function() {
    game.global.score = 0;
    game.global.currentTime = 0;
    game.state.start("level8");
  },

  backToMenu: function() {
    game.state.start('menu');
  }
};
