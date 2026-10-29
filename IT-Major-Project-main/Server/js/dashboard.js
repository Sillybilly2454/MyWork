// Function to handle the display of sign-out options based on selected reason
function handleSignOutReason() {
    var reason = document.getElementById('signOutReason').value;
    var studyInfo = document.getElementById('studySignOutInfo');
    var receptionInfo = document.getElementById('receptionSignOutInfo');

    if (reason === 'study') {
        studyInfo.style.display = 'block';
        receptionInfo.style.display = 'none';
    } else if (reason === 'other') {
        studyInfo.style.display = 'none';
        receptionInfo.style.display = 'block';
    } else {
        studyInfo.style.display = 'none';
        receptionInfo.style.display = 'none';
    }
}

// Function for signing in, checking attendance status
function signIn() {
    if (attendanceStatus === '') {
        openPopup('lateSignInPopup');
    } else if (attendanceStatus === 'out') {
        document.getElementById('previousReasonDisplay').textContent = previousReason;
        openPopup('signInAfterSignOutPopup');
    }
}

// Function for signing out, checking if currently signed in
function signOut() {
    if (attendanceStatus === 'in') {
        openPopup('signOutPopup');
    }
}

// Function to handle attendance submission
function submitAttendance(id) {
    reason = "";
    status = "";

    // Determine the reason and status based on the popup ID
    if (id === 'lateSignInPopup') {
        // Get and trim the late reason from input
        reason = document.getElementById('lateReason').value.trim();

        // Check if the reason input is empty
        if (reason === "") {
            // Show an error message if no reason is provided
            showCustomPopup("Please provide a valid reason for being late.", [
                { text: 'OK', action: function() { console.log('Popup closed'); } }
            ]);
            return; // Exit the function to prevent submission
        }

        // Format the reason and set the status as "in" for sign-in
        reason = "Late - " + reason;
        status = 'in';

    } else if (id === 'signInAfterSignOutPopup') {
        // Set the reason as "Returning" with the previous reason if signing back in
        reason = "Returning - " + previousReason;
        status = 'in';

    } else if (id === 'signOutPopup') {
        // Set the reason from the sign-out reason input and set status as "out"
        reason = document.getElementById('signOutReason').value;
        status = 'out';
    }

    // Close the popup that triggered this submission
    closePopup(id);

    // Submit attendance data via a fetch request
    fetch(`attendance_submission.php?reason=${reason}&status=${status}`)
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            if (data.success) {
                generatePrintSlip(data); // Generate a print slip if submission is successful
                openPopup("confirmationPopup"); // Show confirmation popup
            } else {
                // Display an error message if submission fails
                showCustomPopup(data.message || "Error submitting attendance.", [
                    { text: 'OK', action: function() { console.log('Popup closed'); location.reload();} }
                ]);
            }
        })
        .catch(error => console.error('Error:', error)); // Log any network error

}

// Functions to open and close popups by adjusting display style
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Function to display a custom popup with a message and specified buttons
function showCustomPopup(message, buttons) {
    const popup = document.getElementById('customPopup');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    // Set the popup message
    popupMessage.innerText = message;

    // Clear any existing buttons in the popup
    popupButtons.innerHTML = '';

    // Create each button with specified text and action
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.innerText = button.text;
        btn.className = "btn";
        btn.onclick = function() {
            button.action(); // Execute the button's action
            closePopup('customPopup'); // Close the popup after action
        };
        popupButtons.appendChild(btn);
    });

    // Display the popup
    popup.style.display = 'block';
}

//#region Timetable Creation

