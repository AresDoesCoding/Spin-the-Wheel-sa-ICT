const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');

// Reference to the audio element
const spinSound = document.getElementById('spinSound');

// Add the names to the segments array
const segments = [
    'Sir Echapare', 
    'Maam Barquin', 
    'Sir Alvarez', 
    'Maam Aphol', 
    'Sir Dela Cruz', 
    'Maam Lea', 
    'Maam Lutch', 
    'Ms. Mamamansag'
];

// Define more colorful colors for the wheel segments
const colors = ['#FF6347', '#FFD700', '#8A2BE2', '#00FF7F', '#FF69B4', '#1E90FF', '#FFA500', '#ADFF2F'];

let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

function drawWheel() {
    for (let i = 0; i < segments.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length]; // Assign a color from the array
        ctx.beginPath();
        ctx.arc(150, 150, 150, angle, angle + arc, false);
        ctx.lineTo(150, 150);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.translate(150 + Math.cos(angle + arc / 2) * 100, 150 + Math.sin(angle + arc / 2) * 100);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(segments[i], -ctx.measureText(segments[i]).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    // Gradually slow down after 5 seconds
    if (spinTime < 5000) {
        spinAngleStart -= 0.01; // Keep speed steady for 5 seconds
    } else if (spinTime >= 5000 && spinTime < spinTimeTotal) {
        spinAngleStart -= 0.1; // Slow down gradually
    }

    startAngle += (spinAngleStart * Math.PI) / 180;
    drawWheel();

    spinTime += 30;

    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
    } else {
        spinTimeout = setTimeout(rotateWheel, 30);
    }
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    const winner = segments[index];

    // Stop the spin sound when the wheel stops
    spinSound.pause();
    spinSound.currentTime = 0;

    // Display the congratulatory message with the winner's name
    resultDiv.innerText = `🎉 Congratulations, ${winner}, you have won a free Samsung tablet! 🎉`;

    isSpinning = false;
    spinButton.disabled = false;
}

function spin() {
    if (isSpinning) return; // Prevent multiple spins at once
    isSpinning = true;
    spinButton.disabled = true;
    resultDiv.innerText = ''; // Clear the previous result

    spinAngleStart = Math.random() * 10 + 10; // Initial spin speed
    spinTime = 0;
    spinTimeTotal = 9000; // Total spin time is 9 seconds

    // Play the spin sound when the wheel starts spinning
    spinSound.play();

    rotateWheel();
}

spinButton.addEventListener('click', spin);

drawWheel();