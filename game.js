const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');
const winText = document.getElementById('win-text');

const CONFETTI_COLORS = ['#e94560','#53d769','#f5c542','#4fc3f7','#ce93d8','#ff8a65','#fff'];
let confettiPieces = [];
let confettiRunning = false;

function resizeOverlay() {
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;
}
resizeOverlay();
window.addEventListener('resize', resizeOverlay);

function spawnConfetti() {
  confettiPieces = [];
  const upward = selectedCharacter === 2;
  const isCat = selectedCharacter === 4;
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: isCat ? Math.random() * overlay.width : Math.random() * overlay.width,
      y: isCat
        ? Math.random() * overlay.height
        : upward
          ? overlay.height + Math.random() * overlay.height
          : Math.random() * -overlay.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: selectedCharacter === 1 ? '#111' : CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vy: isCat ? (Math.random() - 0.5) * 8 : upward ? -(2 + Math.random() * 4) : 2 + Math.random() * 4,
      vx: isCat ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 3,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      opacity: 1,
    });
  }
}

function animateConfetti() {
  if (!confettiRunning) return;
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

  const isCat = selectedCharacter === 4;
  let alive = false;
  for (const p of confettiPieces) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;

    if (isCat) {
      if (p.x <= 0 || p.x >= overlay.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= overlay.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(overlay.width, p.x));
      p.y = Math.max(0, Math.min(overlay.height, p.y));
      p.opacity -= 0.002;
      if (p.opacity > 0) alive = true;
    } else {
      if (p.y > -20 && p.y < overlay.height + 20) alive = true;
    }

    overlayCtx.save();
    overlayCtx.globalAlpha = Math.max(0, p.opacity);
    overlayCtx.translate(p.x, p.y);
    overlayCtx.rotate(p.rot);
    overlayCtx.fillStyle = p.color;
    overlayCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    overlayCtx.restore();
  }

  if (alive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
  }
}

let waitingForDismiss = false;

function returnToMenu() {
  if (!waitingForDismiss) return;
  waitingForDismiss = false;
  confettiRunning = false;
  exitFlashTimer = 0;
  if (exitFlashRAF) { cancelAnimationFrame(exitFlashRAF); exitFlashRAF = null; }
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
  winText.classList.remove('visible');
  caughtText.classList.remove('visible');
  finalScore.classList.remove('visible');
  scoreDisplay.classList.remove('visible');
  menu.classList.remove('hidden');
  if (lastGameWasRandom) {
    syncStateFromMenu();
    lastGameWasRandom = false;
  }
}

function showWin() {
  gameOver = true;
  stopMonsters();
  draw();
  winText.classList.add('visible');
  finalScore.textContent = `Score: ${scorePercent()}%`;
  finalScore.classList.add('visible');
  confettiRunning = true;
  spawnConfetti();
  animateConfetti();
  waitingForDismiss = true;
}

let TILE = 40;
const WALL_COLOR = '#0d1426';
const FLOOR_COLOR = '#0f3460';
const PLAYER_COLOR = '#e94560';
const EXIT_COLOR = '#53d769';

let selectedCharacter = 0;
let lastGameWasRandom = false;

const settings = { size: 'small', loops: 'some', visibility: 'normal' };

