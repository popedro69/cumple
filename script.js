const options = ["Chiste", "Trago largo", "Imita a Rajoy", "Trago corto", "Selfie grupal", "Habla como un robot", "Entretenme payaso", "Piedra, Papel, Tijera", "Trago largo", "Una verdad", "Trago corto"];
const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5", "#FFB733", "#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5"];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const startSound = document.getElementById("startSound");
const endSound = document.getElementById("endSound");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");

let startAngle = 0;
const arc = Math.PI / (options.length / 2);
let popupTimeout;

function drawRouletteWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = canvas.width / 2;
    const textRadius = 130; // Distancia del texto al centro

    for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        const text = options[i];

        // Calcular posición del texto
        const textWidth = ctx.measureText(text).width;
        const textAngle = angle + arc / 2;
        const textX = canvas.width / 2 + Math.cos(textAngle) * (textRadius) - textWidth / 2;
        const textY = canvas.height / 2 + Math.sin(textAngle) * (textRadius);

        // Dibujar porción de la ruleta
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, angle, angle + arc, false);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.fill();

        // Dibujar texto dentro de la porción
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, textX, textY);
    }
}

function rotateWheel() {
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




