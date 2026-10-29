<?php
include 'session_config.php';  // Load session settings

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include 'db.php'; // Connect to the database

// Retrieve session and query parameters
$student_id = (int)$_SESSION['student_id']; // Sanitize input to avoid injection
$reason = $_GET['reason']; // Reason for signing in/out
$status = $_GET['status']; // Status 'in' or 'out'

// Get current time and day of the week
$current_time = new DateTime();
$current_day = (int) $current_time->format('N'); // 1 = Monday, 7 = Sunday

// Set reference date for calculating school day cycles (first Monday of the term)
$reference_date = new DateTime('2024-10-14');
$school_days_since_reference = calculateSchoolDaysSinceReference($reference_date, $current_time);
$day_in_cycle = ($school_days_since_reference % 10) ?: 10; // 1-10 day cycle

// Define class period start and end times
$period_times = [
    0 => ['start' => '09:00', 'end' => '09:12'], // P0
    1 => ['start' => '09:15', 'end' => '10:15'], // P1
    2 => ['start' => '10:15', 'end' => '11:15'], // P2
    3 => ['start' => '11:45', 'end' => '12:45'], // P3
    4 => ['start' => '12:45', 'end' => '13:45'], // P4
    5 => ['start' => '14:10', 'end' => '15:15'], // P5
];


// Fetch the most recent attendance record for the student today
$attendanceResult = getMostRecentAttendance($conn, $student_id);

// Initialize an empty response array
$response = [];

// Define school start and end times based on the first and last periods
$school_start_time = new DateTime($period_times[0]['start']);
$school_end_time = new DateTime($period_times[5]['end']);

// Restrict sign-in/out on weekends
if ($current_day > 5) { // If it's Saturday or Sunday
    $response['success'] = false;
    $response['message'] = "Signing in/out is only allowed during school days (Monday - Friday)";
} else if (!($current_time > $school_start_time && $current_time < $school_end_time)) { 
    // Restrict sign-in/out before or after school hours
    $response['success'] = false;
    $response['message'] = "Signing in/out is only allowed during school hours (9:00 AM - 3:15 PM)";
} else if ($status == "in") {
    // Handle sign-in logic
    if ($attendanceResult->num_rows > 0) { // If there's a record for today
        $lastAttendance = $attendanceResult->fetch_assoc();
        if ($lastAttendance['status'] == 'in') {
            // Prevent multiple sign-ins without signing out
            $response['success'] = false;
            $response['message'] = "You need to sign out first before you can sign in.";
        } else {
            // Sign in after signing out
            if (saveAttendance($conn, $student_id, 'in', $reason)) {
                $response['success'] = true;
                $response['message'] = "Signed in successfully!";
                $response['attendance'] = getMostRecentAttendance($conn, $student_id)->fetch_assoc(); // Fetch updated attendance
            } else {
                $response['success'] = false;
                $response['message'] = "Error signing in.";
            }
        }
    } else {
        // First sign-in for the day
        if (saveAttendance($conn, $student_id, 'in', $reason)) {
            $response['success'] = true;
            $response['message'] = "Signed in successfully!";
            $response['attendance'] = getMostRecentAttendance($conn, $student_id)->fetch_assoc(); // Fetch updated attendance
        } else {
            $response['success'] = false;
            $response['message'] = "Error signing in.";
        }
    }
} else if ($status == "out") {
    // Handle sign-out logic
    if ($attendanceResult->num_rows > 0) { // If there's a record for today
        $lastAttendance = $attendanceResult->fetch_assoc();
        if ($lastAttendance['status'] == 'out') {
            // Prevent multiple sign-outs without signing in
            $response['success'] = false;
            $response['message'] = "You need to sign in first before you can sign out.";
        } else {
            // Check if student is eligible to sign out for study
            $studyCheck = canSignOutForStudy();
            
            if (!$studyCheck['allowed']) {
                $response['success'] = false;
                $response['message'] = $studyCheck['message'];
            } else {
                // Proceed with sign-out if eligible
                if (saveAttendance($conn, $student_id, 'out', $reason)) {
                    $response['success'] = true;
                    $response['message'] = "Signed out successfully!";
                    $response['attendance'] = getMostRecentAttendance($conn, $student_id)->fetch_assoc(); // Fetch updated attendance
                } else {
                    $response['success'] = false;
                    $response['message'] = "Error signing out.";
                }
            }
        }
    } else {
        $response['success'] = false;
        $response['message'] = "You need to sign in first before you can sign out.";
    }
}

// Query to get student information for response
$query = "SELECT student_id, name, can_sign_out FROM students WHERE student_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $student_id); // Bind the student ID as an integer
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) { // If student record is found
    $user = $result->fetch_assoc();
    $response['name'] = $user['name']; // Include student's name in the response
}

