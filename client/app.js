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
      gameID = null;

  socket.on('connect', function() {
    socketID = socket.io.engine.id;
    initGameHandlers();
  });

  socket.on('start', function() {
    startGame();
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
    }, 100);
  }

});
