// ─── State ────────────────────────────────────────────────
let requiredNumbers = [];
let excludedNumbers = [];

// ─── Lotto Logic ──────────────────────────────────────────
function generateNumbers() {
  // Start with required numbers (capped at 6)
  const numbers = [...requiredNumbers.slice(0, 6)];

  // Pool: 1~45 excluding already-included required & excluded numbers
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter(n => !requiredNumbers.includes(n) && !excludedNumbers.includes(n));

  while (numbers.length < 6 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    numbers.push(pool.splice(idx, 1)[0]);
  }

  return numbers.sort((a, b) => a - b);
}

function getBallClass(num) {
  if (num <= 10) return 'yellow';
  if (num <= 20) return 'blue';
  if (num <= 30) return 'red';
  if (num <= 40) return 'gray';
  return 'green';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateLotto() {
  const btn = document.getElementById('generateBtn');
  const drum = document.getElementById('drum');
  const drumStatus = document.getElementById('drumStatus');
  const count = parseInt(document.getElementById('count').value, 10);
  const results = document.getElementById('results');

  btn.disabled = true;
  drum.classList.add('spinning');
  drumStatus.textContent = '추첨 중...';
  drumStatus.classList.add('drawing');
  results.innerHTML = '';

  const allNumbers = Array.from({ length: count }, generateNumbers);

  await delay(1600);

  drum.classList.remove('spinning');
  drumStatus.classList.remove('drawing');
  drumStatus.textContent = '🎉 당첨 번호!';

  for (let i = 0; i < count; i++) {
    const numbers = allNumbers[i];

    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.style.animationDelay = `${i * 40}ms`;

    const label = document.createElement('span');
    label.className = 'game-label';
    label.textContent = `${i + 1}게임`;

    const ballsDiv = document.createElement('div');
    ballsDiv.className = 'balls';

    numbers.forEach(num => {
      const ball = document.createElement('span');
      ball.className = `ball ${getBallClass(num)}`;
      ball.textContent = num;
      ballsDiv.appendChild(ball);
    });

    gameDiv.appendChild(label);
    gameDiv.appendChild(ballsDiv);
    results.appendChild(gameDiv);

    const balls = ballsDiv.querySelectorAll('.ball');
    balls.forEach((ball, idx) => {
      setTimeout(() => ball.classList.add('reveal'), idx * 160);
    });

    await delay(160 * 6 + 80);
  }

  await delay(300);
  btn.disabled = false;
  drumStatus.textContent = '🎱';
}

// ─── Modal ────────────────────────────────────────────────
function initBallGrids() {
  ['required', 'exclude'].forEach(type => {
    const grid = document.getElementById(`${type}BallGrid`);
    for (let i = 1; i <= 45; i++) {
      const ball = document.createElement('div');
      ball.className = `modal-ball ${getBallClass(i)}`;
      ball.textContent = i;
      ball.dataset.num = i;
      ball.onclick = () => ball.classList.toggle('selected');
      grid.appendChild(ball);
    }
  });
}

function openOptionsModal() {
  syncBallGrid('required', requiredNumbers);
  syncBallGrid('exclude', excludedNumbers);
  document.getElementById('optionsModal').classList.add('open');
}

function syncBallGrid(type, applied) {
  document.querySelectorAll(`#${type}BallGrid .modal-ball`).forEach(ball => {
    ball.classList.toggle('selected', applied.includes(parseInt(ball.dataset.num)));
  });
}

function closeOptionsModal() {
  document.getElementById('optionsModal').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('optionsModal')) closeOptionsModal();
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && tab === 'required') || (i === 1 && tab === 'exclude'));
  });
  document.getElementById('tab-required').classList.toggle('active', tab === 'required');
  document.getElementById('tab-exclude').classList.toggle('active', tab === 'exclude');
}

function applyRequired() {
  requiredNumbers = Array.from(
    document.querySelectorAll('#requiredBallGrid .modal-ball.selected')
  ).map(b => parseInt(b.dataset.num)).sort((a, b) => a - b);

  const info = document.getElementById('requiredInfo');
  info.textContent = requiredNumbers.length > 0
    ? `필수 번호 포함: ${requiredNumbers.join(', ')}`
    : '';

  closeOptionsModal();
}

function applyExclude() {
  excludedNumbers = Array.from(
    document.querySelectorAll('#excludeBallGrid .modal-ball.selected')
  ).map(b => parseInt(b.dataset.num)).sort((a, b) => a - b);

  const info = document.getElementById('excludeInfo');
  info.textContent = excludedNumbers.length > 0
    ? `제외 번호: ${excludedNumbers.join(', ')}`
    : '';

  closeOptionsModal();
}

// ─── Init ─────────────────────────────────────────────────
initBallGrids();
