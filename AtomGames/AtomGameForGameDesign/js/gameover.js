var gameoverState = {
  create: function() {
    // text
    game.stage.backgroundColor = "#290C4A";
    text = game.add.text(0, 0, "You're Bad", {
      fontSize: '48px',
      fill: '#fff',
      boundsAlignH: "center",
      boundsAlignV: "middle"
    });
    text.setTextBounds(0, 0, game.world.width, game.world.height);
    // button
    button = game.add.button(game.world.centerX, game.world.height - 100, 'button');
    button.anchor.setTo(0.5, 0.5);
    button.onInputUp.add(() => {
    game.state.start("menu");
    });
    text = game.add.text(button.x, button.y, 'Return to the Menu');
    text.anchor.setTo(0.5, 0.5);
    button.width = text.width + 10;
  }
};
