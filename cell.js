'use strict'

class Cell {
  constructor(game, location, id) {
    this.game = game;
    this.loc = location;
    this.occupied = false;
    this.neighbors = [];
    this.id = id;
    this.value = -1;
    this.vec = new JSVector(0,0);
    this.row = game.canvas.width/game.cols;
    this.col = game.canvas.height/game.rows;
  }

  render(){
    //  draw a rectangle at location
    if(this.occupied){
      this.game.context.fillStyle = 'black';
    } else{
      this.game.context.fillStyle="#AABBAA";
      // this.game.context.strokeStyle="#001122";
    }
    this.game.context.fillRect(this.loc.x, this.loc.y, this.game.cellDim, this.game.cellDim);
    this.game.context.strokeRect(this.loc.x, this.loc.y, this.game.cellDim, this.game.cellDim);
    this.game.context.fillStyle = 'white';
    this.game.context.fillText(this.id, this.loc.x +12, this.loc.y+10);
    this.game.context.fillStyle = 'black';
    this.game.context.fillText(this.value, this.loc.x + 12, this.loc.y+25);
  }

  addNeighbors(c, r){
    var grid  = this.game.grid;
    // North
    if(this.row > 0 && !grid[c][r-1].occupied){  // find north
      this.neighbors.push(grid[c][r-1]);
    }

    /*
    **  Start here and simplify your code !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    **
    **
    */
    if(this.row < 32 && this.game.grid[this.col][this.row].occupied == 1){  // find north
      s = this.game.grid[this.col][this.row+1];
      this.neighbors.push(s);
    }
    if(this.col > 0 && this.game.grid[this.col][this.row].occupied == 1){  // find north
      w = this.game.grid[this.col][this.row];
      this.neighbors.push(w);
    }
    if(this.col < 36 && this.game.grid[this.row][this.col].occupied == 1){  // find north
      e = this.game.grid[this.row][this.col];
      this.neighbors.push(e);
    }

  }

}
//addNeighbors();
