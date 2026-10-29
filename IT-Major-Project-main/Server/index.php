<?php
session_start(); // Start session to track system login state

// Redirect if the system password is already set in session
if (isset($_SESSION['system_password'])) {
    header("Location: login.php"); // Redirect to login page
    exit();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Admin Password</title>
    
    <!-- Link to the school's main CSS and additional styles -->
    <link rel="stylesheet" href="css/mackillop school theme.css">
    <link rel="stylesheet" href="css/simple.css"> 

    <style>
        /* Styling for the close application button */
        button#closeAppButton {
            background-color: #ff9500;
            border: none;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 14px;
            width: auto;
            border-radius: 5px;
            transition: background-color 0.2s ease;
        }

        button#closeAppButton:hover {
            background-color: #e68900;
        }

        button#closeAppButton[disabled] {
            background-color: #dfeef5;
            color: #0096ba;
            cursor: not-allowed;
        }
    </style>
</head>
<body>

    <!-- School logo at the top of the form -->
    <img src="images/SMMC_Teal-20342cb8.png" alt="School Logo">

    <div class="popup-container">
        <div class="form-container">
            <h2>Enter System Admin Password</h2>
            <div id="message"></div>
            <!-- Form to collect the system admin password -->
            <form id="adminPasswordForm">
                <input type="password" id="admin_password" name="admin_password" placeholder="System Password" required>
                <input type="submit" value="Submit" class="btn">
            </form>
        </div>

        <!-- Button to close the application if running threw electron -->
        <button id="closeAppButton">Close Application</button>
    </div>

    <!-- JavaScript for form handling and app closure logic -->
    <script src="js/index.js"></script>
</body>
</html>