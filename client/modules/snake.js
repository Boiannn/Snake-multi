define(function() {
  'use strict';

  var bodySize = 10,
      bodyLength = 3,
      directions = ['up', 'right', 'down', 'left'];

  function createSnakeBody(length, startX, startY, dir) {
    var body = [],
        offset = dir === 'left' ? -1 : 1;

    for (var i = 0; i < length; i+=1) {
      body.push({
        x: startX + (i * bodySize * offset),
        y: startY
      });
    }

    return body;
  }

  function isValidDirection(dir) {
    if (typeof dir !== 'string') {
      return false;
    }

    if (directions.indexOf(dir) < 0) {
      return false;
    }

    if (dir === 'left' && this.getDirection() === 'right') {
      return false;
    }

    if (dir === 'right' && this.getDirection() === 'left') {
      return false;
    }

    if (dir === 'up' && this.getDirection() === 'down') {
      return false;
    }

    if (dir === 'down' && this.getDirection() === 'up') {
      return false;
    }

    return true;
  }

  function Snake(startX, startY, direction) {
    this._size = bodySize;
    this._body = createSnakeBody(bodyLength, startX, startY, direction);
    this._direction = direction || 'right';
    this.isAlive = true;
  }

  Snake.prototype.getHead = function getHead() {
    return {
      x: this._body[this._body.length - 1].x,
      y: this._body[this._body.length - 1].y
    };
  };

  Snake.prototype.getBody = function getBody() {
    return this._body.slice();
  };

  Snake.prototype.getSize = function getSize() {
    return this._size;
  };

  Snake.prototype.getDirection = function getDirection() {
    return this._direction;
  };

  Snake.prototype.setDirection = function setDirection(newDirection) {
    if (isValidDirection.call(this, newDirection)) {
      this._direction = newDirection;
    }
  };

  Snake.prototype.move = function move() {
    var head = this.getHead(),
        newHead = this._body.shift();

    if (this._direction === 'left') {
      newHead.x = head.x - bodySize;
      newHead.y = head.y;
    } else if (this._direction === 'up') {
      newHead.x = head.x;
      newHead.y = head.y - bodySize;
    } else if (this._direction === 'right') {
      newHead.x = head.x + bodySize;
      newHead.y = head.y;
    } else if (this._direction === 'down') {
      newHead.x = head.x;
      newHead.y = head.y + bodySize;
    }

    this._body.push(newHead);
  };

  Snake.prototype.grow = function grow() {
    this._body.unshift(this.getHead());
  };

  Snake.prototype.isEatingItself = function isEatingItself() {
    // Cycle over all the segments of the snake
    // but the last last one since it is the
    // actual head and its coordinates will always be equal
    var head = this.getHead();

    for (var i = 0; i < this._body.length - 1; i+=1) {
      if (this._body[i].x === head.x && this._body[i].y === head.y) {
        return true;
      }
    }

    return false;
  };

  return Snake;

});
