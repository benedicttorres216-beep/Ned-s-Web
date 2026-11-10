
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

const bgImage=new Image();
bgImage.src="background.jpeg";

const start=document.getElementById("start");
const over=document.getElementById("over");
const startButton=document.getElementById("startButton");
const again=document.getElementById("again");

const leftButton=document.getElementById("left");
const rightButton=document.getElementById("right");
const fireButton=document.getElementById("fire");

const scoreDisplay=document.getElementById("score");
const hpDisplay=document.getElementById("hp");
const levelDisplay=document.getElementById("level");
const finalDisplay=document.getElementById("final");

let W=0;
let H=0;

let playing=false;
let score=0;
let hp=100;
let level=1;

let left=false;
let right=false;

let bullets=[];
let enemies=[];
let particles=[];

let enemyTimer=0;
let shotTimer=0;

const player={
x:0,
y:0,
speed:7
};

function resize(){
W=window.innerWidth;
H=window.innerHeight;

canvas.width=W;
canvas.height=H;

player.x=W/2;
player.y=H-140;
}

resize();

window.addEventListener("resize",resize);

function updateHUD(){
scoreDisplay.textContent=score;
hpDisplay.textContent=hp;
levelDisplay.textContent=level;
}

function startGame(){
playing=true;

score=0;
hp=100;
level=1;

left=false;
right=false;

bullets=[];
enemies=[];
particles=[];

enemyTimer=0;
shotTimer=0;

player.x=W/2;
player.y=H-140;

start.classList.add("hidden");
over.classList.add("hidden");

updateHUD();

requestAnimationFrame(loop);
}

function gameOver(){
playing=false;

left=false;
right=false;

finalDisplay.textContent=score;

over.classList.remove("hidden");
}

function shoot(){
if(!playing)return;

if(shotTimer>0)return;

bullets.push({
x:player.x,
y:player.y-30,
speed:13
});

shotTimer=8;
}

function spawnEnemy(){
enemies.push({
x:Math.random()*(W-50)+25,
y:-30,
speed:2+Math.random()*level
});
}

function updatePlayer(){
if(left)player.x-=player.speed;
if(right)player.x+=player.speed;

if(player.x<25)player.x=25;
if(player.x>W-25)player.x=W-25;
}

function updateBullets(){
for(let i=bullets.length-1;i>=0;i--){

bullets[i].y-=bullets[i].speed;

if(bullets[i].y<-30){
bullets.splice(i,1);
}
}
}

function updateEnemies(){

for(let i=enemies.length-1;i>=0;i--){

let e=enemies[i];

e.y+=e.speed;

let distance=Math.hypot(
e.x-player.x,
e.y-player.y
);

if(distance<40){

hp-=20;

createExplosion(e.x,e.y);

enemies.splice(i,1);

updateHUD();

if(hp<=0){
hp=0;
updateHUD();
gameOver();
return;
}

continue;
}

if(e.y>H+50){
enemies.splice(i,1);
}
}
}

function collision(){

for(let i=bullets.length-1;i>=0;i--){

for(let j=enemies.length-1;j>=0;j--){

let b=bullets[i];
let e=enemies[j];

let distance=Math.hypot(
b.x-e.x,
b.y-e.y
);

if(distance<25){

createExplosion(e.x,e.y);

bullets.splice(i,1);
enemies.splice(j,1);

score+=10;

level=Math.floor(score/100)+1;

updateHUD();

break;
}
}
}
}

function createExplosion(x,y){

for(let i=0;i<20;i++){

particles.push({
x:x,
y:y,
vx:(Math.random()-.5)*8,
vy:(Math.random()-.5)*8,
life:30,
size:Math.random()*4+1
});
}
}

function updateParticles(){

for(let i=particles.length-1;i>=0;i--){

let p=particles[i];

p.x+=p.vx;
p.y+=p.vy;
p.life--;

if(p.life<=0){
particles.splice(i,1);
}
}
}

