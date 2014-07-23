require.config({
  paths: {
    'snake': 'modules/snake',
    'field': 'modules/field',
    'food': 'modules/food',
    'engine': 'modules/engine'
  }
});

require(['snake', 'field', 'food', 'engine'], function(Snake, field, food, engine) {

  var canvas = document.getElementById('playing-field'),
      canvasCtx = canvas.getContext('2d'),
      socket = new io('http://localhost:3000'),
      socketId = null,
      gameId = null,
      hostId = null,
      hostSnake = new Snake(canvas.width / 2, canvas.height / 2, 'right'),
      partnerSnake = new Snake(canvas.width / 2, canvas.height / 2, 'left'),
      playingField = Object.create(field).init(canvas.width, canvas.height);

  socket.on('connect', function() {
    socketId = socket.io.engine.id;
    initGameLobby();
  });

  socket.on('start', function(data) {
    hostId = data.hostId;
    startGame();
  });

  socket.on('render', function(data) {
    if (data.type === 'gameInfo') {
      playingField.draw(canvasCtx);
      drawSnake(JSON.parse(data.hostSnakeBody), '#186600');
      drawSnake(JSON.parse(data.partnerSnakeBody), '#661833');
      drawFood(JSON.parse(data.foodPos), '#cec');
    }

    if (data.type === 'newDirection') {
      partnerSnake.setDirection(data.direction);
    }
  });

  function initGameLobby() {
    $('#create-game').on('click', function() {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/createGame',
        contentType: 'application/json',
        data: JSON.stringify({
          playerName: $('#username').val(),
          socketId: socketId
        })
      }).done(function(data) {
        gameId = data.gameId;
        console.log(data);
      });
    });

    $("#join-game").on("click", function() {
      gameId = $("#game-id").val();
      $.ajax({
        url: "http://localhost:3000/joinGame",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          playerName: $("#username").val(),
          socketId: socketId,
          gameId: gameId
          })
        }).done(function(result) {
          console.log(result);
        });
    });
  }

  function startGame() {
    $('.hidden').removeClass('hidden');
    $('#game-options').addClass('hidden');
    $('body').addClass('grass-background');

    window.addEventListener('keydown', handleInput, false);

    if (socketId === hostId) {
      food.generate();
      engine.init([hostSnake, partnerSnake], food, playingField);
    }

    setInterval(gameLoop, 500);
  }

  function gameLoop() {
    // Only the host updates the game
    if (socketId === hostId) {
      engine.update();

      socket.emit('move', {
        type: 'gameInfo',
        gameId: gameId,
        hostSnakeBody: JSON.stringify(hostSnake.getBody()),
        partnerSnakeBody: JSON.stringify(partnerSnake.getBody()),
        foodPos: JSON.stringify(food.position)
      });
    }
  }

  function drawSnake(snake, color) {
    canvasCtx.fillStyle = color;

    snake.forEach(function(segment) {
      canvasCtx.fillRect(segment.x, segment.y, 10, 10);
    });
  }

  function drawFood(food, color) {
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(food.x, food.y, 10, 10);
  }

  function handleInput(ev) {
    // left - 37, up - 38
    // right - 39, down - 40
    var direction = '';

    if (ev.keyCode === 37) {
     direction = 'left';
    } else if (ev.keyCode === 38) {
      direction = 'up';
    } else if (ev.keyCode === 39) {
      direction = 'right';
    } else if (ev.keyCode === 40) {
      direction = 'down';
    }

    if (socketId === hostId) {
      hostSnake.setDirection(direction);
    } else {
      socket.emit('move', {
        type: 'newDirection',
        gameId: gameId,
        direction: direction
      });
    }
  }

});
