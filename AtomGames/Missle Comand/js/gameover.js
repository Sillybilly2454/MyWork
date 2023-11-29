var gameoverState = {
  create: function() {
    lossLabel = game.add.text(80, 80, '', {
		font: '50px Arial', 
		fill: '#00ff00'});

	lossLabel.text = 'The ruins stretch for as far \n as the eye can see...'

    scoreLabel = game.add.text(game.world.centerX, game.world.centerY, '', {
		font: '45px Arial', 
		fill: '#00ff00'});
    scoreLabel.anchor.setTo(0.5, 0.5);
    scoreLabel.text = 'Score: ' + game.global.score + '\n';
    scoreLabel.text += 'Waves Completed: ' + (game.global.wave - 1);

    button = game.add.button(game.world.centerX, game.world.centerY+100, 'button');
    button.anchor.setTo(0.5,0.5);
    button.onInputUp.add(this.restart);
    text = game.add.text(button.x,button.y,'PLAY AGAIN');
    text.anchor.setTo(0.5,0.5);
  },

  restart: function() {
    game.state.start('menu');
  }
};
