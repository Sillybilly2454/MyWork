<?php
include 'session_config.php'; // Load session settings

// Make sure user is admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

$query = $_GET['query'];
$students = [];

if ($query) {
    // Prepare and execute a search query for active students by ID or name
    $stmt = $conn->prepare("SELECT student_id, name FROM students WHERE (student_id LIKE ? OR name LIKE ?) AND is_active = true");
    $searchTerm = '%' . $query . '%';
    $stmt->bind_param('ss', $searchTerm, $searchTerm);
    $stmt->execute(); // Execute the query
    $result = $stmt->get_result(); // Get the results

    // Collect matching students into the array
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    $stmt->close(); // Close the prepared statement
}

echo json_encode($students); // Return the data as JSON
?>