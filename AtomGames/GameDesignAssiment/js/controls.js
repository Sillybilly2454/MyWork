/**
 * A "controls" screen to show the player how to control the game
 */
var controlsState = {
  create: function() {
    //Controls text
    controlsText = "How to play!";
    controlsText += " \n W = Jump";
    controlsText += " \n A = Left";
    controlsText += " \n D = Right";
    controlsText += " \n R = Reload";
    controlsText += " \n E = Interact";
    controlsText += " \n Left Mouse Button = Shoot Gun";
    controlsText += " \n SpaceBar = Use JetPack";
    controlsText += " \n V = Restart Level";
    controls = game.add.text(game.world.centerX, game.world.centerY - 200, controlsText, {
      fill: '#ffffff'
    });
    controls.anchor.setTo(0.5, 0);

    //Back button
    btnBack = game.add.button(game.world.centerX, game.world.height - 50, 'button');
    btnBack.anchor.setTo(0.5, 0.5);
    btnBack.onInputDown.add(function() {
      btnBack.frame = 1;
    });
    btnBack.onInputUp.add(function() {
      game.state.start('menu');
    });
    txtBack = game.add.text(btnBack.x, btnBack.y, 'Main Menu');
    txtBack.anchor.setTo(0.5, 0.5);
  }
};
