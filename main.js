function generateNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
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

  // Start spinning
  btn.disabled = true;
  drum.classList.add('spinning');
  drumStatus.textContent = '추첨 중...';
  drumStatus.classList.add('drawing');
  results.innerHTML = '';

  // Pre-generate all numbers during spin
  const allNumbers = Array.from({ length: count }, generateNumbers);

  await delay(1600);

  // Stop spinning
  drum.classList.remove('spinning');
  drumStatus.classList.remove('drawing');
  drumStatus.textContent = '🎉 당첨 번호!';

  // Reveal each game
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

    // Stagger ball pop-in
    const balls = ballsDiv.querySelectorAll('.ball');
    balls.forEach((ball, idx) => {
      setTimeout(() => ball.classList.add('reveal'), idx * 160);
    });

    // Wait for all balls in this game before the next game
    await delay(160 * 6 + 80);
  }

  await delay(300);
  btn.disabled = false;
  drumStatus.textContent = '🎱';
}
