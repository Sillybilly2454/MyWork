<?php
include 'session_config.php'; // Load session settings

// Check if the user is logged in. If not, redirect to login
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Check if user is admin. If yes, redirect to the admin dashboard
if ($_SESSION['is_admin']) {
    header("Location: admin_dashboard.php");
    exit();
}

include 'db.php'; // Connect to the database

// Sanitize and retrieve student and user IDs from the session
$student_id = (int)$_SESSION['student_id'];
$user_id = (int)$_SESSION['user_id'];

// Function to get the most recent attendance record for today
function getMostRecentAttendance($conn, $student_id) {
    $today = date('Y-m-d'); // Get today's date
    $query = "SELECT * FROM attendance WHERE student_id = $student_id AND date = '$today' ORDER BY time DESC LIMIT 1"; // Fetch the most recent attendance record for today
    return $conn->query($query);
}

// Fetch today's most recent attendance record for the student
$attendanceResult = getMostRecentAttendance($conn, $student_id);
$attendanceStatus = null;
$previousReason = ''; // Store previous reason for sign-out

if ($attendanceResult->num_rows > 0) {
    $attendanceStatus = $attendanceResult->fetch_assoc(); // Get the attendance record for today
    if ($attendanceStatus['status'] === 'out') {
        $previousReason = $attendanceStatus['reason']; // Capture the reason for the last sign-out
    }
}

// Determine what buttons to show
$showCheckIn = true;  // Default to showing Check In
$showCheckOut = false; // Default to not showing Check Out

if ($attendanceStatus) {
    if ($attendanceStatus['status'] === 'out') {
        $showCheckIn = true;
        $showCheckOut = false; // Show Check In if they are checked out
    } else if ($attendanceStatus['status'] === 'in') {
        $showCheckIn = false; // Show Check Out if they are checked in
        $showCheckOut = true;
    }
}

// Fetch user's current RFID from the database
$query = "SELECT rfid FROM users WHERE user_id = $user_id";
$result = $conn->query($query);
$rfid = '';

// If found save rfid
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $rfid = $row['rfid'];
}

