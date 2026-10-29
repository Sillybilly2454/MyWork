<?php
include 'session_config.php'; // Load session settings

// Ensure the user is an admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

// Get the student ID and new active status
$id = $_GET['id'];
$is_active = $_GET['is_active'];

// Prepare the SQL statement to update the student's active status
$stmt = $conn->prepare("UPDATE students SET is_active = ? WHERE student_id = ?");

// Execute the statement with the provided active status and student ID
if ($stmt->execute([$is_active, $id])) {
    echo "Updated user status successfully"; // Success message
} else {
    echo "Error updating status: " . $stmt->error; // Error message if the update fails
}

$stmt->close(); // Close the prepared statement
?>