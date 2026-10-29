// JavaScript logic for the login page

// Function to display error messages from PHP
function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block'; // Show the message

    // Hide the message after 2 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 2000);
}

//#region RFID

// RFID feature toggle
let rfid_enabled = false;

// Check if the script is running in an Electron app; if so, enable RFID functionality
let ipcRenderer;
if (typeof require !== 'undefined' && typeof require('electron') !== 'undefined') {
    ipcRenderer = require('electron').ipcRenderer;
    rfid_enabled = true;
} else {
    console.log('Running in browser, Electron features are disabled.');
    rfid_enabled = false;
}

// If RFID is enabled, listen for RFID events from Electron's ipcRenderer
if (rfid_enabled) {
    ipcRenderer.on('rfid', (event, rfid) => {
        // Set the RFID value in the form and submit it automatically
        document.getElementById('rfid').value = rfid;
        document.getElementById('loginForm').submit();
    });
}

//#endregion

//#region Time/Date/Clock

// Function to update the digital and analog clocks
function updateClock() {
    var now = new Date();

    // Extract time and date components
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.toLocaleString('default', { month: 'long' });
    var year = now.getFullYear();

    // Format time components
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;
    var dateString = `${day} ${month} ${year}`;

    // Display the formatted time and date
    document.getElementById('digital-clock').innerHTML = timeString + '<br>' + dateString;

    // Update the analog clock display
    drawAnalogClock(now);
}

// Function to draw the analog clock on a canvas
function drawAnalogClock(now) {
    var canvas = document.getElementById('analog-clock');
    var ctx = canvas.getContext('2d');
    var radius = canvas.height / 2;

    // Clear the previous clock display
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center the clock on the canvas
    ctx.translate(radius, radius);

    // Draw the clock face
    drawClockFace(ctx, radius);

    // Draw the hour, minute, and second hands
    drawClockHands(ctx, now, radius);

    // Reset the context translation for other drawings
    ctx.translate(-radius, -radius);
}

// Function to draw the clock face (circle and border)
function drawClockFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI); // Draw the circle
    ctx.fillStyle = "#fff"; // Set face color to white
    ctx.fill();

    // Draw the clock border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333'; // Dark border color
    ctx.stroke();
}

// Function to draw the hour, minute, and second hands
function drawClockHands(ctx, now, radius) {
    var hour = now.getHours() % 12;
    var minute = now.getMinutes();
    var second = now.getSeconds();

    // Calculate angles for each hand based on time
    var hourPos = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    var minutePos = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    var secondPos = (second * Math.PI / 30);

    // Draw hour hand
    drawHand(ctx, hourPos, radius * 0.5, 7);

    // Draw minute hand
    drawHand(ctx, minutePos, radius * 0.8, 5);

    // Draw second hand
    drawHand(ctx, secondPos, radius * 0.9, 2);
}

// Helper function to draw a clock hand
function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round"; // Rounded hand ends
    ctx.moveTo(0, 0); // Start from the clock center
    ctx.rotate(pos); // Rotate to calculated position
    ctx.lineTo(0, -length); // Draw hand length
    ctx.stroke(); // Render the hand
    ctx.rotate(-pos); // Reset rotation for the next hand
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();

//#endregion