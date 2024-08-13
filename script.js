// script.js
const joystick = document.getElementById('joystick');
const joystickThumb = document.getElementById('joystick-thumb');
const directionDisplay = document.getElementById('direction');

let isDragging = false;
let centerX, centerY;

function updateDirection(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    
    // Wykrywanie kierunków
    let direction = 'None';
    
    // Ustal granice dla każdego kierunku
    const threshold = 20; // Możesz dostosować ten próg
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
            direction = dx > 0 
                ? (Math.abs(dy) > threshold ? (dy > 0 ? 'Right Down' : 'Right Up') : 'Right') 
                : (Math.abs(dy) > threshold ? (dy > 0 ? 'Left Down' : 'Left Up') : 'Left');
        }
    } else {
        if (Math.abs(dy) > threshold) {
            direction = dy > 0 
                ? (Math.abs(dx) > threshold ? (dx > 0 ? 'Down Right' : 'Down Left') : 'Down') 
                : (Math.abs(dx) > threshold ? (dx > 0 ? 'Up Right' : 'Up Left') : 'Up');
        }
    }

    directionDisplay.textContent = `Direction: ${direction}`;
}

function updateThumbPosition(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.min(centerX, centerY);

    if (distance > maxDistance) {
        const angle = Math.atan2(dy, dx);
        joystickThumb.style.left = `${Math.cos(angle) * maxDistance + centerX - joystickThumb.offsetWidth / 2}px`;
        joystickThumb.style.top = `${Math.sin(angle) * maxDistance + centerY - joystickThumb.offsetHeight / 2}px`;
    } else {
        joystickThumb.style.left = `${x - joystickThumb.offsetWidth / 2}px`;
        joystickThumb.style.top = `${y - joystickThumb.offsetHeight / 2}px`;
    }
}

function handleMouseMove(e) {
    if (isDragging) {
        const rect = joystick.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        updateThumbPosition(x, y);
        updateDirection(x, y);
    }
}

function handleTouchMove(e) {
    if (isDragging) {
        const touch = e.touches[0];
        const rect = joystick.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        updateThumbPosition(x, y);
        updateDirection(x, y);
    }
}

joystick.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = joystick.getBoundingClientRect();
    centerX = rect.width / 2;
    centerY = rect.height / 2;
    updateThumbPosition(e.clientX - rect.left, e.clientY - rect.top);
});

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', () => {
    if (isDragging) {
        joystickThumb.style.left = `${centerX - joystickThumb.offsetWidth / 2}px`;
        joystickThumb.style.top = `${centerY - joystickThumb.offsetHeight / 2}px`;
        directionDisplay.textContent = 'Direction: None';
        isDragging = false;
    }
});

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    const touch = e.touches[0];
    const rect = joystick.getBoundingClientRect();
    centerX = rect.width / 2;
    centerY = rect.height / 2;
    updateThumbPosition(touch.clientX - rect.left, touch.clientY - rect.top);
});

document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', () => {
    if (isDragging) {
        joystickThumb.style.left = `${centerX - joystickThumb.offsetWidth / 2}px`;
        joystickThumb.style.top = `${centerY - joystickThumb.offsetHeight / 2}px`;
        directionDisplay.textContent = 'Direction: None';
        isDragging = false;
    }
});
