const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOver = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");

const scoreText = document.getElementById("score");
const healthText = document.getElementById("health");
const levelText = document.getElementById("level");
const finalScore = document.getElementById("finalScore");

let playing = false;
let score = 0;
let health = 100;
let level = 1;

let bullets = [];
let enemies = [];
let particles = [];

let left = false;
let right = false;

let enemyTimer = 0;
let shotTimer = 0;

const player = {
    x: 0,
    y: 0,
    speed: 7
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.x = canvas.width / 2;
    player.y = canvas.height - 140;
}

resize();

window.addEventListener("resize", resize);

function startGame() {
    playing = true;

    score = 0;
    health = 100;
    level = 1;

    bullets = [];
    enemies = [];
    particles = [];

    enemyTimer = 0;
    shotTimer = 0;

    player.x = canvas.width / 2;
    player.y = canvas.height - 140;

    startScreen.classList.add("hidden");
    gameOver.classList.add("hidden");

    updateHUD();

    requestAnimationFrame(loop);
}

function endGame() {
    playing = false;

    finalScore.textContent = score;

    gameOver.classList.remove("hidden");
}

function updateHUD() {
    scoreText.textContent = score;
    healthText.textContent = health;
    levelText.textContent = level;
}

function shoot() {
    if (!playing) return;

    if (shotTimer > 0) return;

    bullets.push({
        x: player.x,
        y: player.y - 25,
        speed: 12
    });

    shotTimer = 10;
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 50) + 25,
        y: -30,
        speed: 2 + Math.random() * level
    });
}

function update() {
    if (left) {
        player.x -= player.speed;
    }

    if (right) {
        player.x += player.speed;
    }

    player.x = Math.max(
        25,
        Math.min(canvas.width - 25, player.x)
    );

    bullets.forEach(b => {
        b.y -= b.speed;
    });

    bullets = bullets.filter(
        b => b.y > -30
    );

    enemies.forEach(e => {
        e.y += e.speed;
    });

    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];

        const distance = Math.hypot(
            e.x - player.x,
            e.y - player.y
        );

        if (distance < 40) {
            enemies.splice(i, 1);

            health -= 20;

            explosion(e.x, e.y);

            if (health <= 0) {
                health = 0;
                updateHUD();
                endGame();
                return;
            }

            updateHUD();
        }

        if (e.y > canvas.height + 50) {
            enemies.splice(i, 1);
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            const b = bullets[i];
            const e = enemies[j];

            const distance = Math.hypot(
                b.x - e.x,
                b.y - e.y
            );

            if (distance < 25) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);

                score += 10;
                level = Math.floor(score / 100) + 1;

                explosion(e.x, e.y);

                updateHUD();

                break;
            }
        }
    }

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
    });

    particles = particles.filter(
        p => p.life > 0
    );

    enemyTimer++;

    if (enemyTimer > Math.max(25, 70 - level * 5)) {
        spawnEnemy();
        enemyTimer = 0;
    }

    if (shotTimer > 0) {
        shotTimer--;
    }
}

function drawPlayer() {
    ctx.save();

    ctx.translate(player.x, player.y);

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#55ddff";

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(-22, 22);
    ctx.lineTo(0, 12);
    ctx.lineTo(22, 22);
    ctx.closePath();

    const g = ctx.createLinearGradient(
        0,
        -30,
        0,
        30
    );

    g.addColorStop(0, "#b8f7ff");
    g.addColorStop(1, "#735cff");

    ctx.fillStyle = g;
    ctx.fill();

    ctx.restore();
}

function drawEnemies() {
    enemies.forEach(e => {
        ctx.save();

        ctx.translate(e.x, e.y);

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff3c9d";

        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(20, 15);
        ctx.lineTo(0, 8);
        ctx.lineTo(-20, 15);
        ctx.closePath();

        const g = ctx.createLinearGradient(
            0,
            -20,
            0,
            20
        );

        g.addColorStop(0, "#ff75c2");
        g.addColorStop(1, "#713cff");

        ctx.fillStyle = g;
        ctx.fill();

        ctx.restore();
    });
}

function drawBullets() {
    bullets.forEach(b => {
        ctx.save();

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#63edff";

        ctx.fillStyle = "#a8f8ff";

        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });
}

function explosion(x, y) {
    for (let i = 0; i < 18; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - .5) * 7,
            vy: (Math.random() - .5) * 7,
            life: 30,
            size: Math.random() * 4 + 1
        });
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = "#7eeaff";

        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 1;
    });
}

function loop() {
    if (!playing) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    update();

    drawParticles();
    drawBullets();
    drawEnemies();
    drawPlayer();

    requestAnimationFrame(loop);
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

leftBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    left = true;
});

leftBtn.addEventListener("touchend", e => {
    e.preventDefault();
    left = false;
});

rightBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    right = true;
});

rightBtn.addEventListener("touchend", e => {
    e.preventDefault();
    right = false;
});

fireBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    shoot();
});

leftBtn.addEventListener("mousedown", () => {
    left = true;
});

leftBtn.addEventListener("mouseup", () => {
    left = false;
});

rightBtn.addEventListener("mousedown", () => {
    right = true;
});

rightBtn.addEventListener("mouseup", () => {
    right = false;
});

fireBtn.addEventListener("mousedown", shoot);