function setSetting(key, value, btn) {
  settings[key] = value;
  btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectCharacter(index, btn) {
  selectedCharacter = index;
  document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function initCharacterSelect() {
  const container = document.getElementById('char-select');
  characters.forEach((char, i) => {
    if (char.secret) return;
    const btn = document.createElement('button');
    btn.className = 'char-btn' + (i === 0 ? ' selected' : '');
    btn.onclick = () => selectCharacter(i, btn);
    const cvs = document.createElement('canvas');
    cvs.width = 48;
    cvs.height = 48;
    btn.appendChild(cvs);
    const label = document.createElement('span');
    label.textContent = char.name;
    btn.appendChild(label);
    container.appendChild(btn);
    const c = cvs.getContext('2d');
    c.fillStyle = FLOOR_COLOR;
    c.fillRect(0, 0, 48, 48);
    char.draw(c, 24, 26, 14);
  });
}

function syncStateFromMenu() {
  function selectedTextForGroup(labelText) {
    const groups = Array.from(document.querySelectorAll('#menu .setting-group'));
    const group = groups.find(g => (g.querySelector('label')?.textContent || '').trim() === labelText);
    const btn = group?.querySelector('.setting-buttons .opt-btn.selected');
    return (btn?.textContent || '').trim();
  }

  const sizeTxt = selectedTextForGroup('Size').toLowerCase();
  if (sizeTxt) settings.size = sizeTxt;

  const loopsTxt = selectedTextForGroup('Extra Paths').toLowerCase();
  if (loopsTxt) settings.loops = loopsTxt;

  const visTxt = selectedTextForGroup('Visibility').toLowerCase();
  if (visTxt) settings.visibility = visTxt;

  const speedTxt = selectedTextForGroup('Monster Speed').toLowerCase();
  if (speedTxt === 'slow') monsterSpeed = 600;
  else if (speedTxt === 'normal') monsterSpeed = 400;
  else if (speedTxt === 'fast') monsterSpeed = 200;

  const monstersTxt = selectedTextForGroup('Monsters');
  const parsedCount = parseInt(monstersTxt, 10);
  if (!Number.isNaN(parsedCount)) monsterCount = parsedCount;

  const selectedCharName = (document.querySelector('#char-select .char-btn.selected span')?.textContent || '').trim();
  if (selectedCharName) {
    const idx = characters.findIndex(c => c.name === selectedCharName);
    if (idx >= 0) selectedCharacter = idx;
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMaze(cols, rows, loopPercent) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
  const stack = [[1, 1]];
  grid[1][1] = 0;

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const dirs = shuffle([[0, -2], [0, 2], [-2, 0], [2, 0]]);
    let carved = false;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0;
        grid[ny][nx] = 0;
        stack.push([nx, ny]);
        carved = true;
        break;
      }
    }
    if (!carved) stack.pop();
  }

  if (loopPercent > 0) {
    const candidates = [];
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (grid[r][c] !== 1) continue;
        const vertical = r > 1 && r < rows - 2 && grid[r - 1][c] === 0 && grid[r + 1][c] === 0;
        const horizontal = c > 1 && c < cols - 2 && grid[r][c - 1] === 0 && grid[r][c + 1] === 0;
        if (vertical || horizontal) candidates.push([r, c]);
      }
    }
    shuffle(candidates);
    const count = Math.floor(candidates.length * loopPercent);
    for (let i = 0; i < count; i++) {
      grid[candidates[i][0]][candidates[i][1]] = 0;
    }
  }

  const minDist = Math.floor(cols * 0.25);
  const wallCandidates = [];
  const adjDirs = [[0,-1],[0,1],[-1,0],[1,0]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1) continue;
      const hasFloorNeighbor = adjDirs.some(([dc, dr]) => {
        const nr = r + dr, nc = c + dc;
        return nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0;
      });
      if (!hasFloorNeighbor) continue;
      const dx = c - 1, dy = r - 1;
      if (Math.sqrt(dx * dx + dy * dy) >= minDist) {
        wallCandidates.push([r, c]);
      }
    }
  }
  const exit = wallCandidates[Math.floor(Math.random() * wallCandidates.length)];
  grid[exit[0]][exit[1]] = 2;

  return grid;
}

let maze = null;
let ROWS = 0;
let COLS = 0;
const player = { x: 1, y: 1 };
let lightRadius = 3;
const menu = document.getElementById('menu');

function randomGame() {
  lastGameWasRandom = true;
  const sizes = ['small', 'medium', 'large'];
  const loops = ['few', 'some', 'lots'];
  const visibilities = ['bright', 'normal', 'dark'];
  const speeds = [600, 400, 200];
  const monsterCounts = [1, 2, 3, 4, 5];

  settings.size = sizes[Math.floor(Math.random() * sizes.length)];
  settings.loops = loops[Math.floor(Math.random() * loops.length)];
  settings.visibility = visibilities[Math.floor(Math.random() * visibilities.length)];
  monsterSpeed = speeds[Math.floor(Math.random() * speeds.length)];
  monsterCount = monsterCounts[Math.floor(Math.random() * monsterCounts.length)];
  const secretIdx = characters.findIndex(c => c.secret);
  selectedCharacter = secretIdx >= 0 ? secretIdx : 0;

  startGame();
}

