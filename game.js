document.addEventListener('DOMContentLoaded', function () {
  const app = document.getElementById('app');
  const modal = document.getElementById('winner-modal');
  const winnerMessage = document.getElementById('winner-message');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let playing = false;
  let gameMode = null;

  function renderMenu() {
    app.innerHTML = `
      <div class="menu">
        <h1>🌸 Tic Tac Toe</h1>
        <p class="subtitle">Choose your game mode and enjoy!!!</p>
        <button onclick="startGame('pvp')">👫 Player vs Player</button>
        <button onclick="startGame('bot')">🤖 Player vs Bot</button>
      </div>
    `;
    playing = false;
  }

  function renderBoard() {
    let boardHTML = '<p><strong>' + (currentPlayer === 'X' ? 'Player 1' : gameMode === 'bot' ? 'Bot' : 'Player 2') + '\'s Turn</strong></p>';
    boardHTML += '<div class="board">';
    board.forEach((cell, i) => {
      boardHTML += `<div class="cell" data-idx="${i}">${cell || ''}</div>`;
    });
    boardHTML += '</div>';
    boardHTML += `<button onclick="resetToMenu()">Restart</button>`;
    app.innerHTML = boardHTML;

    document.querySelectorAll('.cell').forEach(cell => {
      cell.addEventListener('click', function () {
        const idx = parseInt(cell.getAttribute('data-idx'));
        if (!playing || board[idx]) return;

        board[idx] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        renderBoard();
        checkWinner();

        if (gameMode === 'bot' && currentPlayer === 'O' && playing) {
          setTimeout(botMove, 500);
        }
      });
    });
  }

  function botMove() {
    const empty = board.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O';
    currentPlayer = 'X';
    renderBoard();
    checkWinner();
  }

  function checkWinner() {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        showWinner((board[a] === 'X' ? 'Player 1' : gameMode === 'bot' ? 'Bot' : 'Player 2') + ' wins! 🎉');
        playing = false;
        return;
      }
    }
    if (!board.includes(null)) {
      showWinner("It's a draw! 🤝");
      playing = false;
    }
  }

  function showWinner(msg) {
    winnerMessage.textContent = msg;
    modal.classList.remove('hidden');
  }

  window.resetToMenu = function () {
    modal.classList.add('hidden');
    board = Array(9).fill(null);
    renderMenu();
  };

  window.startGame = function (mode) {
    gameMode = mode;
    playing = true;
    board = Array(9).fill(null);
    currentPlayer = 'X';
    renderBoard();
  };

  renderMenu();
});
