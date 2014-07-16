require.config({
  paths: {
    'snake': 'modules/snake',
    'field': 'modules/field',
    'score': 'modules/score',
    'input': 'modules/input-handler',
    'food': 'modules/food'
  }
});

require(['snake', 'field', 'input', 'food'], function(snake, field, input, food) {

  var socket = new io('http://localhost:3000'),
      socketID = null,
      gameID = null,
      canvasCtx = $('canvas')[0].getContext('2d');

  socket.on('connect', function() {
    socketID = socket.io.engine.id;
    initGameHandlers();
  });

  socket.on('start', function() {
    startGame();
  });

  socket.on('render', function(data) {
    var snake = JSON.parse(data).snakeData;

    canvasCtx.fillStyle = '#ff0000';

    for (var i = snake.length - 1; i >= 0; i-=1) {
      canvasCtx.fillRect(snake[i].x, snake[i].y, 10, 10);
    }

  });

  function initGameHandlers() {
    $('#create-game').on('click', function() {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/createGame',
        contentType: 'application/json',
        data: JSON.stringify({
          playerName: $('#username').val(),
          socketId: socketID
        })
      }).done(function(data) {
        gameID = data.gameId;
        console.log(data);
      });
    });

    $("#join-game").on("click", function() {
      gameID = $("#game-id").val();
      $.ajax({
        url: "http://localhost:3000/joinGame",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          playerName: $("#username").val(),
          socketId: socketID,
          gameId: gameID
          })
        }).done(function(result) {
          console.log(result);
        });
    });
  }

  function startGame() {
    var canvas = document.getElementById('game'),
        ctx = canvas.getContext('2d');

    $('.hidden').removeClass('hidden');
    $('#game-options').addClass('hidden');
    $('body').addClass('grass-background');

    window.addEventListener('keydown', input.handleInput, false);
    field.setBounds(canvas.width, canvas.height);
    snake.init(5, 10, canvas.width/2, canvas.height/2);

    setInterval(function() {
      field.draw(ctx);
      food.generate(ctx, 10);
      snake.update(ctx);

      socket.emit('move', JSON.stringify({
        gameId: gameID,
        snakeData: snake.getSnake()
      }));

    }, 100);
  }

});
