define(function() {
  'use strict';

  var brickSize = 20;

  var field = {
    init: function(width, height) {
      this.width = width;
      this.height = height;
      this.leftBoundary = brickSize;
      this.topBoundary = brickSize;
      this.rightBoundary = (width - brickSize);
      this.bottomBoundary = (height - brickSize);
      return this;
    },
    draw: function (ctx) {
      var bricksPerWall = this.width / brickSize,
          x = 0,
          y = 0;

      ctx.fillStyle = '#78c355';
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = '#b6482f';
      ctx.stokeStyle = '#612619';

      // vertical walls
      for (var i = 0; i < bricksPerWall; i += 1) {
        ctx.fillRect(0, y, brickSize, brickSize);
        ctx.strokeRect(0, y, brickSize, brickSize);

        ctx.fillRect(this.width - brickSize, y, brickSize, brickSize);
        ctx.strokeRect(this.width - brickSize, y, brickSize, brickSize);
        y += brickSize;
      }

      // horizontal wall
      for (var j = 0; j < bricksPerWall; j += 1) {
        ctx.fillRect(x, 0, brickSize, brickSize);
        ctx.strokeRect(x, 0, brickSize, brickSize);

        ctx.fillRect(x, this.height - brickSize, brickSize, brickSize);
        ctx.strokeRect(x, this.height - brickSize, brickSize, brickSize);
        x += brickSize;
      }
    }
  };

  return field;

});
