// Jogo estilo Atari - Velho Oeste: Sacco vs Nigriron-Joromba
// Controles:
//  - Sacco: W, A, S, D para mover, F para atirar
//  - Nigriron-Joromba: setas direcionais para mover, L para atirar

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const player1 = {
  x: 100,
  y: 300,
  w: 30,
  h: 30,
  color: "#cc9966", // tom de pele (Sacco)
  bullets: [],
  score: 0,
  name: "Sacco",
  facing: 1
};

const player2 = {
  x: 700,
  y: 300,
  w: 30,
  h: 30,
  color: "#663300", // tom de pele (Nigriron-Joromba)
  bullets: [],
  score: 0,
  name: "Nigriron-Joromba",
  facing: -1
};

const keys = {};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function drawPlayer(p) {
  // corpo estilo bloco
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, p.w, p.h);

  // cabeça (círculo)
  ctx.fillStyle = "#f1d2a8";
  ctx.beginPath();
  ctx.arc(p.x + p.w / 2, p.y - 10, 10, 0, Math.PI * 2);
  ctx.fill();

  // chapéu de cowboy (pixel art simples)
  ctx.fillStyle = "#5a3b18";
  ctx.fillRect(p.x + p.w / 2 - 12, p.y - 18, 24, 4);
  ctx.fillRect(p.x + p.w / 2 - 8, p.y - 22, 16, 4);

  // barba para Sacco + cabeça careca (somente sombra da barba)
  if (p.name === "Sacco") {
    ctx.fillStyle = "#3b2f2f";
    ctx.fillRect(p.x + 6, p.y - 4, 18, 4);
  }
}

function drawBullets(bullets) {
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function updateBullets(shooter, target) {
  for (let i = shooter.bullets.length - 1; i >= 0; i--) {
    const b = shooter.bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    // remover fora da tela
    if (b.x + b.w < 0 || b.x > canvas.width || b.y + b.h < 0 || b.y > canvas.height) {
      shooter.bullets.splice(i, 1);
      continue;
    }

    if (rectsOverlap(b, target)) {
      shooter.score++;
      shooter.bullets.splice(i, 1);
    }
  }
}

function drawBackground() {
  // céu
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#87ceeb");
  grad.addColorStop(0.6, "#deb887");
  grad.addColorStop(1, "#c79a63");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // solo
  ctx.fillStyle = "#d2b48c";
  ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

  // cactos simples
  for (let i = 0; i < 5; i++) {
    const x = 80 + i * 140;
    const h = 40 + (i % 3) * 20;
    ctx.fillStyle = "#2f6f3e";
    ctx.fillRect(x, canvas.height - 120 - h, 12, h);
    ctx.fillRect(x - 8, canvas.height - 90 - h, 8, 16);
    ctx.fillRect(x + 12, canvas.height - 100 - h, 8, 16);
  }

  // sol
  ctx.beginPath();
  ctx.arc(canvas.width - 70, 70, 28, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd700";
  ctx.fill();
}

function shoot(shooter) {
  const speed = 7;
  const dir = shooter.facing >= 0 ? 1 : -1;
  shooter.bullets.push({
    x: shooter.x + (dir > 0 ? shooter.w : -4),
    y: shooter.y + shooter.h / 2 - 2,
    w: 4,
    h: 4,
    vx: speed * dir,
    vy: 0
  });
}

function handleMovement() {
  // Sacco
  if (keys["w"]) player1.y -= 3;
  if (keys["s"]) player1.y += 3;
  if (keys["a"]) { player1.x -= 3; player1.facing = -1; }
  if (keys["d"]) { player1.x += 3; player1.facing = 1; }

  // Nigriron-Joromba
  if (keys["ArrowUp"]) player2.y -= 3;
  if (keys["ArrowDown"]) player2.y += 3;
  if (keys["ArrowLeft"]) { player2.x -= 3; player2.facing = -1; }
  if (keys["ArrowRight"]) { player2.x += 3; player2.facing = 1; }

  // limites
  player1.x = clamp(player1.x, 0, canvas.width - player1.w);
  player1.y = clamp(player1.y, 100, canvas.height - 120 - player1.h);
  player2.x = clamp(player2.x, 0, canvas.width - player2.w);
  player2.y = clamp(player2.y, 100, canvas.height - 120 - player2.h);
}

function drawUI() {
  ctx.fillStyle = "#000";
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, canvas.width, 32);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  ctx.fillText(`${player1.name}: ${player1.score}`, 20, 22);
  ctx.fillText(`${player2.name}: ${player2.score}`, canvas.width - 210, 22);
}

let lastShotP1 = 0;
let lastShotP2 = 0;
const fireDelay = 170; // ms, ritmo arcade

function gameLoop(timestamp=0) {
  drawBackground();
  handleMovement();

  // disparos (com pequeno atraso entre tiros)
  if (keys["f"] && timestamp - lastShotP1 > fireDelay) {
    shoot(player1);
    lastShotP1 = timestamp;
  }
  if (keys["l"] && timestamp - lastShotP2 > fireDelay) {
    shoot(player2);
    lastShotP2 = timestamp;
  }

  updateBullets(player1, player2);
  updateBullets(player2, player1);

  // desenhar jogadores e balas
  drawBullets(player1.bullets);
  drawBullets(player2.bullets);
  drawPlayer(player1);
  drawPlayer(player2);

  drawUI();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

requestAnimationFrame(gameLoop);
