<?php
session_start(); // Start session management for login

include 'db.php'; // Database connection for retrieving stored password

// Check if the form was submitted by POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Grab the password entered by the user
    $entered_password = $_POST['admin_password'];

    // Look up the stored hashed password in the settings table
    $query = "SELECT value FROM settings WHERE key_name = 'system_password'";
    $result = $conn->query($query);
    
    // Make sure there is a result from the database
    if ($result && $result->num_rows > 0) {
        // Fetch the hashed password value
        $row = $result->fetch_assoc();
        $stored_hashed_password = $row['value'];

        // Check if the entered password matches the stored hash
        if (password_verify($entered_password, $stored_hashed_password)) {
            // Store the hashed password in session to mark that the system is verified and logged in
            $_SESSION['system_password'] = $stored_hashed_password;

            // Respond with a success status in JSON
            echo json_encode(['status' => 'success']);
        } else {
            // Respond with error if the password is incorrect
            echo json_encode(['status' => 'error', 'message' => 'Invalid system password.']);
        }
    } else {
        // Respond with error if the password is missing in the database
        echo json_encode(['status' => 'error', 'message' => 'System password not found.']);
    }
}
?>