var dataState = {
  create: function() {
    game.add.image(0, 0, "sky");
    // Make title
    titleText = game.add.text(game.world.centerX, game.world.centerY - 200, 'Load / Save Data');
    titleText.anchor.setTo(0.5, 0.5);

    // load data save 1
    loadData1Button = game.add.button(game.world.centerX - 300, game.world.centerY - 100, 'button');
    loadData1Button.anchor.setTo(0.5, 0.5);
    loadData1Button.onInputUp.add(this.loadData1);
    loadData1Text = game.add.text(loadData1Button.x, loadData1Button.y, 'Load 1');
    loadData1Text.anchor.setTo(0.5, 0.5);

    loadData2Button = game.add.button(game.world.centerX - 300, game.world.centerY, 'button');
    loadData2Button.anchor.setTo(0.5, 0.5);
    loadData2Button.onInputUp.add(this.loadData2);
    loadData2Text = game.add.text(loadData2Button.x, loadData2Button.y, 'Load 2');
    loadData2Text.anchor.setTo(0.5, 0.5);

    loadData3Button = game.add.button(game.world.centerX - 300, game.world.centerY + 100, 'button');
    loadData3Button.anchor.setTo(0.5, 0.5);
    loadData3Button.onInputUp.add(this.loadData3);
    loadData3Text = game.add.text(loadData3Button.x, loadData3Button.y, 'Load 3');
    loadData3Text.anchor.setTo(0.5, 0.5);

    saveData1Button = game.add.button(game.world.centerX + 300, game.world.centerY - 100, 'button');
    saveData1Button.anchor.setTo(0.5, 0.5);
    saveData1Button.onInputUp.add(this.saveData1);
    saveData1Text = game.add.text(saveData1Button.x, saveData1Button.y, 'Save 1');
    saveData1Text.anchor.setTo(0.5, 0.5);

    saveData2Button = game.add.button(game.world.centerX + 300, game.world.centerY, 'button');
    saveData2Button.anchor.setTo(0.5, 0.5);
    saveData2Button.onInputUp.add(this.saveData2);
    saveData2Text = game.add.text(saveData2Button.x, saveData2Button.y, 'Save 2');
    saveData2Text.anchor.setTo(0.5, 0.5);

    saveData3Button = game.add.button(game.world.centerX + 300, game.world.centerY + 100, 'button');
    saveData3Button.anchor.setTo(0.5, 0.5);
    saveData3Button.onInputUp.add(this.saveData3);
    saveData3Text = game.add.text(saveData3Button.x, saveData3Button.y, 'Save 3');
    saveData3Text.anchor.setTo(0.5, 0.5);

    backButton = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    backButton.anchor.setTo(0.5, 0.5);
    backButton.onInputUp.add(this.backToMenu);
    backText = game.add.text(backButton.x, backButton.y, 'Back');
    backText.anchor.setTo(0.5, 0.5);

  },

  saveData1: function() {
    saveingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Saving Data 1...');
    saveingDataText.anchor.setTo(0.5, 0.5);
    localStorage.setItem('level1BestTime1', game.global.level1BestTime);
    localStorage.setItem('level2BestTime1', game.global.level2BestTime);
    localStorage.setItem('level3BestTime1', game.global.level3BestTime);
    localStorage.setItem('level4BestTime1', game.global.level4BestTime);
    localStorage.setItem('level5BestTime1', game.global.level5BestTime);
    localStorage.setItem('level6BestTime1', game.global.level6BestTime);
    localStorage.setItem('level7BestTime1', game.global.level7BestTime);
    localStorage.setItem('level8BestTime1', game.global.level8BestTime);

    game.time.events.add(1000, () => {
      saveingDataText.destroy();
    });
  },

  saveData2: function() {
    saveingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Saving Data 2...');
    saveingDataText.anchor.setTo(0.5, 0.5);
    localStorage.setItem('level1BestTime2', game.global.level1BestTime);
    localStorage.setItem('level2BestTime2', game.global.level2BestTime);
    localStorage.setItem('level3BestTime2', game.global.level3BestTime);
    localStorage.setItem('level4BestTime2', game.global.level4BestTime);
    localStorage.setItem('level5BestTime2', game.global.level5BestTime);
    localStorage.setItem('level6BestTime2', game.global.level6BestTime);
    localStorage.setItem('level7BestTime2', game.global.level7BestTime);
    localStorage.setItem('level8BestTime2', game.global.level8BestTime);
    game.time.events.add(1000, () => {
      saveingDataText.destroy();
    });
  },

  saveData3: function() {
    saveingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Saving Data 3...');
    saveingDataText.anchor.setTo(0.5, 0.5);
    localStorage.setItem('level1BestTime3', game.global.level1BestTime);
    localStorage.setItem('level2BestTime3', game.global.level2BestTime);
    localStorage.setItem('level3BestTime3', game.global.level3BestTime);
    localStorage.setItem('level4BestTime3', game.global.level4BestTime);
    localStorage.setItem('level5BestTime3', game.global.level5BestTime);
    localStorage.setItem('level6BestTime3', game.global.level6BestTime);
    localStorage.setItem('level7BestTime3', game.global.level7BestTime);
    localStorage.setItem('level8BestTime3', game.global.level8BestTime);
    game.time.events.add(1000, () => {
      saveingDataText.destroy();
    });
  },

  loadData1: function() {
    loadingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Loading Data 1...');
    loadingDataText.anchor.setTo(0.5, 0.5);
    // load varables
    game.global.level1BestTime = parseInt(localStorage.getItem('level1BestTime1')) || 0;
    game.global.level2BestTime = parseInt(localStorage.getItem('level2BestTime1')) || 0;
    game.global.level3BestTime = parseInt(localStorage.getItem('level3BestTime1')) || 0;
    game.global.level4BestTime = parseInt(localStorage.getItem('level4BestTime1')) || 0;
    game.global.level5BestTime = parseInt(localStorage.getItem('level5BestTime1')) || 0;
    game.global.level6BestTime = parseInt(localStorage.getItem('level6BestTime1')) || 0;
    game.global.level7BestTime = parseInt(localStorage.getItem('level7BestTime1')) || 0;
    game.global.level8BestTime = parseInt(localStorage.getItem('level8BestTime1')) || 0;
    game.time.events.add(1000, () => {
      loadingDataText.destroy();
    });
  },

  loadData2: function() {
    loadingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Loading Data 2...');
    loadingDataText.anchor.setTo(0.5, 0.5);
    // load varables
    game.global.level1BestTime = parseInt(localStorage.getItem('level1BestTime2')) || 0;
    game.global.level2BestTime = parseInt(localStorage.getItem('level2BestTime2')) || 0;
    game.global.level3BestTime = parseInt(localStorage.getItem('level3BestTime2')) || 0;
    game.global.level4BestTime = parseInt(localStorage.getItem('level4BestTime2')) || 0;
    game.global.level5BestTime = parseInt(localStorage.getItem('level5BestTime2')) || 0;
    game.global.level6BestTime = parseInt(localStorage.getItem('level6BestTime2')) || 0;
    game.global.level7BestTime = parseInt(localStorage.getItem('level7BestTime2')) || 0;
    game.global.level8BestTime = parseInt(localStorage.getItem('level8BestTime2')) || 0;
    game.time.events.add(1000, () => {
      loadingDataText.destroy();
    });
  },

  loadData3: function() {
    loadingDataText = game.add.text(game.world.centerX, game.world.centerY, 'Loading Data 3...');
    loadingDataText.anchor.setTo(0.5, 0.5);
    // load varables
    game.global.level1BestTime = parseInt(localStorage.getItem('level1BestTime3')) || 0;
    game.global.level2BestTime = parseInt(localStorage.getItem('level2BestTime3')) || 0;
    game.global.level3BestTime = parseInt(localStorage.getItem('level3BestTime3')) || 0;
    game.global.level4BestTime = parseInt(localStorage.getItem('level4BestTime3')) || 0;
    game.global.level5BestTime = parseInt(localStorage.getItem('level5BestTime3')) || 0;
    game.global.level6BestTime = parseInt(localStorage.getItem('level6BestTime3')) || 0;
    game.global.level7BestTime = parseInt(localStorage.getItem('level7BestTime3')) || 0;
    game.global.level8BestTime = parseInt(localStorage.getItem('level8BestTime3')) || 0;
    game.time.events.add(1000, () => {
      loadingDataText.destroy();
    });
  },

  backToMenu: function() {
    game.state.start('menu');
  },
};
