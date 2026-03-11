const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const coin = document.getElementById('coin');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('overlay');
const result = document.getElementById('result');
const restartButton = document.getElementById('restart');

const playerSize = 26;
const coinSize = 26;
const step = 14;
const totalTime = 30;

let playerPos = { x: 10, y: 10 };
let coinPos = { x: 200, y: 120 };
let score = 0;
let timeLeft = totalTime;
let timerId;
let playing = false;

function getBounds() {
  return {
    width: gameArea.clientWidth,
    height: gameArea.clientHeight,
  };
}

function render() {
  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;
  coin.style.left = `${coinPos.x}px`;
  coin.style.top = `${coinPos.y}px`;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
}

function randomPosition(size) {
  const { width, height } = getBounds();
  return {
    x: Math.floor(Math.random() * Math.max(1, width - size)),
    y: Math.floor(Math.random() * Math.max(1, height - size)),
  };
}

function moveCoin() {
  coinPos = randomPosition(coinSize);
}

function isColliding() {
  return (
    playerPos.x < coinPos.x + coinSize &&
    playerPos.x + playerSize > coinPos.x &&
    playerPos.y < coinPos.y + coinSize &&
    playerPos.y + playerSize > coinPos.y
  );
}

function handleKeydown(event) {
  if (!playing) return;

  const { width, height } = getBounds();
  switch (event.key) {
    case 'ArrowUp':
      playerPos.y = Math.max(0, playerPos.y - step);
      break;
    case 'ArrowDown':
      playerPos.y = Math.min(height - playerSize, playerPos.y + step);
      break;
    case 'ArrowLeft':
      playerPos.x = Math.max(0, playerPos.x - step);
      break;
    case 'ArrowRight':
      playerPos.x = Math.min(width - playerSize, playerPos.x + step);
      break;
    default:
      return;
  }

  event.preventDefault();

  if (isColliding()) {
    score += 1;
    moveCoin();
  }

  render();
}

function endGame() {
  playing = false;
  clearInterval(timerId);
  result.textContent = `Time's up! Final score: ${score}`;
  overlay.classList.remove('hidden');
}

function startGame() {
  const { width, height } = getBounds();
  playerPos = {
    x: Math.floor((width - playerSize) / 2),
    y: Math.floor((height - playerSize) / 2),
  };
  moveCoin();
  score = 0;
  timeLeft = totalTime;
  playing = true;
  overlay.classList.add('hidden');

  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      render();
      endGame();
      return;
    }
    render();
  }, 1000);

  render();
}

window.addEventListener('keydown', handleKeydown);
restartButton.addEventListener('click', startGame);
window.addEventListener('resize', () => {
  const { width, height } = getBounds();
  playerPos.x = Math.min(playerPos.x, width - playerSize);
  playerPos.y = Math.min(playerPos.y, height - playerSize);
  coinPos.x = Math.min(coinPos.x, width - coinSize);
  coinPos.y = Math.min(coinPos.y, height - coinSize);
  render();
});

startGame();
