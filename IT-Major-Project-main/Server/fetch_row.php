<?php
include 'session_config.php'; // Load session settings
include 'db.php'; // Connect to the database

// Get table and ID from the query string
$table = $_GET['table'];
$id = $_GET['id'];

// Sanitize inputs to prevent SQL injection
$table = $conn->real_escape_string($table); // Sanitize table name
$id = (int)$id; // Ensure ID is an integer

// Determine which table to query based on the 'table' parameter
switch ($table) {
    case 'students':
        $query = "SELECT * FROM students WHERE student_id = $id";
        break;
    case 'users':
        $query = "SELECT * FROM users WHERE user_id = $id";
        break;
    case 'attendance':
        $query = "SELECT * FROM attendance WHERE attendance_id = $id";
        break;
    case "classes":
        $query = "SELECT * FROM classes WHERE class_id = $id";
        break;
    case "class_periods":
        $query = "SELECT * FROM class_periods WHERE id = $id";
        break;
    default:
        // Handle invalid table name
        die('Invalid table');
}

// Execute the query
$result = $conn->query($query);

// Check if the query returned any rows
if ($result->num_rows > 0) {
    // Fetch the result as an associative array and encode it as JSON
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    // Return an empty JSON array if no result was found
    echo json_encode([]);
}
?>