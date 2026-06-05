let selectedPlan = "Café y postre";

const noBtn = document.getElementById("noBtn");
const progressBar = document.getElementById("progressBar");

function selectPlan(button, plan) {
  selectedPlan = plan;

  document.querySelectorAll(".plan").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
  progressBar.style.width = "65%";
}

noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 180 - 90;
  const y = Math.random() * 120 - 60;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

function acceptInvite() {
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const result = document.getElementById("result");

  progressBar.style.width = "100%";

  result.style.display = "block";
  result.innerHTML = `
    <strong>Perfecto 💖</strong><br>
    Plan elegido: ${selectedPlan}<br>
    Fecha: ${date || "por confirmar"}<br>
    Hora: ${time || "por confirmar"}<br><br>
    Ya quedó oficialmente agendada nuestra salida.
  `;

  launchConfetti();
}

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * 360
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
      ctx.fillRect(0, 0, p.size, p.size);
      ctx.restore();

      p.y += p.speed;
      p.angle += 0.05;
    });

    requestAnimationFrame(draw);
  }

  draw();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}
