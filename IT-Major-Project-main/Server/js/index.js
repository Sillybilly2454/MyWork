// JavaScript logic for the System Admin Password page

//#region RFID
// Check if the script is running in an Electron environment
let rfid_enabled = false;
let ipcRenderer;

if (typeof require !== 'undefined' && typeof require('electron') !== 'undefined') {
    ipcRenderer = require('electron').ipcRenderer; // Get Electron's IPC renderer for communication
    rfid_enabled = true;
} else {
    console.log('Running in browser, Electron features are disabled.');
    rfid_enabled = false;
}

const closeAppButton = document.getElementById('closeAppButton');

// Enable close functionality if running in Electron
if (rfid_enabled) {
    closeAppButton.addEventListener('click', function() {
        ipcRenderer.send('close-app'); // Send 'close-app' signal to main Electron process
    });
} else {
    // Disable button if not running in Electron
    closeAppButton.disabled = true;
    closeAppButton.title = "Not running as application so it cannot be closed.";
}

//#endregion

// Handle admin password form submission
document.getElementById('adminPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const password = document.getElementById('admin_password').value; // Get entered password

    // Send the password to the server for verification
    fetch('verify_system_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'admin_password=' + encodeURIComponent(password) // Send encoded password
    })
    .then(response => response.json()) // Parse response as JSON
    .then(data => {
        if (data.status === 'success') {
            window.location.href = 'login.php'; // Redirect on success
        } else {
            displayMessage(data.message); // Display error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('An error occurred. Please try again.'); // Display generic error message
    });
});

// Display a message for error or status updates
function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message; // Set the message text
    messageDiv.style.display = 'block'; // Show the message

    // Automatically hide the message after 2 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 2000);
}