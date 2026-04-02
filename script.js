// ==================== STATE MANAGEMENT ====================
let wheelState = {
    options: [],
    spinCount: 0,
    isSpinning: false,
    selectedIndex: -1,
    rotation: 0,
    maxSpins: 10
};

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
    '#F5B7B1', '#D7BDE2', '#A9DFBF', '#FAD7A0', '#D5F4E6'
];

// ==================== INITIALIZATION ====================
function startApplication() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    drawWheel();
    updateDisplay();
}

function backToWelcome() {
    if (confirm('Are you sure? You will lose your current wheel.')) {
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('welcomeScreen').classList.remove('hidden');
        resetState();
    }
}

function resetState() {
    wheelState = {
        options: [],
        spinCount: 0,
        isSpinning: false,
        selectedIndex: -1,
        rotation: 0,
        maxSpins: 10
    };
    updateDisplay();
}

// ==================== OPTION MANAGEMENT ====================
function addOption() {
    const input = document.getElementById('optionInput');
    let option = input.value.trim().toLowerCase();

    if (option === '') {
        showMessage('Input cannot be empty. Please enter something.', 'error');
        return;
    }

    if (option === 'done') {
        showMessage('Reserved word: "done" cannot be used as an option.', 'error');
        return;
    }

    wheelState.options.push(option);
    input.value = '';
    input.focus();
    showMessage('Option added successfully!', 'success');
    updateDisplay();
    drawWheel();
}

function removeOption(index) {
    const removed = wheelState.options[index];
    wheelState.options.splice(index, 1);
    showMessage(`Removed: ${removed}`, 'success');
    updateDisplay();
    drawWheel();
}

function resetOptions() {
    if (confirm('Reset all options? This cannot be undone.')) {
        resetState();
        showMessage('Wheel reset. Start adding options!', 'info');
        updateDisplay();
        drawWheel();
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        addOption();
    }
}

// ==================== WHEEL RENDERING ====================
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (wheelState.options.length === 0) {
        // Draw empty wheel
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#bbb';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Add options to create wheel', centerX, centerY);
        return;
    }

    // Calculate slice angle
    const sliceAngle = (2 * Math.PI) / wheelState.options.length;

    // Draw wheel with rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((wheelState.rotation * Math.PI) / 180);

    for (let i = 0; i < wheelState.options.length; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;

        // Draw slice
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        const textAngle = startAngle + sliceAngle / 2;
        ctx.save();
        ctx.rotate(textAngle);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;

        const text = wheelState.options[i];
        ctx.fillText(text, radius - 20, 5);

        ctx.restore();
    }

    ctx.restore();
}

// ==================== WHEEL SPINNING ====================
function spinWheel() {
    if (wheelState.isSpinning) {
        showMessage('Wheel is already spinning!', 'info');
        return;
    }

    if (wheelState.options.length === 0) {
        showMessage('Add options before spinning!', 'error');
        return;
    }

    if (wheelState.spinCount >= wheelState.maxSpins) {
        showMessage(`Maximum spins (${wheelState.maxSpins}) reached! Reset to spin again.`, 'error');
        return;
    }

    // Disable spin button
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    wheelState.isSpinning = true;

    // Calculate target rotation
    const segmentAngle = 360 / wheelState.options.length;
    const randomOffset = Math.random() * segmentAngle;
    const targetSegment = Math.floor(Math.random() * wheelState.options.length);
    const finalDegrees = wheelState.rotation + (360 * 5) + (targetSegment * segmentAngle) + randomOffset;

    // Animate spin
    animateSpin(finalDegrees, spinButton);
}

function animateSpin(targetRotation, spinButton) {
    const startRotation = wheelState.rotation;
    const startTime = Date.now();
    const duration = 4000; // 4 seconds

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        wheelState.rotation = startRotation + (targetRotation - startRotation) * easeProgress;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ensure final rotation is set correctly
            wheelState.rotation = targetRotation % 360;
            drawWheel();

            // Calculate which option was selected
            const normalizedRotation = (360 - (wheelState.rotation % 360)) % 360;
            const segmentAngle = 360 / wheelState.options.length;
            const selectedIndex = Math.floor(normalizedRotation / segmentAngle) % wheelState.options.length;

            // Show result
            showResult(selectedIndex);

            // Update state
            wheelState.spinCount++;
            wheelState.isSpinning = false;
            spinButton.disabled = false;

            // Check if max spins reached
            if (wheelState.spinCount >= wheelState.maxSpins) {
                showMessage(`Maximum ${wheelState.maxSpins} spins reached! Reset to continue.`, 'info');
            }

            updateDisplay();
        }
    }

    animate();
}

function showResult(index) {
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const spinCounter = document.getElementById('spinCounterDisplay');

    const selected = wheelState.options[index];
    resultValue.textContent = selected.toUpperCase();
    spinCounter.textContent = `Spin #${wheelState.spinCount + 1}`;

    resultSection.classList.remove('show');
    // Trigger reflow to restart animation
    void resultSection.offsetWidth;
    resultSection.classList.add('show');
}

// ==================== UI UPDATES ====================
function updateDisplay() {
    updateOptionsList();
    updateStats();
    updateWheelInfo();
}

function updateOptionsList() {
    const list = document.getElementById('optionsList');

    if (wheelState.options.length === 0) {
        list.innerHTML = '<li class="empty-message">No options yet. Add some to get started!</li>';
        return;
    }

    list.innerHTML = wheelState.options
        .map((option, index) => `
            <li class="option-item">
                <div style="display: flex; align-items: center; flex: 1;">
                    <div class="option-number">${index + 1}</div>
                    <div class="option-text">${option}</div>
                </div>
                <div class="option-actions">
                    <button class="btn-remove" onclick="removeOption(${index})">Remove</button>
                </div>
            </li>
        `)
        .join('');
}

function updateStats() {
    document.getElementById('optionCount').textContent = wheelState.options.length;
    document.getElementById('spinCount').textContent = `${wheelState.spinCount}`;
}

function updateWheelInfo() {
    const info = document.getElementById('wheelInfo');
    if (wheelState.options.length === 0) {
        info.textContent = 'Add at least one option to spin the wheel.';
        info.className = 'message info';
    } else if (wheelState.spinCount >= wheelState.maxSpins) {
        info.textContent = `You've reached the maximum of ${wheelState.maxSpins} spins! Click "Reset Wheel" to start over.`;
        info.className = 'message info';
    } else {
        info.textContent = `Ready to spin! You have ${wheelState.maxSpins - wheelState.spinCount} spin${wheelState.spinCount === 9 ? '' : 's'} remaining.`;
        info.className = 'message info';
    }
}

function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 4000);
}

// ==================== RESPONSIVE CANVAS ====================
window.addEventListener('resize', () => {
    if (!document.getElementById('mainApp').classList.contains('hidden')) {
        drawWheel();
    }
});

// Initialize canvas size
window.addEventListener('load', () => {
    const canvas = document.getElementById('wheelCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawWheel();
});