function startGame() {
  const sizeMap = { small: 13, medium: 21, large: 29 };
  const loopMap = { few: 0.15, some: 0.2, lots: 0.25 };
  const visMap = { bright: 5, normal: 3, dark: 2 };

  const sizeBoost = { small: 0.15, medium: 0.05, large: 0 };
  const loopPct = (loopMap[settings.loops] || 0) + (sizeBoost[settings.size] || 0);
  const dim = sizeMap[settings.size];
  maze = generateMaze(dim, dim, loopPct);
  ROWS = maze.length;
  COLS = maze[0].length;

  const scoreBarHeight = 50;
  const maxW = window.innerWidth - 40;
  const maxH = window.innerHeight - 40 - scoreBarHeight;
  TILE = Math.max(10, Math.floor(Math.min(maxW / COLS, maxH / ROWS)));

  canvas.width = COLS * TILE;
  canvas.height = ROWS * TILE;
  player.x = 1;
  player.y = 1;
  lightRadius = visMap[settings.visibility];
  baseLightRadius = lightRadius;
  sunsCollected = 0;
  suns = placeSuns();
  crystal = placeCrystal();
  crescentItem = placeCrescent();
  score = 0;
  placeDots();
  let dotCount = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (dots[r][c]) dotCount++;
  maxScore = dotCount + suns.length * 5 + (crystal ? 20 : 0) + (crescentItem ? 5 : 0);
  scoreDisplay.textContent = '0.0%';
  monsters = placeMonsters();
  gameOver = false;
  menu.classList.add('hidden');
  scoreDisplay.classList.add('visible');
  draw();
  startMonsters();
}

function placeSuns() {
  if (!maze) return [];
  const countMap = { small: 1, medium: 2, large: 3 };
  const count = countMap[settings.size] || 1;
  const floors = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0 && !(r === 1 && c === 1)) floors.push({ x: c, y: r });
    }
  }
  shuffle(floors);
  return floors.slice(0, count);
}

let suns = [];
let baseLightRadius = 3;
let sunsCollected = 0;

let crystal = null;
let crescentItem = null;
let exitFlashTimer = 0;
let exitFlashRAF = null;

let score = 0;
let maxScore = 0;
let dots = null;
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');

function scorePercent() {
  if (maxScore === 0) return '0.0';
  return (score / maxScore * 100).toFixed(1);
}

function updateScore(pts) {
  score += pts;
  scoreDisplay.textContent = scorePercent() + '%';
}

function placeDots() {
  dots = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const occupied = new Set();
  occupied.add('1,1');
  for (const sun of suns) occupied.add(`${sun.x},${sun.y}`);
  if (crystal) occupied.add(`${crystal.x},${crystal.y}`);
  if (crescentItem) occupied.add(`${crescentItem.x},${crescentItem.y}`);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1 && !occupied.has(`${c},${r}`)) {
        dots[r][c] = true;
      }
    }
  }
}

function placeCrystal() {
  if (!maze) return null;
  const floors = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0 && !(r === 1 && c === 1) &&
          Math.abs(r - 1) + Math.abs(c - 1) > 4) {
        floors.push({ x: c, y: r });
      }
    }
  }
  if (floors.length === 0) return null;
  return floors[Math.floor(Math.random() * floors.length)];
}

function placeCrescent() {
  if (!maze) return null;
  const occupied = new Set();
  occupied.add('1,1');
  for (const sun of suns) occupied.add(`${sun.x},${sun.y}`);
  if (crystal) occupied.add(`${crystal.x},${crystal.y}`);
  const floors = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0 && !occupied.has(`${c},${r}`) &&
          Math.abs(r - 1) + Math.abs(c - 1) > 4) {
        floors.push({ x: c, y: r });
      }
    }
  }
  if (floors.length === 0) return null;
  return floors[Math.floor(Math.random() * floors.length)];
}

