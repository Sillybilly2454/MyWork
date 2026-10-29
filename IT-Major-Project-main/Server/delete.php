<?php
include 'session_config.php'; // Load session settings

// Ensure the user is an admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

// Retrieve and validate parameters from the request
$table = $_GET['table']; // Table name
$id = $_GET['id']; // ID of the record to delete

// Validate that the table name is one of the allowed values
$valid_tables = ['students', 'users', 'attendance', 'class_periods', 'classes'];
if (!in_array($table, $valid_tables)) {
    die('Invalid table'); // Stop execution if the table is invalid
}

// Set the primary key based on the table being accessed
switch ($table) {
    case 'students':
        $primary_key = 'student_id';
        break;
    case 'users':
        $primary_key = 'user_id';
        break;
    case 'attendance':
        $primary_key = 'attendance_id';
        break;
    case 'class_periods':
        $primary_key = 'id';
        break;
    case 'classes':
        $primary_key = 'class_id';
        break;
}

// Perform additional deletion steps for specific tables
if ($primary_key === 'student_id') {
    // Delete related user records for the student being deleted
    $query = "DELETE FROM users WHERE student_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo "Related user records updated successfully.<br>";
    } else {
        echo "Error updating related user records: " . $conn->error . "<br>";
    }
    $stmt->close();

    // Delete related attendance records for the student being deleted
    $query = "DELETE FROM attendance WHERE student_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo "Related attendance records updated successfully.<br>";
    } else {
        echo "Error updating related attendance records: " . $conn->error . "<br>";
    }
    $stmt->close();
} else if ($primary_key === "class_id") { 
    // Delete all class periods associated with the class being deleted
    $query = "DELETE FROM class_periods WHERE class_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo "All class periods deleted successfully.<br>";
    } else {
        echo "Error deleting class periods: " . $conn->error . "<br>";
    }
    $stmt->close();
}

// Delete the main record from the specified table
$query = "DELETE FROM $table WHERE $primary_key = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . $conn->error;
}

// Close statement and database connection
$stmt->close();
$conn->close();
?>