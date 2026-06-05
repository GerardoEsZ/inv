const screens = [...document.querySelectorAll('.screen')];
const progressBar = document.querySelector('#progressBar');
const stepText = document.querySelector('#stepText');
const percentText = document.querySelector('#percentText');
const cursorGlow = document.querySelector('#cursorGlow');
const noBtn = document.querySelector('#noBtn');
const yesBtn = document.querySelector('#yesBtn');
const yesNoArea = document.querySelector('#yesNoArea');
const dateInput = document.querySelector('#dateInput');
const timeInput = document.querySelector('#timeInput');
const saveDateBtn = document.querySelector('#saveDateBtn');
const ticketPlan = document.querySelector('#ticketPlan');
const ticketDate = document.querySelector('#ticketDate');
const ticketTime = document.querySelector('#ticketTime');
const downloadBtn = document.querySelector('#downloadBtn');
const restartBtn = document.querySelector('#restartBtn');
const soundBtn = document.querySelector('#soundBtn');
const canvas = document.querySelector('#confetti');
const ctx = canvas.getContext('2d');

let current = 0;
let chosenPlan = 'Sorpresa romántica';
let audioEnabled = false;
let audioCtx;
let particles = [];

const today = new Date();
dateInput.min = today.toISOString().split('T')[0];

function showScreen(index){
  current = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, i) => screen.classList.toggle('active', i === current));
  const percent = Math.round((current / (screens.length - 1)) * 100);
  progressBar.style.width = `${percent}%`;
  stepText.textContent = `Paso ${current + 1} de ${screens.length}`;
  percentText.textContent = `${percent}%`;
  playTone(380 + current * 60, .035);
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.dataset.plan){
      chosenPlan = btn.dataset.plan;
      ticketPlan.textContent = chosenPlan;
    }
    showScreen(current + 1);
  });
});

saveDateBtn.addEventListener('click', () => {
  ticketDate.textContent = dateInput.value ? formatDate(dateInput.value) : 'Por confirmar';
  ticketTime.textContent = timeInput.value || 'Por confirmar';
  showScreen(current + 1);
});

yesBtn.addEventListener('click', () => {
  ticketPlan.textContent = chosenPlan;
  ticketDate.textContent = dateInput.value ? formatDate(dateInput.value) : 'Por confirmar';
  ticketTime.textContent = timeInput.value || 'Por confirmar';
  showScreen(5);
  launchConfetti();
  playMelody();
});

function moveNoButton(){
  const area = yesNoArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  noBtn.classList.add('running');
  const maxX = Math.max(0, area.width - btn.width);
  const maxY = Math.max(0, area.height - btn.height);
  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top = `${Math.random() * maxY}px`;
  playTone(180, .025);
}
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('touchstart', e => { e.preventDefault(); moveNoButton(); }, {passive:false});

restartBtn.addEventListener('click', () => {
  particles = [];
  showScreen(0);
});

downloadBtn.addEventListener('click', () => {
  const text = `INVITACIÓN ESPECIAL\n\nPlan: ${ticketPlan.textContent}\nFecha: ${ticketDate.textContent}\nHora: ${ticketTime.textContent}\nEstado: Aceptado 💌\n\nHecho con mucho cariño.`;
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'invitacion-especial.txt';
  a.click();
  URL.revokeObjectURL(url);
});

soundBtn.addEventListener('click', () => {
  audioEnabled = !audioEnabled;
  soundBtn.textContent = audioEnabled ? '♫' : '♪';
  if(audioEnabled) playMelody();
});

window.addEventListener('mousemove', e => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

function formatDate(value){
  const [y,m,d] = value.split('-');
  return `${d}/${m}/${y}`;
}

function playTone(freq, duration = .06){
  if(!audioEnabled) return;
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(.045, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playMelody(){
  if(!audioEnabled) return;
  [523,659,784,1046].forEach((n,i)=>setTimeout(()=>playTone(n,.11),i*120));
}

function resizeCanvas(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(){
  particles = Array.from({length:180}, () => ({
    x: innerWidth / 2,
    y: innerHeight * .38,
    vx: (Math.random() - .5) * 11,
    vy: Math.random() * -10 - 3,
    g: Math.random() * .25 + .15,
    size: Math.random() * 7 + 4,
    rot: Math.random() * Math.PI,
    spin: (Math.random() - .5) * .25,
    life: 120 + Math.random() * 60,
    hue: Math.floor(Math.random() * 360)
  }));
}

function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.life--;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.spin;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `hsl(${p.hue}, 95%, 65%)`;
    ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.55);
    ctx.restore();
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();
showScreen(0);