function findExit() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 2) return { x: c, y: r };
    }
  }
  return null;
}

function flashExit() {
  exitFlashTimer = 1.0;
  if (exitFlashRAF) cancelAnimationFrame(exitFlashRAF);
  let last = performance.now();
  function tick(now) {
    const dt = (now - last) / 1000;
    last = now;
    exitFlashTimer = Math.max(0, exitFlashTimer - dt * 0.8);
    draw();
    if (exitFlashTimer > 0) {
      exitFlashRAF = requestAnimationFrame(tick);
    } else {
      exitFlashRAF = null;
    }
  }
  exitFlashRAF = requestAnimationFrame(tick);
}

const MONSTER_COLOR = '#ce93d8';
let monsters = [];
let monsterInterval = null;
let monsterSpeed = 400;
let monsterCount = 1;
let gameOver = false;
const caughtText = document.getElementById('caught-text');

function setSpeed(ms, btn) {
  monsterSpeed = ms;
  btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function setMonsterCount(n, btn) {
  monsterCount = n;
  btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function placeMonsters() {
  if (!maze) return [];
  const farFloors = [];
  const allFloors = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0 && !(r === 1 && c === 1)) {
        allFloors.push({ x: c, y: r });
        if (Math.abs(r - 1) + Math.abs(c - 1) > 6) farFloors.push({ x: c, y: r });
      }
    }
  }
  const pool = farFloors.length >= monsterCount ? farFloors : allFloors;
  const result = [];
  const used = new Set();
  for (let i = 0; i < monsterCount; i++) {
    let idx;
    do { idx = Math.floor(Math.random() * pool.length); } while (used.has(idx) && used.size < pool.length);
    used.add(idx);
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue}, 100%, 50%)`;
    result.push({ x: pool[idx].x, y: pool[idx].y, dx: 0, dy: 0, color });
  }
  return result;
}

function getWalkableDirs(x, y) {
  const dirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
  return dirs.filter(d => {
    const nx = x + d.dx;
    const ny = y + d.dy;
    return nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && maze[ny][nx] !== 1;
  });
}

function bfsFirstStep(fromX, fromY, toX, toY) {
  if (fromX === toX && fromY === toY) return null;
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const queue = [{x: fromX, y: fromY, firstDx: null, firstDy: null}];
  visited[fromY][fromX] = true;
  const dirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];

  while (queue.length > 0) {
    const cur = queue.shift();
    for (const d of dirs) {
      const nx = cur.x + d.dx;
      const ny = cur.y + d.dy;
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
      if (maze[ny][nx] === 1 || visited[ny][nx]) continue;
      visited[ny][nx] = true;
      const firstDx = cur.firstDx !== null ? cur.firstDx : d.dx;
      const firstDy = cur.firstDy !== null ? cur.firstDy : d.dy;
      if (nx === toX && ny === toY) return {dx: firstDx, dy: firstDy};
      queue.push({x: nx, y: ny, firstDx, firstDy});
    }
  }
  return null;
}

function moveMonsters() {
  if (gameOver) return;
  for (const m of monsters) {
    const dirs = getWalkableDirs(m.x, m.y);
    if (dirs.length === 0) continue;

    let chosen;
    const dist = Math.abs(m.x - player.x) + Math.abs(m.y - player.y);

    if (dist <= 5) {
      const step = bfsFirstStep(m.x, m.y, player.x, player.y);
      chosen = step || dirs[Math.floor(Math.random() * dirs.length)];
    } else {
      const hasDirection = m.dx !== 0 || m.dy !== 0;
      if (dirs.length === 1) {
        chosen = dirs[0];
      } else if (dirs.length === 2 && hasDirection) {
        const forward = dirs.find(d => !(d.dx === -m.dx && d.dy === -m.dy));
        chosen = forward || dirs[0];
      } else {
        chosen = dirs[Math.floor(Math.random() * dirs.length)];
      }
    }

    m.x += chosen.dx;
    m.y += chosen.dy;
    m.dx = chosen.dx;
    m.dy = chosen.dy;

    if (m.x === player.x && m.y === player.y) {
      showCaught();
      return;
    }
  }
  draw();
}

function startMonsters() {
  stopMonsters();
  monsterInterval = setInterval(moveMonsters, monsterSpeed);
}

function stopMonsters() {
  if (monsterInterval) { clearInterval(monsterInterval); monsterInterval = null; }
}

function showCaught() {
  gameOver = true;
  stopMonsters();
  draw();
  caughtText.classList.add('visible');
  finalScore.textContent = `Score: ${scorePercent()}%`;
  finalScore.classList.add('visible');
  waitingForDismiss = true;
}

function draw() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 1) {
        ctx.fillStyle = WALL_COLOR;
      } else if (maze[r][c] === 2) {
        ctx.fillStyle = EXIT_COLOR;
      } else {
        ctx.fillStyle = FLOOR_COLOR;
      }
      ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.strokeRect(c * TILE, r * TILE, TILE, TILE);
    }
  }

  if (dots) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const dotR = Math.max(2, TILE * 0.08);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!dots[r][c]) continue;
        ctx.beginPath();
        ctx.arc(c * TILE + TILE / 2, r * TILE + TILE / 2, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  for (const sun of suns) {
    const fx = sun.x * TILE + TILE / 2;
    const fy = sun.y * TILE + TILE / 2;
    ctx.save();
    ctx.translate(fx, fy);
    const r = 8;
    ctx.fillStyle = '#f5c542';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffe082';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (r + 4), Math.sin(angle) * (r + 4));
      ctx.lineTo(Math.cos(angle) * (r + 12), Math.sin(angle) * (r + 12));
      ctx.stroke();
    }
    ctx.restore();
  }

  // crystal
  if (crystal) {
    const crx = crystal.x * TILE + TILE / 2;
    const cry = crystal.y * TILE + TILE / 2;
    const cr = TILE * 0.3;
    const glow = ctx.createRadialGradient(crx, cry, 0, crx, cry, cr * 2.5);
    glow.addColorStop(0, 'rgba(130, 200, 255, 0.4)');
    glow.addColorStop(1, 'rgba(130, 200, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(crx - cr * 3, cry - cr * 3, cr * 6, cr * 6);
    ctx.fillStyle = '#a0e0ff';
    ctx.beginPath();
    ctx.moveTo(crx, cry - cr);
    ctx.lineTo(crx + cr * 0.6, cry);
    ctx.lineTo(crx, cry + cr);
    ctx.lineTo(crx - cr * 0.6, cry);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.moveTo(crx, cry - cr * 0.5);
    ctx.lineTo(crx + cr * 0.2, cry - cr * 0.1);
    ctx.lineTo(crx, cry + cr * 0.15);
    ctx.lineTo(crx - cr * 0.15, cry - cr * 0.1);
    ctx.closePath();
    ctx.fill();
  }

  // crescent (full moon icon)
  if (crescentItem) {
    const cx = crescentItem.x * TILE + TILE / 2;
    const cy = crescentItem.y * TILE + TILE / 2;
    const cr = TILE * 0.3;
    ctx.fillStyle = '#c0bfb8';
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a8a79f';
    ctx.beginPath();
    ctx.arc(cx - cr * 0.3, cy - cr * 0.25, cr * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + cr * 0.35, cy + cr * 0.2, cr * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - cr * 0.1, cy + cr * 0.4, cr * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  // player
  characters[selectedCharacter].draw(
    ctx,
    player.x * TILE + TILE / 2,
    player.y * TILE + TILE / 2,
    TILE * 0.35
  );

  // monsters
  for (const m of monsters) {
    const mx = m.x * TILE + TILE / 2;
    const my = m.y * TILE + TILE / 2;
    ctx.fillStyle = m.color || MONSTER_COLOR;
    ctx.beginPath();
    ctx.arc(mx, my - 2, TILE * 0.35, Math.PI, 0);
    ctx.lineTo(mx + TILE * 0.35, my + TILE * 0.3);
    for (let i = 0; i < 3; i++) {
      const bx = mx + TILE * 0.35 - (i + 0.5) * (TILE * 0.7 / 3);
      ctx.lineTo(bx, my + TILE * 0.15);
      const bx2 = mx + TILE * 0.35 - (i + 1) * (TILE * 0.7 / 3);
      ctx.lineTo(bx2, my + TILE * 0.3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(mx - 4, my - 4, 3, 0, Math.PI * 2);
    ctx.arc(mx + 4, my - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(mx - 3, my - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(mx + 5, my - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // darkness
  if (!gameOver) {
    const px = player.x * TILE + TILE / 2;
    const py = player.y * TILE + TILE / 2;
    const lr = lightRadius * TILE;
    const gradient = ctx.createRadialGradient(px, py, lr * 0.4, px, py, lr);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (exitFlashTimer > 0) {
      const exit = findExit();
      if (exit) {
        const ex = exit.x * TILE + TILE / 2;
        const ey = exit.y * TILE + TILE / 2;
        const flashR = TILE * 1.8;
        const alpha = exitFlashTimer;
        const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, flashR);
        glow.addColorStop(0, `rgba(83, 215, 105, ${alpha * 0.9})`);
        glow.addColorStop(0.4, `rgba(83, 215, 105, ${alpha * 0.5})`);
        glow.addColorStop(1, `rgba(83, 215, 105, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(ex - flashR, ey - flashR, flashR * 2, flashR * 2);

        ctx.fillStyle = `rgba(83, 215, 105, ${alpha})`;
        ctx.fillRect(exit.x * TILE, exit.y * TILE, TILE, TILE);
      }
    }
  }
}