// Function to dynamically create and display the timetable
function createTimetable(container, week, data) {
    const table = document.createElement('table'); // Create table element

    // Table header with days of the week and periods
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const periods = ['Period', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    periods.forEach(period => {
        const th = document.createElement('th'); // Create table header for each day
        th.textContent = period; // Set the day name as text
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const numPeriods = 6; // Including Pc and 5 periods

    // Create rows for each period
    for (let p = 0; p < numPeriods; p++) {
        const tr = document.createElement('tr'); // Row for the current period
        const tdPeriod = document.createElement('td');
        tdPeriod.className = 'period-header';
        tdPeriod.textContent = p === 0 ? 'Pc' : `Period ${p}`; // Set period name
        tr.appendChild(tdPeriod);
        
        // Add cell data for each day in the current period
        for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            // Populate with class names for the current period and day
            td.innerHTML = data[week][d][p] ? data[week][d][p].map(item => item.class_name).join(', ') : '';
            tr.appendChild(td);
        }
        tbody.appendChild(tr); // Add row to the table body
    }

    table.appendChild(tbody);
    container.appendChild(table); // Add the entire table to the container
}

// Function to setup and display a timetable for each week
function setupTimetable(class_ids, student_id) {
    fetch(`fetch_timetable_data.php?class_ids=${class_ids}`) // Fetch timetable data based on class IDs
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('timetable-container');
            container.innerHTML = ''; // Clear any existing content in the container

            // Add Week 1 timetable to container
            const week1Header = document.createElement('h3');
            week1Header.className = 'week-header';
            week1Header.textContent = 'Week 1';
            container.appendChild(week1Header);
            createTimetable(container, 1, data);

            // Add Week 2 timetable to container
            const week2Header = document.createElement('h3');
            week2Header.className = 'week-header';
            week2Header.textContent = 'Week 2';
            container.appendChild(week2Header);
            createTimetable(container, 2, data);
        })
        .catch(error => console.error('Error fetching timetable data:', error)); // Log any fetch errors
}

// Function to display timetable based on the student ID
function showTimetable() {
    id = student_id; // Assume student_id is retrieved from the backend

    if (id === null) {
        console.error('No student ID provided'); // Log error if no ID is available
        return;
    }

    fetch(`fetch_row.php?id=${id}&table=${'students'}`) // Fetch class data for the student
        .then(response => response.json())
        .then(data => {
            setupTimetable(data.class_ids, id); // Setup the timetable with retrieved class IDs
            openPopup('timetablePopup'); // Display the timetable in a popup
        })
        .catch(error => console.error('Error fetching class data:', error)); // Log any fetch errors
}
//#endregion

//#region Attendance Slip Generation

// Function to generate and display an attendance confirmation slip
function generatePrintSlip(data) {
    const slipContent = `
        <div id="printableArea">
            <img src="images/SMMC_Teal-20342cb8.png">
            <h2 style="text-align: center;">Attendance Confirmation Slip</h2>
            <h3 style="text-align: center;">St Mary Mackillop College, Canberra</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Date:</strong> ${data.attendance.date}</p>
            <p><strong>Time:</strong> ${data.attendance.time}</p>
            <p><strong>Status:</strong> ${data.attendance.status === 'in' ? 'Signed In' : 'Signed Out'}</p>
            <p><strong>Reason:</strong> ${data.attendance.reason}</p>
        </div>
    `;

    // Set the slip content in the printable area
    document.getElementById('printableArea').innerHTML = slipContent;
}