// Add additional response information
$response['day_in_week'] = $day_in_cycle; // Add current day in cycle
$response['time'] = $current_time; // Include the current time
$response['period'] = getCurrentPeriod($current_time, $period_times); // Include the current period based on time

// Return response as JSON
header('Content-Type: application/json');
echo json_encode($response);



// Function to get the most recent attendance record for today
function getMostRecentAttendance($conn, $student_id) {
    $query = "SELECT * FROM attendance WHERE student_id = $student_id AND date = CURDATE() ORDER BY time DESC LIMIT 1";
    return $conn->query($query);
}

// Insert new attendance record (in or out) with reason if provided
function saveAttendance($conn, $student_id, $status, $reason = '') {
    $stmt = $conn->prepare("INSERT INTO attendance (student_id, date, time, status, reason) VALUES (?, CURDATE(), CURTIME(), ?, ?)");
    $stmt->bind_param('iss', $student_id, $status, $reason);
    return $stmt->execute();
}

// Check if the student can sign out for study period based on permissions and schedule
function canSignOutForStudy() {
    global $conn, $student_id, $current_time, $period_times;

    $current_period = getCurrentPeriod($current_time, $period_times);

    // Restrict study sign-outs before the end of the second period
    if ($current_period === null || $current_period <= 2) {
        return ['allowed' => false, 'message' => "You cannot sign out for Study before the end of the second period (11:15 AM)."];
    }

    // Check if the student has permission to sign out
    $query = "SELECT can_sign_out FROM students WHERE student_id = $student_id";
    $result = $conn->query($query);
    $student = $result->fetch_assoc();

    if (!$student['can_sign_out']) {
        return ['allowed' => false, 'message' => "You do not have permission to sign out, please see student reception if this is wrong."];
    }

    // Check if there is a study period for the current time
    $hasStudy = checkIfStudentHasStudy();

    if ($hasStudy === false) {
        return ['allowed' => false, 'message' => "You do not have a study period at this time."];
    } else if ($hasStudy === "Missing Data") {
        return ['allowed' => false, 'message' => "Missing data for this period, please see student reception."];
    }

    // If all checks pass, student is allowed to sign out for study
    return ['allowed' => true, 'message' => "You are allowed to sign out for Study."];
}


// Check if the student has a Study period during the current time
function checkIfStudentHasStudy() {
    global $conn, $student_id, $day_in_cycle;

    // Fetch the student's schedule for the current day based on their class IDs
    $query = "SELECT cp.id, cp.period, c.name AS class_name 
              FROM class_periods cp 
              JOIN classes c ON cp.class_id = c.class_id 
              WHERE FIND_IN_SET(c.class_id, (SELECT class_ids FROM students WHERE student_id = ?)) 
              AND cp.day_of_week = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $student_id, $day_in_cycle);
    $stmt->execute();
    $result = $stmt->get_result();

    $current_period = getCurrentPeriod(); // Identify the current period based on time
    
    $foundDataDuringPeriod = false;

    // Check for "Study" period during the current time
    while ($row = $result->fetch_assoc()) {
        $class_name = $row['class_name'];
        $period = $row['period'];

        if ($current_period == $period) {
            if (stripos($class_name, 'Study') !== false) {
                return true; // Student has a study period at this time
            }
            $foundDataDuringPeriod = true;
        }
    }

    return $foundDataDuringPeriod ? false : "Missing Data"; // If no match, return missing data
}

// Get the current period based on the provided time
function getCurrentPeriod() {
    global $current_time, $period_times;

    $current_time_str = $current_time->format('H:i'); // Convert current time to the format used in period_times
    $next_valid_period = null; // Initialize to track the next valid period

    foreach ($period_times as $period => $times) {
        // Check if the current time is within the current period
        if ($current_time_str >= $times['start'] && $current_time_str <= $times['end']) {
            return $period; // Return the current period if within time range
        }
        // Update the next valid period if the current time is past the end time of the period
        if ($current_time_str > $times['end']) {
            // If the next period exists, set it as the next valid period
            if (isset($period_times[$period + 1])) {
                $next_valid_period = $period + 1; // Assume next period
            }
        }
    }

    // If no current period is found, assume the next period if it exists (Recess, Lunch)
    return $next_valid_period; 
}

// Calculate the number of weekdays (school days) since a reference date
function calculateSchoolDaysSinceReference($start_date, $end_date) {
    $interval = $start_date->diff($end_date); // Calculate the difference between the start and end date
    $days = $interval->days; // Total days between the dates
    $school_days = 0; // Initialize a counter for school days

    // Loop through each day in the interval
    for ($i = 0; $i <= $days; $i++) {
        // Clone the start date and increment by $i days
        $current_date = clone $start_date;
        $current_date->modify("+$i days");

        // Check if the current day is a weekday (Monday to Friday)
        if ((int) $current_date->format('N') <= 5) {
            $school_days++; // Increment the counter for each weekday
        }
    }

    return $school_days; // Return the total number of school days
}
?>