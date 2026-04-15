const COLORS = [        // colors for each segment of the wheel (10)
    '#FF6B6B', '#45B7D1', '#ffa6ec', '#4eceb3',
    '#F7DC6F', '#BB8FCE', '#9cfdff', '#85ffb8',
    '#ffa856', '#D7BDE2'
];

function createInitialState() {
    return {
        options: [],
        spinCount: 0,
        isSpinning: false,
        rotation: 0,
        maxSpins: 10
    };
}

let wheelState = createInitialState();

function $(id) {    //makes DOM look ups shorter throughout the file
    return document.getElementById(id);
}

function refreshUI() {
    updateDisplay();
    drawWheel();
}

function resetState() {
    wheelState = createInitialState();
}

function resizeCanvas() {
    const canvas = $('wheelCanvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function startApplication() {
    $('welcomeScreen').classList.add('hidden');
    $('mainApp').classList.remove('hidden');
    resizeCanvas();
    refreshUI();
}

function backToWelcome() {      //links to button: Back to Menu
    if (!confirm('Are you sure? You will lose your current wheel.')) { //!confirm() displays a dialog box with a specified message, along with an "OK" and a "Cancel" button. Returns true if the user clicks "OK" and false if the user clicks "Cancel".
        return;
    }

    $('mainApp').classList.add('hidden');
    $('welcomeScreen').classList.remove('hidden');
    resetState();
    updateDisplay();
}

// Adds a new option from the input field to the wheel.
function addOption() {
    const input = $('optionInput');
    const option = input.value.trim().toLowerCase();

    if (!option) {
        showMessage('Input cannot be empty. Please enter something.', 'error');
        return;
    }

    if (option === 'done') {
        showMessage('Reserved word: "done" cannot be used as an option.', 'error');
        return;
    }

///////////////////

    wheelState.options.push(option);
    input.value = '';
    input.focus();
    showMessage('Option added successfully!', 'success');
    refreshUI();
}

// Removes one option by its index and refreshes the UI.
function removeOption(index) {
    const removed = wheelState.options[index];
    wheelState.options.splice(index, 1);
    showMessage(`Removed: ${removed}`, 'success');
    refreshUI();
}

// Resets all options after user confirmation.
function resetOptions() {
    if (!confirm('Reset all options? This cannot be undone.')) {
        return;
    }

    resetState();
    showMessage('Wheel reset. Start adding options!', 'info');
    refreshUI();
}

// Adds an option when the Enter key is pressed.
function handleEnter(event) {
    if (event.key === 'Enter') {
        addOption();
    }
}

// Draws the wheel and all option slices on the canvas.
function drawWheel() {
    const canvas = $('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);       //API method that erases pixels in a rectangular area

    if (wheelState.options.length === 0) {
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

    const sliceAngle = (2 * Math.PI) / wheelState.options.length;   //to calculate the angle of each section of the wheel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((wheelState.rotation * Math.PI) / 180);

    wheelState.options.forEach((option, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;

        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        const textAngle = startAngle + sliceAngle / 2;
        ctx.save();
        ctx.rotate(textAngle);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(option, radius - 20, 5);
        ctx.restore();
    });

    ctx.restore();
}

// Checks whether spinning is allowed right now.
function canSpin() {
    if (wheelState.isSpinning) {
        showMessage('Wheel is already spinning!', 'info');
        return false;
    }

    if (wheelState.options.length === 0) {
        showMessage('Add options before spinning!', 'error');
        return false;
    }

    if (wheelState.spinCount >= wheelState.maxSpins) {
        showMessage(`Maximum spins (${wheelState.maxSpins}) reached! Reset to spin again.`, 'error');
        return false;
    }

    return true;
}

// Calculates which option is selected by the current rotation.
function getSelectedIndex() {
    const segmentAngle = 360 / wheelState.options.length;
    const normalizedRotation = (360 - (wheelState.rotation % 360)) % 360;
    return Math.floor(normalizedRotation / segmentAngle) % wheelState.options.length;
}

// Starts a spin by computing a random target rotation.
function spinWheel() {
    if (!canSpin()) {
        return;
    }

    const spinButton = $('spinButton');
    spinButton.disabled = true;     //button can't be pressed if already spinning
    wheelState.isSpinning = true;

    const segmentAngle = 360 / wheelState.options.length;
    const finalDegrees =
        wheelState.rotation +
        (360 * 5) +     //5 rotations for visual effect
        (Math.floor(Math.random() * wheelState.options.length) * segmentAngle) +
        (Math.random() * segmentAngle);

    animateSpin(finalDegrees, spinButton);
}

// Animates the wheel rotation and finishes the spin state.
function animateSpin(targetRotation, spinButton) {
    const startRotation = wheelState.rotation;
    const startTime = Date.now();
    const duration = 4000;

    // Advances each animation frame until the spin completes.
    //stops on option, displays option, marks wheel as not spinning, enables spin button, refreshes UI, might send message
    function animate() {
        const progress = Math.min((Date.now() - startTime) / duration, 1);      //spin time
        const easeProgress = 1 - Math.pow(1 - progress, 3);     //slows spinning before wheel stops
        wheelState.rotation = startRotation + (targetRotation - startRotation) * easeProgress;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
            return;
        }

        wheelState.rotation = targetRotation % 360;
        drawWheel();
        showResult(getSelectedIndex());

        wheelState.spinCount += 1;
        wheelState.isSpinning = false;
        spinButton.disabled = false;

        if (wheelState.spinCount >= wheelState.maxSpins) {
            showMessage(`Maximum ${wheelState.maxSpins} spins reached! Reset to continue.`, 'info');
        }

        updateDisplay();
    }

    animate();
}

// Displays the selected option with a result animation.
function showResult(index) {
    const resultSection = $('resultSection');
    $('resultValue').textContent = wheelState.options[index].toUpperCase();
    $('spinCounterDisplay').textContent = `Spin #${wheelState.spinCount + 1}`;

    resultSection.classList.remove('show');
    void resultSection.offsetWidth;
    resultSection.classList.add('show');
}

// Refreshes all display sections that reflect wheel state.
function updateDisplay() {
    updateOptionsList();
    updateStats();
    updateWheelInfo();
}

// Renders the current options list in the sidebar.
function updateOptionsList() {
    const list = $('optionsList');

    if (wheelState.options.length === 0) {
        list.innerHTML = '<li class="empty-message">No options yet. Add some to get started!</li>';
        return;
    }

    // Build the list items dynamically so each remove button can bind its own handler.
    list.innerHTML = '';

    wheelState.options.forEach((option, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'option-item';

        const optionContent = document.createElement('div');
        optionContent.style.display = 'flex';
        optionContent.style.alignItems = 'center';
        optionContent.style.flex = '1';

        const optionNumber = document.createElement('div');
        optionNumber.className = 'option-number';
        optionNumber.textContent = `${index + 1}`;

        const optionText = document.createElement('div');
        optionText.className = 'option-text';
        optionText.textContent = option;

        optionContent.appendChild(optionNumber);
        optionContent.appendChild(optionText);

        const optionActions = document.createElement('div');
        optionActions.className = 'option-actions';

        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove';
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeOption(index));

        optionActions.appendChild(removeButton);
        listItem.appendChild(optionContent);
        listItem.appendChild(optionActions);
        list.appendChild(listItem);
    });
}

// Updates numeric stats like option and spin counts.
function updateStats() {
    $('optionCount').textContent = wheelState.options.length;
    $('spinCount').textContent = `${wheelState.spinCount}`;
}

// Updates the info message shown near the wheel.
function updateWheelInfo() {
    const info = $('wheelInfo');

    if (wheelState.options.length === 0) {
        info.textContent = 'Add at least one option to spin the wheel.';
    } else if (wheelState.spinCount >= wheelState.maxSpins) {
        info.textContent = `You've reached the maximum of ${wheelState.maxSpins} spins! Click "Reset Wheel" to start over.`;
    } else {
        const remaining = wheelState.maxSpins - wheelState.spinCount;
        info.textContent = `Ready to spin! You have ${remaining} spin${remaining === 1 ? '' : 's'} remaining.`;
    }

    info.className = 'message info';
}

// Shows a temporary status message to the user.
function showMessage(text, type = 'info') {
    const messageDiv = $('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 4000);
}

// Resizes and redraws the wheel when the window size changes.
window.addEventListener('resize', () => {
    if ($('mainApp').classList.contains('hidden')) {
        return;
    }

    resizeCanvas();
    drawWheel();
});

window.addEventListener('load', () => {
    resizeCanvas();
    drawWheel();
});

$('startButton').addEventListener('click', startApplication);
$('addButton').addEventListener('click', addOption);
$('resetButton').addEventListener('click', resetOptions);
$('backButton').addEventListener('click', backToWelcome);
$('spinButton').addEventListener('click', spinWheel);
$('optionInput').addEventListener('keypress', handleEnter);
