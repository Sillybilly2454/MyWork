<?php
session_start(); // Start the session to check if the system is verified and logged in

// Redirect to system login if there's no stored password in the session
if (!isset($_SESSION['system_password'])) {
    header("Location: index.php"); // Send the user to the system login page
    exit(); // Stop further execution after redirect
}

// Set the timezone to Sydney for date/time functions
date_default_timezone_set('Australia/Sydney'); 
?>
