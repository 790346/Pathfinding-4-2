'use strict'

// wait for the window to load and than call back setup()
window.addEventListener('load', setup, false);

var game;   // the global game object
const FRAME_RATE=30;

function setup() {
  game = new Game();
  window.setTimeout(draw, 100);    // wait 100ms for resources to load then start draw loop
}

function draw() {   // the animation loop
  game.run();
  window.setTimeout(draw, 1000/FRAME_RATE);  // come back here every interval
}

// Game is the top level object and it contains the levels
class Game {
  constructor() {   // from setup()
    //  Game elements
    this.enemies = [];
    this.menuTileDivs = this.createMenuTileDivs();
    this.infoTileDivs = this.loadInfoTileArray();


    this.id = 0;
    this.mouseX;
    this.mouseY;
    this.mouseObj = new JSVector(this.mouseX, this.mouseY);
    this.grid = [];
    this.goal = null;
    this.neighbors = [];

    //  create the canvas
    this.canvas =  document.getElementById('gameCanvas');
    if (!this.canvas || !this.canvas.getContext)
    throw "No valid canvas found!";
    this.canvas.addEventListener("click", handleCanvasMouseClick, false);
    //  create the context
    this.context = this.canvas.getContext("2d");
    if(!this.context)
    throw "No valid context found!";

    this.cellDim = 50;
    this.cols = this.canvas.width/this.cellDim;  //36;
    this.rows = this.canvas.height/this.cellDim;;
    //  add levels to levels array
    this.levels = [];
    this.numLevels = 1;     // for now
    this.currentLevel = 1;
    for(let i = 0; i < this.numLevels; i++)
    this.levels.push(new Level(this, i+1));

    // set call backs
    //this.menuTileDivs = this.createMenuTileDivs();
    this.loadGrid();
    this.loadNumbers();
  }
  run() {       // called from draw()

    this.render();
    //this.levels[this.currentLevel-1].run();  // run the current level

  }
  render() {    // draw whatever
    this.drawGrid();

  }
  //++++++++++++++++++++++++++++++++++++++++  constructor calls
  createMenuTileDivs(){
    var tiles = [];
    for(var i = 0; i < 5; i++){
      var mtd = document.createElement("div");
      // getimage for tiles and bullets
      var cnvTurImgPath = "images/towers/d" + i + ".png";  // small tower image for canvas
      var cnvBulImgPath = "images/bullets/b" + i + ".png";     // bullet image for canvas
      var imgName = 'images/towers/tow' + i + '.png'; // large image for menu tile


      mtd.cnvTurImg = new Image();
      mtd.cnvTurImg.addEventListener('load',this.hideImgElement,false);
      mtd.cnvTurImg.addEventListener('error', function() { console.log(cnvTurImgPath + " failed to load"); }, false);
      mtd.cnvTurImg.src = cnvTurImgPath;    // start loading image

      mtd.cnvBulImg = new Image();
      mtd.cnvBulImg.addEventListener('load',this.hideImgElement,false);
      mtd.cnvBulImg.addEventListener('error', function() { console.log(cnvBulImgPath + " failed to load"); }, false);
      mtd.cnvBulImg.src = cnvBulImgPath;    // start loading image

      document.getElementById("menuDiv").appendChild(mtd);

      mtd.cost = 100*i +50;
      mtd.id = 'towDiv ' + i;
      //  Adding menu tile styles
      mtd.style.float = 'left';
      mtd.style.marginLeft = "90px";
      mtd.style.margintop = "12px";
      mtd.style.border = "solid";
      //mtd.style.border = "3px";
      mtd.style.borderRadius = "50%";
      mtd.style.width = "90px";
      mtd.style.height = "90px";
      //mtd.setClass = "menuTile";
      mtd.style.background = "pink";

      tiles.push(mtd);

      var tImg = new Image();
      tImg.addEventListener('error', function() { console.log(imgName + " failed to load"); }, false);
      tImg.src = imgName;
      mtd.addEventListener("mouseover", handleTileMouseOver, false);
      mtd.addEventListener("mouseout", handleTileMouseOut, false);
      mtd.addEventListener("mousedown", handleTileMouseDown, false);
      mtd.appendChild(tImg);

    }
    return tiles;
  }
  // load nfo tiles into array and style info tiles
  loadInfoTileArray(){
    var infoTiles = document.getElementsByClassName("infoTileDiv");
    //style infoTiles
    for(let i = 0; i < infoTiles.length; i++){
      infoTiles[i].style.width = "90px";
      infoTiles[i].style.height = "90px";
      infoTiles[i].style.backgroundColor = "white";
      infoTiles[i].style.border = "solid black 2px";
      infoTiles[i].style.borderRadius = "50%";
      infoTiles[i].style.marginTop = "50px";
      infoTiles[i].style.marginLeft = "3px";
    }
    return infoTiles;
  }

