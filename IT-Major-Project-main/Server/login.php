<?php
include 'session_config.php'; // Load session settings
include 'db.php'; // Connect to the database

// School hours (9 AM - 3:15 PM)
$school_start = new DateTime('09:00');
$school_end = new DateTime('15:15');
$current_time = new DateTime();

// Get the current day of the week (1 = Monday, 7 = Sunday)
$current_day = $current_time->format('N');

// Check if the user is already logged in
if (isset($_SESSION['user_id'])) {
    // Move them to the student dashboard if they are
    header("Location: dashboard.php");
    exit();
}

// Function to call the JavaScript displayMessage function from PHP
function displayMessage($message) {
    echo "<script>
        document.addEventListener('DOMContentLoaded', function() {
            displayMessage('$message');
        });
    </script>";
}

// Handle RFID or Form Login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if RFID login
    if (!empty($_POST['rfid'])) {
        $rfid = $_POST['rfid'];

        // Use prepared statement to avoid SQL injection and syntax errors
        // Securely get user data with matching RFID
        $stmt = $conn->prepare("SELECT * FROM users WHERE rfid = ?");
        $stmt->bind_param("s", $rfid);  // Bind the RFID parameter as a string
        $stmt->execute();

        // Prepare result for later use
        $result = $stmt->get_result();
    } else {
        // Handle form-based login
        $username = $conn->real_escape_string($_POST['username']);
        $password = $_POST['password'];

        // Securely get user data with matching username
        $sql = "SELECT * FROM users 
                WHERE username = '$username' 
                AND (student_id IN (SELECT student_id FROM students WHERE is_active = 1) 
                OR is_admin = 1)";
        
        // Prepare result for later use
        $result = $conn->query($sql);
    }

    // Make sure there is a result from the database (user account found)
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc(); // Fetch the user data

        $is_admin = $user['is_admin']; // Value used to see if the user has admin privileges

        $canSignOutCheck = true; // Flag to control login access based on time/day
        
        // If user isn't admin, check day and time restrictions
        if (!$is_admin) {
            if ($current_day > 5) { 
                // Restrict login on weekends (Saturday and Sunday)
                displayMessage('Login is only allowed during school days (Monday - Friday)');
                $canSignOutCheck = false; // Block login attempt
            } else if (!($current_time > $school_start && $current_time < $school_end)) { 
                // Restrict login outside of designated school hours (9:00 AM - 3:15 PM)
                displayMessage('Login is only allowed during school hours (9:00 AM - 3:15 PM)');
                $canSignOutCheck = false; // Block login attempt
            }
        }

        // Proceed with login if time/day check passed or user is an admin
        if ($canSignOutCheck) {
            if (!empty($_POST['rfid'])) { // Check if login is via RFID
                // RFID login success - store user details in session
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['student_id'] = $user['student_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['is_admin'] = $is_admin;

                // Redirect based on user role
                if ($_SESSION['is_admin']) {
                    header('Location: admin_dashboard.php'); // Admin dashboard
                } else {
                    header('Location: dashboard.php'); // Standard user dashboard
                }
            } else { // Handle form-based login (username and password)
                // Verify that the entered password matches the stored hash
                if (password_verify($password, $user['password'])) {
                    // Password correct - store user details in session
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['student_id'] = $user['student_id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['is_admin'] = $is_admin;

                    // Redirect based on user role
                    if ($_SESSION['is_admin']) {
                        header('Location: admin_dashboard.php'); // Admin dashboard
                    } else {
                        header('Location: dashboard.php'); // Standard user dashboard
                    }
                } else {
                    // Password incorrect - show error message
                    displayMessage('Invalid username or password');
                }
            }
        }
    } else {
        // No matching user account found - show error message
        displayMessage('Cannot find account');
    }

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    
    <!-- Link to CSS stylesheets for the school theme and general styling -->
    <link rel="stylesheet" href="css/mackillop school theme.css">
    <link rel="stylesheet" href="css/simple.css">

    <style>
        /* Styling for the clock display */
        #clock-container {
            margin-top: 20px;
        }

        #digital-clock {
            font-size: 20px;
            color: #005494;
        }

        #analog-clock {
            border: 2px solid #005494;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="popup-container">
        <!-- School logo at the top of the login form -->
        <img src="images/SMMC_Teal-20342cb8.png" alt="School Logo">

        <!-- Clock display container -->
        <div id="clock-container">
            <div id="digital-clock"></div>
            <canvas id="analog-clock" width="150" height="150"></canvas>
        </div>

        <!-- Login form container -->
        <div class="form-container">
            <h2>Login</h2>
            <div id="message"></div>
            <form id="loginForm" method="post">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>

                <!-- Hidden input for RFID login (value set via JavaScript) -->
                <input type="hidden" id="rfid" name="rfid" value="">

                <input type="submit" value="Login" class="btn">
            </form>
        </div>
    </div>

    <!-- JavaScript for handling the login functionality -->
    <script src="js/login.js"></script>
</body>
</html>