// c vc abrir meu codigo, por favor, volta pra mim
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();


const audio = document.getElementById("bgm");
audio.volume = 0;
audio.loop = true;


const BPM = 78;
const beatInterval = 60 / BPM;


let scene = 0;
let sceneTime = 0;


let dist = 360;
const minDist = 90;


const stars = Array.from({ length: 140 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  speed: 0.2 + Math.random() * 0.6,
  size: 1 + Math.random() * 2,
  alpha: 1
}));


function musicPhase() {
  return (audio.currentTime / beatInterval) * Math.PI * 2;
}

function setVolume(target, speed = 0.006) {
  audio.volume += (target - audio.volume) * speed;
}

function drawStars(fade = 1) {
  stars.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha * fade})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = -5;
      s.x = Math.random() * canvas.width;
    }
  });
}


function drawStick(x, y, phase, mood = "normal", alpha = 1) {
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 2;

  const breathe = Math.sin(phase) * 2;
  const arm = Math.sin(phase) * 6;

  ctx.beginPath();
  ctx.arc(x, y - 22 - breathe, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = "14px serif";
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  if (mood === "fear") ctx.fillText("😟", x - 8, y - 28);
  if (mood === "sad") ctx.fillText("😞", x - 8, y - 28);

  ctx.beginPath();
  ctx.moveTo(x, y - breathe);
  ctx.lineTo(x, y + 30);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 15, y + 10);
  ctx.lineTo(x - 15 + arm, y + 20);
  ctx.moveTo(x + 15, y + 10);
  ctx.lineTo(x + 15 - arm, y + 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + 30);
  ctx.lineTo(x - 6, y + 55);
  ctx.moveTo(x, y + 30);
  ctx.lineTo(x + 6, y + 55);
  ctx.stroke();
}


function drawHeart(x, y, size, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.fillStyle = `rgba(255,80,80,${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.bezierCurveTo(-15, -25, -40, -5, 0, 25);
  ctx.bezierCurveTo(40, -5, 15, -25, 0, -10);
  ctx.fill();
  ctx.restore();
}


let fade = 1;
let textAlpha = 0;
let dangoAlpha = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sceneTime++;

  const phase = musicPhase();
  const centerY = canvas.height / 2 + 60;

  drawStars(fade);

  
  if (scene === 0) {
    setVolume(0);
    ctx.font = "34px monospace";
    ctx.fillStyle = "rgba(255,200,220,0.8)";
    ctx.fillText("uma história curta 🍡", canvas.width / 2 - 140, canvas.height / 2);
    if (sceneTime > 240) {
      audio.play();
      scene = 1; sceneTime = 0;
    }
  }

  
  if (scene === 1) {
    setVolume(0.6);
    dist -= 0.4;
    drawStick(canvas.width / 2 - dist, centerY, phase);
    drawStick(canvas.width / 2 + dist, centerY, phase);
    if (dist <= minDist) { scene = 2; sceneTime = 0; }
  }

  
  if (scene === 2) {
    drawStick(canvas.width / 2 - minDist, centerY, phase);
    drawStick(canvas.width / 2 + minDist, centerY, phase);
    ctx.font = "22px serif";
    ctx.fillText("…", canvas.width / 2 - minDist + 10, centerY - 55);
    ctx.fillText("…", canvas.width / 2 + minDist - 10, centerY - 55);
    if (sceneTime > 300) { scene = 3; sceneTime = 0; }
  }

  
  if (scene === 3) {
    ctx.font = "26px serif";
    ctx.fillText("💬", canvas.width / 2, centerY - 60);
    drawStick(canvas.width / 2 - minDist, centerY, phase);
    drawStick(canvas.width / 2 + minDist, centerY, phase);
    if (sceneTime > 360) { scene = 4; sceneTime = 0; }
  }

  
  if (scene === 4) {
    ctx.font = "34px serif";
    ctx.fillText("🎁 🍡 💖", canvas.width / 2 - 40, centerY - 70);
    drawStick(canvas.width / 2 - minDist + 10, centerY, phase);
    drawStick(canvas.width / 2 + minDist - 10, centerY, phase);
    if (sceneTime > 420) { scene = 5; sceneTime = 0; }
  }

  
  if (scene === 5) {
    drawStick(canvas.width / 2 - minDist + 10, centerY, phase);
    drawStick(canvas.width / 2 + minDist - 10, centerY, phase);
    drawHeart(canvas.width / 2, centerY - 90, 1 + Math.sin(phase) * 0.1);
    if (sceneTime > 480) { scene = 6; sceneTime = 0; }
  }

  
  if (scene === 6) {
    dist += 0.3;
    drawStick(canvas.width / 2 - dist, centerY, phase, "sad");
    drawStick(canvas.width / 2 + dist, centerY, phase, "fear");
    if (dist > 260) { scene = 7; sceneTime = 0; }
  }

  
  if (scene === 7) {
    dist -= 0.25;
    drawStick(canvas.width / 2 - dist, centerY, phase);
    drawStick(canvas.width / 2 + dist, centerY, phase);
    if (sceneTime > 300) { scene = 8; sceneTime = 0; }
  }

  
  if (scene === 8) {
    dist += 0.35;
    drawStick(canvas.width / 2 - dist, centerY, phase, "sad");
    drawStick(canvas.width / 2 + dist, centerY, phase, "sad");
    drawHeart(canvas.width / 2, centerY - 90, 1 + Math.sin(phase) * 0.1);
    ctx.font = "28px serif";
    ctx.fillText("🩹", canvas.width / 2 + 10, centerY - 90);
    if (sceneTime > 360) { scene = 9; sceneTime = 0; }
  }

  
  if (scene === 9) {
    setVolume(0.25);
    fade -= 0.0015;
    textAlpha += 0.002;
    ctx.fillStyle = `rgba(255,255,255,${Math.min(textAlpha, 1)})`;
    ctx.font = "24px monospace";
    ctx.fillText("fica bem", canvas.width / 2 - 40, canvas.height / 2);
    if (sceneTime > 420) { scene = 10; sceneTime = 0; }
  }

  
  if (scene === 10) {
    fade -= 0.001;
    dangoAlpha += 0.0015;
    ctx.font = "40px serif";
    ctx.fillStyle = `rgba(255,255,255,${Math.min(dangoAlpha, 1)})`;
    ctx.fillText("🍡", canvas.width / 2 - 20, canvas.height / 2);
  }

  requestAnimationFrame(animate);
}

animate();