  loadNumbers(){
    var check = [];
    this.grid[0][0].value = 0;
    check.push(this.goal);
    while(check.length > 0){
      var curr = check.shift();
      var nbrs = curr.neighbors;

      for(let i = 0; i < nbrs.length; i++ ){
        n = nbrs[i];
        check.push(n);
        if(n.value === -1){
          n.value = curr.value + 1;
        }
      }

      //traverse neighbors, load all with value -1
      // asign neighbor value current +1

      // for(var i = 0; i < this.cols; i++){
      //   for(var j = 0; j < this.rows; j++){
      //     if(i > 0 && this.grid[i-1][j].occupied != -1){
      //       check.push(this.grid[i-1][j]);
      //     }
      //     else if(i < 35 && this.grid[i+1][j].occupied != -1){
      //       check.push(this.grid[i+1][j]);
      //     }
      //     else if(j > 0 && this.grid[i][j-1].occupied != -1){
      //       check.push(this.grid[i][j-1]);
      //     }
      //     else if(j < 31 && this.grid[i][j+1].occupied != -1){
      //       check.push(this.grid[i][j+1]);
      //     }
      //     for(var k = 0; i < check.length; k++){
      //       check[k].value = this.grid[i][j].value + 1;
      //       check.shift();
      //     }
      //   }
      // }
    }
  }

  loadGrid(){
    //  this.id = 0;
    //var n, e, s, w;
    for(var i = 0; i < this.cols; i++){     // columns of rows
      this.grid[i] = [];
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = new Cell(this, new JSVector((i*this.cellDim), (j*this.cellDim)), this.id);
        this.id += 1;
        if(this.grid[i][j] != this.root && Math.floor(Math.random()*100) < 15 ){
          this.grid[i][j].occupied = true;
        }
      }

    }
    for(var i = 0; i < this.cols; i++){     // columns of rows
      for(var j = 0; j < this.rows; j++){
        //this.grid[i][j].addNeighbors(i, j);
      }
    }

    this.start = this.grid[0][0];
    this.start.occupied = false;
    this.goal = this.grid[this.cols-1][this.rows-1];
    this.goal.occupied = false
    this.goal.value = 0;
  }
  //this.canvas.fillText(this.num.toString(), this.row*this.colWidth, this.col*this.colWidth);


  // ++++++++++++++++++++++++++++++++++++++++++++++  End LoadGrid
  drawGrid(){

    for(var i = 0; i < this.cols; i++){     // columns of rows
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j].render();
      }
    }

  }

  
  createTower(tower){
    this.towers.push(tower);
    game.currentTower = tower.id;
    console.log("CurrentTower:  " + tower.id);
  }
}//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  End Game Class


//  +++++++++++++++++++++++++++++++++  MenuTile events
function handleTileMouseDown(){

  if(game.placingTurret) return;
  game.placingTower = true;
  game.createTower(this);
}
function handleTileMouseOver(){
  this.style.background = "red";
}
function handleTileMouseOut(){
  this.style.background = "pink";
}
//  +++++++++++++++++++++++++++++++++++  Canvas Events
function handleCanvasMouseClick(){
  var mouseX = Math.floor(event.offsetX / game.colWidth);
  var mouseY = Math.floor(event.offsetY / game.colWidth);
  //this.mouseObj = new JSVector(mouseX, mouseY);
  if(game.grid[mouseX][mouseY].occupied == 1 || game.grid[mouseX][mouseY].occupied == -1)
  game.grid[mouseX][mouseY].occupied = -game.grid[mouseX][mouseY].occupied;
}
//
// function onClick(){
// //  if(mouseObj.loc.x)
// }
function Pathfinding(){

}
