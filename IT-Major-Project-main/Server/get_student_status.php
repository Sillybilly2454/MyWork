<?php
include 'session_config.php'; // Load session settings

// Ensure the user is an admin
if (!$_SESSION['is_admin']) {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

include 'db.php'; // Connect to the database

// Get student ID from request, default to 0 if not provided
$student_id = isset($_GET['student_id']) ? (int)$_GET['student_id'] : 0;

// Make sure student id is valid
if ($student_id === 0) {
    echo json_encode(['error' => 'Invalid student ID']);
    exit();
}

// Set up current time and school day calculations
$current_time = new DateTime();
$current_day = (int) $current_time->format('N'); // Day of the week as an integer (1 = Monday, 7 = Sunday)
$reference_date = new DateTime('2024-10-14'); // Reference date for the school cycle
$school_days_since_reference = calculateSchoolDaysSinceReference($reference_date, $current_time);
$day_in_cycle = ($school_days_since_reference % 10) ?: 10; // Calculate the current day in a 10-day cycle

// Define class period times
$period_times = [
    0 => ['start' => '09:00', 'end' => '09:12'], // P0
    1 => ['start' => '09:15', 'end' => '10:15'], // P1
    2 => ['start' => '10:15', 'end' => '11:15'], // P2
    3 => ['start' => '11:45', 'end' => '12:45'], // P3
    4 => ['start' => '12:45', 'end' => '13:45'], // P4
    5 => ['start' => '14:10', 'end' => '15:15'], // P5
];    

// Function to get the most recent attendance record for the student today
function getMostRecentAttendance($conn, $student_id) {
    $query = "SELECT * FROM attendance WHERE student_id = $student_id AND date = CURDATE() ORDER BY time DESC LIMIT 1";
    return $conn->query($query);
}

// Check if the student has a Study period during the current time
function checkIfStudentHasStudy($conn, $student_id, $current_time, $period_times, $day_in_cycle) {
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

    $current_period = getCurrentPeriod($current_time, $period_times); // Identify the current period based on time
    
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

// Determine the current period based on the provided time
function getCurrentPeriod($current_time, $period_times) {
    $current_time_str = $current_time->format('H:i');
    $next_valid_period = null; // Track the next period if not within current period times

    foreach ($period_times as $period => $times) {
        if ($current_time_str >= $times['start'] && $current_time_str <= $times['end']) {
            return $period; // Return the period if within time range
        }
        if ($current_time_str > $times['end'] && isset($period_times[$period + 1])) {
            $next_valid_period = $period + 1; // Track the next upcoming period
        }
    }

    return $next_valid_period; // If no current period found, assume the next period if available
}

// Calculate the number of weekdays (school days) since the reference date
function calculateSchoolDaysSinceReference($start_date, $end_date) {
    $interval = $start_date->diff($end_date);
    $days = $interval->days;

    $school_days = 0;
    for ($i = 0; $i <= $days; $i++) {
        $current_date = clone $start_date;
        $current_date->modify("+$i days");

        // Only count weekdays (1 = Monday, 5 = Friday)
        if ((int) $current_date->format('N') <= 5) {
            $school_days++;
        }
    }

    return $school_days;
}

// Define school hours based on the start of the first period and the end of the last period in $period_times
$school_start_time = new DateTime($period_times[0]['start']); // Start time of P0
$school_end_time = new DateTime($period_times[5]['end']); // End time of P5


// Fetch the latest attendance record for the student
$attendanceResult = getMostRecentAttendance($conn, $student_id);

// Initialize response data
$response = [];

// Determine student's status based on the current day, time, and their attendance records
if ($current_day > 5) {
    // If today is Saturday or Sunday (day > 5), student is considered out of school
    $response['status'] = 'Out of School (Weekend)';
} elseif (!($current_time > $school_start_time && $current_time < $school_end_time)) {
    // If the current time is outside school hours, mark as out of school
    $response['status'] = 'Out of School (Outside School Hours)';
} elseif ($attendanceResult->num_rows > 0) {
    // Attendance records exist for today, so fetch the most recent attendance record
    $lastAttendance = $attendanceResult->fetch_assoc();
    
    if ($lastAttendance['status'] == 'out') {
        // If the latest attendance status is 'out', the student has signed out today
        $response['status'] = 'Signed Out';
        $response['time'] = $lastAttendance['time']; // Include the time of sign-out
    } else {
        // Student is signed in, so check if they are in a class or study period
        $current_period = getCurrentPeriod($current_time, $period_times); // Get the current period based on time
        $hasStudy = checkIfStudentHasStudy($conn, $student_id, $current_time, $period_times, $day_in_cycle);

        if ($current_period === null) {
            // If no period matches the current time, they're outside of scheduled periods
            $response['status'] = 'Out of Scheduled Period';
        } elseif ($hasStudy === true) {
            // If the student is in a study period, set the status accordingly
            $response['status'] = 'In Study Period';
        } elseif ($hasStudy === false) {
            // If they’re not in a study period, fetch their class information for the current period
            $query = "SELECT cp.id, cp.period, c.name AS class_name, cp.room
                      FROM class_periods cp
                      JOIN classes c ON cp.class_id = c.class_id
                      WHERE FIND_IN_SET(c.class_id, (SELECT class_ids FROM students WHERE student_id = ?))
                      AND cp.day_of_week = ?
                      AND cp.period = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('iii', $student_id, $day_in_cycle, $current_period);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // If a class is found, add the class name and room to the response
                $class = $result->fetch_assoc();
                $response['status'] = 'In Class';
                $response['class_name'] = $class['class_name'];
                $response['room'] = $class['room'];
            } else {
                // No class data for this period; label as missing data
                $response['status'] = 'In Class (Missing Data)';
            }
        } else {
            // If `hasStudy` returned 'Missing Data', reflect that in the response
            $response['status'] = 'Missing Data';
        }
    }
} else {
    // No attendance records for today, meaning the student hasn't signed in
    $response['status'] = 'Not Signed In Today';
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>