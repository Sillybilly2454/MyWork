<?php
include 'session_config.php'; // Load session settings

// Make sure user is admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

// Handle saving or updating student data
if (isset($_POST['save_student'])) {
    $name = $_POST['name'];
    $can_sign_out = $_POST['can_sign_out'];
    $id = $_POST['id'] ?? null;

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update existing student record
        $stmt = $conn->prepare("UPDATE students SET name = ?, can_sign_out = ? WHERE student_id = ?");
        $stmt->bind_param("ssi", $name, $can_sign_out, $id);
    } else {
        // Insert new student record
        $stmt = $conn->prepare("INSERT INTO students (name, can_sign_out) VALUES (?, ?)");
        $stmt->bind_param("si", $name, $can_sign_out);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "Student saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

// Handle saving or updating student class assignments
if (isset($_POST['save_student_classes'])) {
    $id = $_POST['id'] ?? null;
    $class_ids = $_POST['class_ids'] ?? null;

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update class IDs for an existing student
        $stmt = $conn->prepare("UPDATE students SET class_ids = ? WHERE student_id = ?");
        $stmt->bind_param("si", $class_ids, $id);
    } else {
        // Insert new student with class IDs
        $stmt = $conn->prepare("INSERT INTO students (class_ids) VALUES (?)");
        $stmt->bind_param("s", $class_ids);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "Student saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

// Handle saving or updating user data
if (isset($_POST['save_user'])) {
    $username = $_POST['username'];
    $password = !empty($_POST['password']) ? password_hash($_POST['password'], PASSWORD_DEFAULT) : null;
    $rfid = $_POST['rfid'] ?? null;
    $student_id = $_POST['student_id'] ?? null;
    $id = $_POST['id'] ?? null;

    if($rfid == "") {
        $rfid = null;
    }

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update existing user record
        $stmt = $conn->prepare("UPDATE users SET username = ?, password = ?, rfid = ?, student_id = ? WHERE user_id = ?");
        $stmt->bind_param("sssii", $username, $password, $rfid, $student_id, $id);

    } else {
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, password, rfid, student_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $username, $password, $rfid, $student_id);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "User saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

// Handle saving or updating attendance records
if (isset($_POST['save_attendance'])) {
    $student_id = $_POST['student_id'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $status = $_POST['status'];
    $reason = $_POST['reason'];
    $id = $_POST['id'] ?? null;

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update existing attendance record
        $stmt = $conn->prepare("UPDATE attendance SET student_id = ?, date = ?, time = ?, status = ?, reason = ? WHERE attendance_id = ?");
        $stmt->bind_param("issssi", $student_id, $date, $time, $status, $reason, $id);
    } else {
        // Insert new attendance record
        $stmt = $conn->prepare("INSERT INTO attendance (student_id, date, time, status, reason) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $student_id, $date, $time, $status, $reason);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "Attendance saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

// Handle saving or updating class data
if (isset($_POST['save_classe'])) {
    $name = $_POST['name'];
    $semester = $_POST['semester'];
    $year = $_POST['year'];
    $id = $_POST['id'] ?? null;

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update existing class record
        $stmt = $conn->prepare("UPDATE classes SET name = ?, semester = ?, year = ? WHERE class_id = ?");
        $stmt->bind_param("ssii", $name, $semester, $year, $id);
    } else {
        // Insert new class record
        $stmt = $conn->prepare("INSERT INTO classes (name, semester, year) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $name, $semester, $year);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "Class saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

// Handle saving or updating class period data
if (isset($_POST['save_class_period'])) {
    $class_id = $_POST['class_id'];
    $room = $_POST['room'];
    $day_of_week = $_POST['day_of_week'];
    $period = $_POST['period'];
    $id = $_POST['id'] ?? null;

    // Checks if this is saving new data or an existing record
    if ($id) {
        // Update existing class period
        $stmt = $conn->prepare("UPDATE class_periods SET class_id = ?, room = ?, day_of_week = ?, period = ? WHERE id = ?");
        $stmt->bind_param("isiii", $class_id, $room, $day_of_week, $period, $id);
    } else {
        // Insert new class period
        $stmt = $conn->prepare("INSERT INTO class_periods (class_id, room, day_of_week, period) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isii", $class_id, $room, $day_of_week, $period);
    }

    // Execute and give feedback
    echo $stmt->execute() ? "Class saved successfully." : "Error: " . $stmt->error;
    $stmt->close();
}

$conn->close(); // Close the database connection
?>