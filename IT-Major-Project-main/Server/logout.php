<?php
include 'session_config.php';  // Load session settings

// Temporarily store the system password if it exists in the session
if (isset($_SESSION['system_password'])) {
    $savedPassword = $_SESSION['system_password'];
}

// Clear out all session variables
session_unset(); // Remove any existing session data
session_destroy(); // Fully end the session

// Start a new session
session_start();

// Restore the system password on this new session
$_SESSION['system_password'] = $savedPassword;

// Redirect to login page
header("Location: login.php");
exit();
?>
