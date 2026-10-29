<?php
include 'session_config.php'; // Include session configuration

// Clear out all session variables
session_unset(); // Remove any existing session data
session_destroy(); // Fully end the session

// Start a fresh session
session_start();

// Redirect the user to the login page
header("Location: index.php");
exit();
?>
