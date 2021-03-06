define(['field'], function(field) {
  'use strict';

  var food = {},
      size = 10,
      foodColor = '#ddccaa',
      foodAvailable = false;

  function generate(canvasCtx) {
      // trying to simulate a 10x10 grid
      // thats is why I want the food to
      // appear at coordinates divisible by 10
      food.x = getRandomInt(3, 46) * size;
      food.y = getRandomInt(3, 46) * size;
      foodAvailable = true;
  }

  function eatFood() {
    foodAvailable = false;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() *
      (max - min + 1)) + min;
  }

  return {
    position: food,
    generate: generate,
    eat: eatFood,
    size: size
  };

});
