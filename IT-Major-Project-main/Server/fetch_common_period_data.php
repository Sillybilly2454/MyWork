<?php
include 'session_config.php'; // Load session settings

// Ensure the user is an admin
if (!$_SESSION['is_admin']) {
    echo json_encode(['error' => 'Not Admin Canceling Save']);
    exit();
}

include 'db.php'; // Connect to the database

// Get the timetable ID from the query parameters, or return an error if missing
$currentTimetableID = $_GET['id'] ?? null;
if (!$currentTimetableID) {
    echo json_encode(['error' => 'Timetable ID not provided']);
    exit();
}

// SQL query to find the most commonly used room for a given class
$sql = "
    SELECT room, COUNT(*) as count
    FROM class_periods
    WHERE class_id = ?
    GROUP BY room
    ORDER BY count DESC
    LIMIT 1;
";

$stmt = $conn->prepare($sql); // Prepare the SQL statement
$stmt->bind_param("i", $currentTimetableID); // Bind the class ID as an integer
$stmt->execute(); // Execute the query
$result = $stmt->get_result(); // Get the result set
$data = $result->fetch_assoc(); // Fetch the result as an associative array

// Close the statement and database connection
$stmt->close();
$conn->close();

// Convert the result to JSON format and output it for use in JavaScript
echo json_encode($data);
?>