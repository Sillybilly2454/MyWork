<?php
include 'session_config.php'; // Load session settings

// Make sure user is admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

// Grab the id and new password entered by the user
$id = $_GET['id'];
$newPassword = $_GET['password'];

// Hash the password so its more secure
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update the password in the database
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");

// Execute and give feedback
if ($stmt->execute([$hashedPassword, $id])) {
    echo "Password updated successfully";
} else {
    echo "Error updating password: " . $stmt->error;
}

$stmt->close(); // Close the statement
$conn->close(); // Close the database connection
?>