function drawBackground(){

ctx.fillStyle="#02030a";
ctx.fillRect(0,0,W,H);

if(bgImage.complete && bgImage.naturalWidth>0){

const scale=Math.max(
W/bgImage.naturalWidth,
H/bgImage.naturalHeight
);

const width=bgImage.naturalWidth*scale;
const height=bgImage.naturalHeight*scale;

const x=(W-width)/2;
const y=(H-height)/2;

ctx.drawImage(bgImage,x,y,width,height);

}

ctx.fillStyle="rgba(2,3,10,0.45)";
ctx.fillRect(0,0,W,H);

for(let i=0;i<80;i++){

let x=(i*97)%W;
let y=(i*173+Date.now()/30)%H;

ctx.fillStyle="rgba(255,255,255,.5)";
ctx.fillRect(x,y,1.5,1.5);

}
}

function drawPlayer(){

ctx.save();

ctx.translate(player.x,player.y);

ctx.shadowBlur=25;
ctx.shadowColor="#55ddff";

ctx.beginPath();

ctx.moveTo(0,-28);
ctx.lineTo(-22,22);
ctx.lineTo(0,12);
ctx.lineTo(22,22);

ctx.closePath();

let g=ctx.createLinearGradient(0,-30,0,30);

g.addColorStop(0,"#b8f7ff");
g.addColorStop(1,"#735cff");

ctx.fillStyle=g;
ctx.fill();

ctx.restore();
}

function drawEnemies(){

enemies.forEach(e=>{

ctx.save();

ctx.translate(e.x,e.y);

ctx.shadowBlur=20;
ctx.shadowColor="#ff3c9d";

ctx.beginPath();

ctx.moveTo(0,-20);
ctx.lineTo(20,15);
ctx.lineTo(0,8);
ctx.lineTo(-20,15);

ctx.closePath();

let g=ctx.createLinearGradient(0,-20,0,20);

g.addColorStop(0,"#ff75c2");
g.addColorStop(1,"#713cff");

ctx.fillStyle=g;
ctx.fill();

ctx.restore();

});
}

function drawBullets(){

bullets.forEach(b=>{

ctx.save();

ctx.shadowBlur=20;
ctx.shadowColor="#63edff";

ctx.fillStyle="#a8f8ff";

ctx.beginPath();

ctx.arc(b.x,b.y,4,0,Math.PI*2);

ctx.fill();

ctx.restore();

});
}

function drawParticles(){

particles.forEach(p=>{

ctx.globalAlpha=p.life/30;

ctx.fillStyle="#7eeaff";

ctx.beginPath();

ctx.arc(
p.x,
p.y,
p.size,
0,
Math.PI*2
);

ctx.fill();

ctx.globalAlpha=1;

});
}

function loop(){

if(!playing)return;

ctx.clearRect(0,0,W,H);

drawBackground();

updatePlayer();
updateBullets();
updateEnemies();
collision();
updateParticles();

enemyTimer++;

if(enemyTimer>Math.max(20,70-level*5)){
spawnEnemy();
enemyTimer=0;
}

if(shotTimer>0)shotTimer--;

drawParticles();
drawBullets();
drawEnemies();
drawPlayer();

requestAnimationFrame(loop);
}

startButton.addEventListener("click",startGame);
again.addEventListener("click",startGame);

leftButton.addEventListener("touchstart",function(e){
e.preventDefault();
left=true;
});

leftButton.addEventListener("touchend",function(e){
e.preventDefault();
left=false;
});

rightButton.addEventListener("touchstart",function(e){
e.preventDefault();
right=true;
});

rightButton.addEventListener("touchend",function(e){
e.preventDefault();
right=false;
});

fireButton.addEventListener("touchstart",function(e){
e.preventDefault();
shoot();
});

leftButton.addEventListener("mousedown",function(){
left=true;
});

leftButton.addEventListener("mouseup",function(){
left=false;
});

rightButton.addEventListener("mousedown",function(){
right=true;
});

rightButton.addEventListener("mouseup",function(){
right=false;
});

fireButton.addEventListener("mousedown",shoot);

window.addEventListener("mouseup",function(){
left=false;
right=false;
});

window.addEventListener("touchcancel",function(){
left=false;
right=false;
});
