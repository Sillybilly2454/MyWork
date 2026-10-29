<?php
// Database connection configuration
$servername = "localhost";
$username = "root";
$password = "ubbYnnXe5h)tgHqF";
$dbname = "school";

try {
    $conn = new mysqli($servername, $username, $password, $dbname); // Create a new connection to the MySQL database
} catch (Exception) { // Check if the connection was successful
    
    die("Connection failed"); // Stop execution if there's a connection error
}

// Close the connection when done
function closeConnection() {
    global $conn; // Use the global $conn variable
    $conn->close(); // Close the connection
}
?>