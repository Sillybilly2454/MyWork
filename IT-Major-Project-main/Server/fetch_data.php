<?php
include 'session_config.php'; // Load session settings

// Ensure the user is an admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin Canceling Save";
    exit();
}

include 'db.php'; // Connect to the database

// Get parameters from the URL
$section = $_GET['section']; // The database table or section to query
$search = isset($_GET['search']) ? $_GET['search'] : ''; // Search keyword, if provided
$is_active = isset($_GET['is_active']) ? $_GET['is_active'] : 1;  // Default to active records
$include_actions = $_GET['include_actions'] !== 'false'; // Determine if action buttons are included

// Build the query based on the specified section
switch ($section) {
    case 'students':
        $query = "SELECT student_id, name, can_sign_out FROM students 
                WHERE (name LIKE '%$search%' OR student_id LIKE '%$search%' OR can_sign_out LIKE '%$search%') 
                AND is_active = $is_active";
        $primary_key = 'student_id';
        break;
    case 'users':
        $query = "SELECT user_id, username, rfid, student_id FROM users 
                WHERE (username LIKE '%$search%' OR rfid LIKE '%$search%' OR student_id LIKE '%$search%' OR user_id LIKE '%$search%') 
                AND student_id IN (SELECT student_id FROM students WHERE is_active = $is_active)";
        $primary_key = 'user_id';
        break;
    case 'attendance':
        $query = "SELECT * FROM attendance 
                WHERE (student_id LIKE '%$search%' OR date LIKE '%$search%' OR time LIKE '%$search%' OR status LIKE '%$search%' OR reason LIKE '%$search%' OR attendance_id LIKE '%$search%') 
                AND student_id IN (SELECT student_id FROM students WHERE is_active = $is_active)
                ORDER BY date DESC, time DESC";
        $primary_key = 'attendance_id';
        break;        
    case 'classes':
        $query = "SELECT class_id, name, semester, year, is_active FROM classes 
                WHERE (name LIKE '%$search%' OR semester LIKE '%$search%' OR year LIKE '%$search%' OR class_id LIKE '%$search%') 
                AND is_active = $is_active";
        $primary_key = 'class_id';
        break;
    default:
        die('Invalid section'); // Stop if an invalid section is provided
}

// Execute the query
$result = $conn->query($query);

if ($result->num_rows > 0) {
    if ($include_actions == false) {
        // Prepare data as an array if action buttons are not needed
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // Return data as JSON
        echo json_encode($data);
        exit;
    }
    
    // Display table headers using the first row's keys
    $firstRow = $result->fetch_assoc();
    echo '<tr>';
    foreach ($firstRow as $key => $value) {
        echo '<th>' . htmlspecialchars($key) . '</th>';
    }
    echo '<th>Actions</th>'; // Additional header for action buttons
    echo '</tr>';
    
    // Display each row of data with corresponding action buttons
    do {
        echo '<tr>';
        foreach ($firstRow as $key => $value) {
            echo '<td>' . htmlspecialchars($firstRow[$key]) . '</td>';
        }

        echo '<td>'; // Action buttons container

        // Add edit button
        echo '<button class="btn btn-edit" onclick="showModal(\'' . $section . '\', \'edit\', ' . $firstRow[$primary_key] . ')">Edit</button>';
        
        // Add section-specific action buttons
        if ($primary_key == 'user_id') {
            echo '<button class="btn btn-reset" onclick="resetPassword(' . $firstRow[$primary_key] . ')">Reset Password</button>';
        } elseif ($primary_key == 'student_id') { 
            echo '<button class="btn btn-changeActivity" onclick="changeStudentActivity(\'' . $firstRow[$primary_key] . '\', ' . $is_active . ')">' . ($is_active == 1 ? 'Deactivate Student' : 'Activate Student') . '</button>';
            echo '<button class="btn btn-timetable" onclick="showTimetable(\'' . $section . '\', ' . $firstRow[$primary_key] . ', 1)">Timetable</button>';
            echo '<button class="btn btn-status" onclick="checkStudentStatus(' . $firstRow[$primary_key] . ')">Check Status</button>';
        } elseif ($primary_key == 'class_id') {
            echo '<button class="btn btn-changeActivity" onclick="changeClassActivity(\'' . $firstRow[$primary_key] . '\', ' . $is_active . ')">' . ($is_active == 1 ? 'Deactivate Class' : 'Activate Class') . '</button>';
            echo '<button class="btn btn-timetable" onclick="showTimetable(\'' . $section . '\', ' . $firstRow[$primary_key] . ', 0)">Timetable</button>';
        } elseif ($primary_key == 'attendance_id') {
            echo '<button class="btn btn-print" onclick="printAttendanceSlip(' . $firstRow[$primary_key] . ')">Print Attendance</button>';
        }

        // Add delete button for all sections
        echo '<button class="btn btn-delete" onclick="deleteData(\'' . $section . '\', ' . $firstRow[$primary_key] . ')">Delete</button>';
        echo '</td>'; // End action buttons container
        
        echo '</tr>';
    } while ($firstRow = $result->fetch_assoc());
} else {
    // Display message if no records are found
    echo '<tr><td colspan="' . ($include_actions ? '100%' : '99%') . '">No records found</td></tr>';
}
?>