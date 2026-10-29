<?php
include 'session_config.php'; // Load session settings
include 'db.php'; // Connect to the database

// Get the class IDs from the query string, or set an empty array if none provided
$classIds = isset($_GET['class_ids']) ? explode(',', $_GET['class_ids']) : [];
$classIds = array_map('intval', $classIds); // Ensure all values are integers

// Check if there are any class IDs; if not, exit
if (empty($classIds)) {
    echo "No class IDs provided.";
    exit();
}

// Prepare SQL placeholders based on the number of class IDs
$placeholders = implode(',', array_fill(0, count($classIds), '?'));

// Query to fetch timetable data for specified classes, ordered by day and period
$sql = "SELECT cp.id, cp.day_of_week, cp.period, c.name AS class_name, c.class_id, c.is_active
        FROM class_periods cp
        JOIN classes c ON cp.class_id = c.class_id
        WHERE cp.class_id IN ($placeholders)
        ORDER BY cp.day_of_week, cp.period";

$stmt = $conn->prepare($sql);

// Bind each class ID dynamically
$types = str_repeat('i', count($classIds)); // 'i' indicates integer type for each ID
$stmt->bind_param($types, ...$classIds);
$stmt->execute();
$result = $stmt->get_result();

// Initialize an empty data structure for Week 1 and Week 2 timetable
$data = [
    1 => [ // Week 1
        1 => [], // Monday
        2 => [], // Tuesday
        3 => [], // Wednesday
        4 => [], // Thursday
        5 => []  // Friday
    ],
    2 => [ // Week 2
        1 => [], // Monday
        2 => [], // Tuesday
        3 => [], // Wednesday
        4 => [], // Thursday
        5 => []  // Friday
    ]
];

// Process each row from the result set
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dayOfWeek = $row['day_of_week'];
        $period = $row['period'];
        $className = $row['class_name'];
        $id = $row['id'];
        $classId = $row['class_id'];
        $is_active = $row['is_active'];

        // Only include active classes
        if ($is_active == true) {
            // Determine the week (1 or 2) based on day_of_week (1-5 for Week 1, 6-10 for Week 2)
            $week = ($dayOfWeek <= 5) ? 1 : 2;
            $day = $dayOfWeek - ($week - 1) * 5; // Adjust day for each week to 1-5

            // Ensure the period array exists for this day and week
            if (!isset($data[$week][$day][$period])) {
                $data[$week][$day][$period] = [];
            }

            // Append class data for each period (support multiple classes per period)
            $data[$week][$day][$period][] = [
                'class_name' => $className,
                'id' => $id,
                'class_id' => $classId
            ]; 
        }
    }
}

// Close statement and database connection
$stmt->close();
$conn->close();

// Output the data in JSON format for use in JavaScript
echo json_encode($data);
?>