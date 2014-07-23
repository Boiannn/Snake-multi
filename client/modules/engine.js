define(function() {
  'use strict';

  var SNAKES = [],
      FOOD = {},
      FIELD = {};

  function init(snakes, food, field) {
    SNAKES = snakes;
    FOOD = food;
    FIELD = field;
  }

  function update() {
    SNAKES.forEach(function(snake) {
      var head = snake.getHead();

      if (!isInFieldBounds(head) || snake.isEatingItself()) {
        snake.isAlive = false;
      }

      if (snakeEatsFood(head)) {
        FOOD.generate();
        snake.grow();
      }

      if (snake.isAlive) {
        snake.move();
      }
    });
  }

  function isInFieldBounds(head) {
    if (head.x <= FIELD.leftBoundary || head.x >= FIELD.rightBoundary - 10 ||
        head.y <= FIELD.topBoundary || head.y >= FIELD.bottomBoundary - 10) {
      return false;
    }

    return true;
  }

  function snakeEatsFood(head) {
    if (head.x === FOOD.position.x && head.y === FOOD.position.y) {
      return true;
    }

    return false;
  }

  return {
    init: init,
    update: update
  };
});