// Function to print the attendance confirmation slip
function printAttendanceConfirmation() {
    const printableContent = document.getElementById("printableArea").innerHTML;

    // Create a new window for printing
    const printWindow = window.open("", "", "width=800,height=600");

    // Add the slip content and styling to the new window
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Attendance Slip</title>
                <link rel="stylesheet" href="css/mackillop school theme.css">
                <link rel="stylesheet" href="css/dashboard.css">
            </head>
            <body>
                ${printableContent}
            </body>
        </html>
    `);

    printWindow.document.close(); // Finalize the new document
    printWindow.print(); // Trigger the print dialog
    printWindow.close(); // Close the print window after printing

    window.location.href = "logout.php"; // Redirect user to logout page after printing
}
//#endregion

//#region RFID

// Check if running inside Electron, which enables RFID functionality
let rfid_enabled = false;

let ipcRenderer;
if (typeof require !== 'undefined' && typeof require('electron') !== 'undefined') {
    // If Electron is available, set up ipcRenderer for inter-process communication
    ipcRenderer = require('electron').ipcRenderer;
    rfid_enabled = true; // Enable RFID functionality
} else {
    console.log('Running in browser, Electron features are disabled.');
    rfid_enabled = false; // Disable RFID functionality
}

// References to the current RFID input field and scan button (when listening)
let currentRFIDField = null;
let currentScanButton = null;

// Function to start listening for RFID data
function startRFIDListening(rfidFieldId, buttonId) {
    if (rfid_enabled) {
        // Get the RFID input field and scan button elements by ID
        currentRFIDField = document.getElementById(rfidFieldId);
        currentScanButton = document.getElementById(buttonId);
        
        // Disable the scan button and update its text to indicate scanning status
        currentScanButton.disabled = true;
        currentScanButton.textContent = 'Scanning for RFID...';
    }
}

// Function to stop listening for RFID data and reset button state
function stopRFIDListening() {
    if (currentScanButton != null && rfid_enabled) {
        // Reset the button text and re-enable the scan button
        currentScanButton.textContent = 'Scan RFID';
        currentScanButton.disabled = false;
        
        // Clear the references to the RFID field and scan button
        currentRFIDField = null;
        currentScanButton = null;
    }
}

// If RFID is enabled, set up an event listener to receive RFID data
if (rfid_enabled) {
    ipcRenderer.on('rfid', (event, rfid) => {
        // When RFID data is received, populate the current RFID input field and stop listening
        if (currentRFIDField && currentScanButton) {
            currentRFIDField.value = rfid; // Set the RFID value
            stopRFIDListening(); // Stop listening and reset button state
        }
    });
}

//#endregion

//#region Time/Date/Clock
function updateClock() {
    var now = new Date();
    
    // Get time and date components
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.toLocaleString('default', { month: 'long' });
    var year = now.getFullYear();
    
    // Format time and date
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    var timeString = hours + ':' + minutes + ':' + seconds;
    var dateString = `${day} ${month} ${year}`;
    
    // Display the time and date
    document.getElementById('digital-clock').innerHTML = timeString + '<br>' + dateString;
    
    // Draw the analog clock
    drawAnalogClock(now);
}

// Function to draw the clock on the canvas
function drawAnalogClock(now) {
    var canvas = document.getElementById('analog-clock');
    var ctx = canvas.getContext('2d');
    var radius = canvas.height / 2;
    
    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move the origin to the center of the clock
    ctx.translate(radius, radius);
    
    // Draw the clock face (circle)
    drawClockFace(ctx, radius);
    
    // Draw the clock hands (hour, minute, and second)
    drawClockHands(ctx, now, radius);
    
    // Reset the translation back to the top-left corner for next drawings
    ctx.translate(-radius, -radius);
}

// Function to draw the clock face (background circle)
function drawClockFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI); // Draw a full circle
    ctx.fillStyle = "#fff"; // White clock face
    ctx.fill();

    // Add an outer stroke around the clock face
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333'; // Dark border for the clock
    ctx.stroke();
}

// Function to draw the clock hands (hour, minute, and second)
function drawClockHands(ctx, now, radius) {
    var hour = now.getHours() % 12;
    var minute = now.getMinutes();
    var second = now.getSeconds();

    // Calculate angles for the hour, minute, and second hands
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

// Helper function to draw each hand of the clock
function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round"; // Rounded ends for the hands
    ctx.moveTo(0, 0); // Start from the center of the clock
    ctx.rotate(pos); // Rotate to the correct angle
    ctx.lineTo(0, -length); // Draw the line to represent the hand
    ctx.stroke(); // Render the line
    ctx.rotate(-pos); // Reset the rotation back for the next hand
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();
//#endregion