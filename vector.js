//// Vector Class
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(vector) {
  return new Vector(this.x + vector.x, this.y + vector.y);
};

export {Vector};
