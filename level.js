'use strict'

// The Level class contains most of the assets.
class Level {
  constructor(game, number) {
    this.game = game;
    this.number = number;
    this.init();
  }

  init() {    // needs to be called each time a level is re-started
    // different level numbers should have different behavior
    this.player = new Player(this);
  }

  run() {
    this.render();
    this.player.run();
  }

  render() {
    // draw whatever
    // here is some place holder
    var context = this.game.context;
    context.save();
    // draw a gray background
    context.fillStyle = 'rgb(255, 236, 162)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    // draw the level text
    var levelText = ["Zero", "One", "Two","Three"];
    context.fillStyle = 'rgb(55, 36, 2)';
    context.font = "48px sans-serif";
    context.fillText("Level " + levelText[this.number], 250,300);
    context.restore();
  }

}
