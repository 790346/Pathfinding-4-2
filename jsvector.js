
var JSVector = function(x, y){
     this.x = x || 0; //(0 if no parameter is passed)
     this.y = y || 0; //(0 if no parameter is passed)
}

JSVector.prototype.add = function(vec){
  this.x += vec.x;
  this.y += vec.y;
}

JSVector.prototype.getDirection = function() {
  // atan2 takes values above PI or -PI radians??
	return Math.atan2(this.y, this.x);
};


// return the magnitude of the vector
JSVector.prototype.getMagnitude = function() {
	// Use the distance formuls
  //  Assume one pont has coords (0, 0)
  var x2  = this.x * this.x;
  var y2  = this.y * this.y;
	return Math.sqrt(x2 + y2);
};


// set the direction of the vector in radians
// input  = desired andgle
JSVector.prototype.setDirection = function(newAngle) {
	var magnitude = this.getMagnitude();
  this.x = Math.cos(newAngle) * magnitude;// keep magnitude
  this.y = Math.sin(newAngle) * magnitude;// keep magnitude
};

// set the magnitude of the vector
JSVector.prototype.setMagnitude = function(mag) {
  var dir = this.getDirection();
	this.x = Math.cos(dir) * mag;
	this.y = Math.sin(dir) * mag;
};