// Update RFID when submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_rfid'])) {
    $new_rfid = $conn->real_escape_string($_POST['new_rfid']);

    // Update RFID in the database
    $update_query = "UPDATE users SET rfid = '$new_rfid' WHERE user_id = $user_id";
    $conn->query($update_query);

    // Refresh RFID
    $rfid = $new_rfid;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>

    <!-- Link to CSS files for theme and dashboard styling -->
    <link rel="stylesheet" href="css/mackillop school theme.css">
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <!-- School Logo -->
    <img src="images/SMMC_Teal-20342cb8.png" alt="School Logo">

    <!-- Clock display (digital and analog) -->
    <div id="clock-container">
        <div id="digital-clock"></div>
        <canvas id="analog-clock" width="150" height="150"></canvas>
    </div>

    <!-- Main dashboard container with welcome message and Check In/Out options -->
    <div class="dashboard-container">
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h2>

        <!-- Check In button, visible based on PHP logic -->
        <?php if ($showCheckIn): ?>
            <button name="check_in" value="Check In" onclick="signIn()" class="btn">Check In</button>
        <?php endif; ?>

        <!-- Check Out button, visible based on PHP logic -->
        <?php if ($showCheckOut): ?>
            <button name="check_out" value="Check Out" onclick="signOut()" class="btn">Check Out</button>
        <?php endif; ?>

        <!-- Logout button -->
        <a href="logout.php" class="btn logout-btn">Log Out</a>
    </div>
                
    <!-- Additional options for viewing timetable and managing RFID -->
    <button class="btn timetable-btn" onclick="showTimetable()">View Timetable</button>
    <button onclick="openPopup('rfidPopup')" class="btn rfid-btn">Manage RFID</button>

    <!-- Popup for RFID management -->
    <div class="popup" id="rfidPopup">
        <div class="popup-content">
            <h3>RFID Management</h3>
            <p>Current RFID: <?php echo htmlspecialchars($rfid ?? 'None'); ?></p>

            <!-- Form to add or update RFID -->
            <form action="dashboard.php" method="post" class="add-rfid">
                <input type="text" id="newRFID" name="new_rfid" placeholder="Enter new RFID" value="<?php echo htmlspecialchars($rfid); ?>" required>
                <button type="button" id="rfidScanBtn" onclick="startRFIDListening('newRFID', 'rfidScanBtn')" class="btn">Scan RFID</button>
                <button type="submit" name="update_rfid" class="btn">Update RFID</button>
            </form>

            <!-- Button to close RFID popup -->
            <button class="btn close-popup" onclick="closePopup('rfidPopup')">Close</button>
        </div>
    </div>

    <!-- Popup for late sign-in -->
    <div class="popup" id="lateSignInPopup">
        <div class="popup-content">
            <h3>You're late!</h3>
            <p>Please provide a short reason for being late:</p>
            <textarea id="lateReason" rows="4" style="width: 100%; resize: none;" maxlength="85"></textarea>
            <button class="btn" onclick="submitAttendance('lateSignInPopup')">Submit</button>
            <button class="btn close-popup" onclick="closePopup('lateSignInPopup')">Close</button>
        </div>
    </div>

    <!-- Popup for signing in after signing out -->
    <div class="popup" id="signInAfterSignOutPopup">
        <div class="popup-content">
            <h3>Sign-In after Sign-Out</h3>
            <p>You previously signed out for: <strong id="previousReasonDisplay"></strong></p>
            <button class="btn" onclick="submitAttendance('signInAfterSignOutPopup')">Sign In</button>
            <button class="btn close-popup" onclick="closePopup('signInAfterSignOutPopup')">Close</button>
        </div>
    </div>

    <!-- Sign-Out popup with reasons for signing out -->
    <div class="popup" id="signOutPopup">
        <div class="popup-content">
            <h3>Sign Out</h3>
            <p>Please select your reason for signing out:</p>
            <select id="signOutReason" onchange="handleSignOutReason()">
                <option value="">Select a reason</option>
                <option value="study">Study</option>
                <option value="other">Other Reason</option>
            </select>
            <!-- Conditional message and buttons based on reason -->
            <div id="studySignOutInfo" style="display: none;">
                <p>You are signing out for study. Please confirm:</p>
                <button class="btn" onclick="submitAttendance('signOutPopup')">Confirm</button>
            </div>
            <div id="receptionSignOutInfo" style="display: none;">
                <p>For other reasons, please go to the student reception to ensure you're allowed to leave.</p>
            </div>
            <button class="btn close-popup" onclick="closePopup('signOutPopup')">Close</button>
        </div>
    </div>

    <!-- Confirmation popup for printing attendance slip -->
    <div id="confirmationPopup" class="popup">
        <div class="popup-content">
            <p id="printableArea"></p> 
            <!-- Area for attendance slip content -->

            <p id="printQuery">Do you want a physical copy?</p>
            <button id="printAttendance" class="btn" onclick="printAttendanceConfirmation()">Print</button>

            <a href="logout.php" class="btn logout-btn">Log Out</a>
        </div>
    </div>

    <!-- Timetable popup display -->
    <div id="timetablePopup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closePopup('timetablePopup')">&times;</span>
            <h1>Timetable</h1>
            <div id="timetable-container"></div>
        </div>
    </div>

    <!-- Custom message popup for various alerts -->
    <div id="customPopup" class="popup">
        <div class="popup-content">
            <p id="popupMessage"></p>
            <div id="popupButtons" class="popup-buttons"></div>
        </div>
    </div>

    <!-- JavaScript variables for use in the script -->
    <script>
        var attendanceStatus = "<?php echo $attendanceStatus ? $attendanceStatus['status'] : ''; ?>";
        var previousReason = "<?php echo $previousReason; ?>";
        var student_id = "<?php echo $student_id; ?>";
    </script>
    <script src="js/dashboard.js"></script> <!-- Main JavaScript file for dashboard functionality -->
</body>
</html>