function tryMove(dx, dy) {
  if (!maze || gameOver) return;
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
  if (maze[ny][nx] === 1) return;

  player.x = nx;
  player.y = ny;

  if (dots && dots[ny][nx]) {
    dots[ny][nx] = false;
    updateScore(1);
  }

  const pickedIdx = suns.findIndex(f => nx === f.x && ny === f.y);
  if (pickedIdx !== -1) {
    suns.splice(pickedIdx, 1);
    sunsCollected++;
    lightRadius = Math.ceil(baseLightRadius * (1 + 0.5 * sunsCollected));
    updateScore(5);
  }

  if (crystal && nx === crystal.x && ny === crystal.y) {
    crystal = null;
    flashExit();
    updateScore(20);
  }

  if (crescentItem && nx === crescentItem.x && ny === crescentItem.y) {
    crescentItem = null;
    if (sunsCollected > 0) {
      sunsCollected--;
      lightRadius = Math.ceil(baseLightRadius * (1 + 0.5 * sunsCollected));
    }
    updateScore(5);
  }

  if (monsters.some(m => nx === m.x && ny === m.y)) {
    draw();
    showCaught();
    return;
  }

  if (maze[ny][nx] === 2) {
    draw();
    showWin();
    return;
  }

  draw();
}

window.addEventListener('keydown', (e) => {
  if ((e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && waitingForDismiss) {
    returnToMenu();
    return;
  }
  switch (e.key) {
    case 'ArrowUp':    e.preventDefault(); tryMove(0, -1); break;
    case 'ArrowDown':  e.preventDefault(); tryMove(0, 1);  break;
    case 'ArrowLeft':  e.preventDefault(); tryMove(-1, 0); break;
    case 'ArrowRight': e.preventDefault(); tryMove(1, 0);  break;
  }
});

window.addEventListener('click', () => {
  if (waitingForDismiss) returnToMenu();
});

const bgMusic = new Audio('labyrinth_theme_v2.mp3');
bgMusic.loop = true;
let musicOn = false;

function toggleMusic() {
  musicOn = !musicOn;
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  if (musicOn) {
    bgMusic.play();
    toggle.classList.add('on');
    label.textContent = 'Music: On';
  } else {
    bgMusic.pause();
    toggle.classList.remove('on');
    label.textContent = 'Music: Off';
  }
}

initCharacterSelect();
