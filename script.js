const options = ["Chiste", "Trago largo", "Imita a Rajoy", "Trago corto", "Selfie grupal", "Habla como un robot", "Entretenme payaso", "Piedra, Papel, Tijera", "Trago largo", "Una verdad", "Trago corto"];
const colors = ["#00796b", "#4caf50", "#a5d6a7", "#ffd54f", "#ffab91", "#ff80ab", "#c2185b", "#ba68c8", "#64b5f6", "#FFD700", "#ffa000"]; // Nuevo color para "Una verdad"
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");

let startAngle = 0;
const arc = Math.PI / (options.length / 2);
let popupTimeout;

function drawRouletteWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = canvas.width / 2;

    for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;

        // Dibujar porción de la ruleta
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, angle, angle + arc, false);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();

        // Dibujar texto en la porción de la ruleta
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + arc / 2);
        const text = options[i];
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.fillText(text, radius / 3, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    const startSound = new Audio("start.mp3"); // Sonido de inicio
    startSound.play().catch(error => console.error('Error al reproducir el sonido de inicio:', error));

    const spinAngleStart = Math.random() * 10 + 10;
    const spinTime = Math.random() * 3 + 4 * 1000;
    const spinTimeTotal = 5000;

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    let startTime = null;

    function rotate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinTimeTotal, 1);
        const easeValue = easeOut(progress, 0, 1, 1);

        startAngle += (spinAngleStart * (1 - easeValue));
        drawRouletteWheel();

        if (progress < 1) {
            requestAnimationFrame(rotate);
        } else {
            const endSound = new Audio("end.mp3"); // Sonido de fin
            endSound.play().catch(error => console.error('Error al reproducir el sonido de fin:', error));
            const winningIndex = Math.floor((startAngle / arc) % options.length);
            popupMessage.textContent = `¡Felicidades! Has ganado: ${options[winningIndex]}`;
            popup.style.display = 'block';
            popupTimeout = setTimeout(() => {
                popup.style.display = 'none';
            }, 5000);
        }
    }

    requestAnimationFrame(rotate);
}

function hidePopup() {
    popup.style.display = 'none';
    clearTimeout(popupTimeout);
}

spinButton.addEventListener("click", () => {
    rotateWheel();
    hidePopup();
});

drawRouletteWheel(); // Dibujar la ruleta al cargar la página
