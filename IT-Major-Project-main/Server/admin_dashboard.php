<?php
include 'session_config.php'; // Load session settings

// Make sure the user is an admin
if (!$_SESSION['is_admin']) {
    echo "Not Admin";

    // Redirect based on login status
    if (isset($_SESSION['user_id'])) {
        header("Location: dashboard.php"); // Redirect to user dashboard if logged in
    } else {
        header("Location: login.php"); // Redirect to login page if not logged in
    }
    exit();
}

include 'db.php'; // Connect to the database
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>

    <!-- Link to CSS files for theme and dashboard styling -->
    <link rel="stylesheet" href="css/mackillop school theme.css">
    <link rel="stylesheet" href="css/admin_dashboard.css">
</head>
<body>
    <!-- School Logo -->
    <img src="images/SMMC_Teal-20342cb8.png">

    <div class="dashboard-container">
        <h1>Admin Dashboard</h1>
        <?php if (isset($message)) { echo "<div class='message'>$message</div>"; } ?>

        <!-- Tabbed navigation for different sections in the dashboard -->
        <div class="tab-container">
            <button class="tab-button" onclick="showSection('students')">Students</button>
            <button class="tab-button" onclick="showSection('users')">Users</button>
            <button class="tab-button" onclick="showSection('attendance')">Attendance</button>
            <button class="tab-button" onclick="showSection('classes')">Classes</button> 
        </div>

        <!-- Classes Section: Allows searching, filtering, and adding classes -->
        <div id="classes-section" class="data-section">
            <h2>Classes</h2>
            <div class="search">
                <input type="text" id="classes-search" placeholder="Search Classes..." onkeyup="searchSection('classes')">
                <button class="btn btn-refresh" onclick="refreshSection('classes')">Refresh</button>

                <!-- Filter to show only active or inactive classes -->
                <label for="classes-filter">Show:</label>
                <select id="classes-filter" onchange="refreshSection('classes')">
                    <option value="1">Active Classes</option>
                    <option value="0">Inactive Classes</option>
                </select>

                <!-- Hidden columns specify searchable fields -->
                <input type="hidden" id="classes-columns" value="name,semester">
                <button class="btn btn-add" onclick="showModal('classes')">Add Class</button>
            </div>

            <!-- Table to dynamically load class data with JavaScript -->
            <table id="classes-table">
                <!-- Data will be loaded here by JavaScript -->
            </table>
        </div>

        <!-- Students Section: Allows searching, filtering, and adding students -->
        <div id="students-section" class="data-section active">
            <h2>Students</h2>
            <div class="search">
                <input type="text" id="students-search" placeholder="Search Students..." onkeyup="searchSection('students')">
                <button class="btn btn-refresh" onclick="refreshSection('students')">Refresh</button>

                <!-- Filter to show only active or inactive students -->
                <label for="students-filter">Show:</label>
                <select id="students-filter" onchange="refreshSection('students')">
                    <option value="1">Active Students</option>
                    <option value="0">Inactive Students</option>
                </select>

                <!-- Hidden columns specify searchable fields -->
                <input type="hidden" id="students-columns" value="name">
                <button class="btn btn-add" onclick="showModal('students')">Add Student</button>
            </div>

            <!-- Table to dynamically load student data with JavaScript -->
            <table id="students-table">
                <!-- Data will be loaded here by JavaScript -->
            </table>
        </div>

        <!-- Users Section: Allows searching, filtering, and adding users -->
        <div id="users-section" class="data-section active">
            <h2>Users</h2>
            <div class="search">
                <input type="text" id="users-search" placeholder="Search Users..." onkeyup="searchSection('users')">
                <button class="btn btn-scanRFID" id="user-search-scan-button" onclick="startRFIDListening('users-search', 'user-search-scan-button')">Scan RFID</button>
                <button class="btn btn-refresh" onclick="refreshSection('users')">Refresh</button>

                <!-- Filter to show only active or inactive students linked to users -->
                <label for="users-filter">Show:</label>
                <select id="users-filter" onchange="refreshSection('users')">
                    <option value="1">Active Students</option>
                    <option value="0">Inactive Students</option>
                </select>

                <!-- Hidden columns specify searchable fields -->
                <input type="hidden" id="users-columns" value="username,rfid,student_id">
                <button class="btn btn-add" onclick="showModal('users')">Add User</button>
            </div>

            <!-- Table to dynamically load user data with JavaScript -->
            <table id="users-table">
                <!-- Data will be loaded here by JavaScript -->
            </table>
        </div>

        <!-- Attendance Section: Allows searching, filtering, and adding attendance records -->
        <div id="attendance-section" class="data-section active">
            <h2>Attendance</h2>
            <div class="search">
                <input type="text" id="attendance-search" placeholder="Search Attendances..." onkeyup="searchSection('attendance')">
                <button class="btn btn-refresh" onclick="refreshSection('attendance')">Refresh</button>

                <!-- Filter to show attendance for active or inactive students -->
                <label for="attendance-filter">Show:</label>
                <select id="attendance-filter" onchange="refreshSection('attendance')">
                    <option value="1">Active Students</option>
                    <option value="0">Inactive Students</option>
                </select>

                <!-- Hidden columns specify searchable fields -->
                <input type="hidden" id="attendance-columns" value="student_id,date,status">
                <button class="btn btn-add" onclick="showModal('attendance')">Add Attendance</button>
            </div>

            <!-- Table to dynamically load attendance data with JavaScript -->
            <table id="attendance-table">
                <!-- Data will be loaded here by JavaScript -->
            </table>
        </div>

        <!-- Logout and Close Application buttons -->
        <a href="logout.php" class="btn btn-logout">Log Out</a>
        <a href="system_logout.php" class="btn btn-logout">System Logout</a>
        <a id="closeAppButton" class="btn btn-closeAppButton">Close Application</a>

    </div>

    <!-- Modal for Students: Allows adding or editing student details -->
    <div id="students-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('students')">&times;</span>
            <h2 id="students-modal-title">Add Student</h2>
            <form id="student-form" onsubmit="saveData('student')">
                <!-- Hidden field for student ID used for editing -->
                <input type="hidden" id="students-student_id" name="id">
                <div class="form-row">
                    <label for="name">Student Name</label>
                    <input type="text" id="students-name" name="name" required>
                </div>
                <div class="form-row">
                    <label for="can_sign_out">Can Sign Out (Study's)</label>
                    <select id="students-can_sign_out" name="can_sign_out" required>
                        <option value="0">False</option>
                        <option value="1">True</option>
                    </select>
                </div>
                <div class="form-row">
                    <button type="submit" name="save_student" class="btn">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Users: Allows adding or editing user details -->
    <div id="users-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('users')">&times;</span>
            <h2 id="users-modal-title">Add User</h2>
            <form id="user-form" onsubmit="saveData('user')">
                <!-- Hidden field for user ID used for editing -->
                <input type="hidden" id="users-user_id" name="id">
                <div class="form-row">
                    <label for="username">Username</label>
                    <input type="text" id="users-username" name="username" required>
                </div>
                <div class="form-row hide-on-edit">
                    <label for="password">Password</label>
                    <input type="password" id="users-password" name="password" minlength="8" required>
                </div>
                <div class="form-row">
                    <label for="rfid">RFID</label>
                    <input type="text" id="users-rfid" name="rfid">
                    <button id="user-scan-button" type="button" class="btn btn-scanRFID" onclick="startRFIDListening('users-rfid', 'user-scan-button')">Scan RFID</button>
                </div>
                <div class="form-row">
                    <label for="student_id">Student ID</label>
                    <input type="text" id="users-student_id" name="student_id" oninput="searchStudent(this.value, 'users')" required>
                    <div id="users-search-results" class="search-results"></div>
                </div>
                <div class="form-row">
                    <button type="submit" name="save_user" class="btn">Save</button>
                </div>
            </form>
        </div>
    </div>


    <!-- Modal for Attendance: Allows adding or editing attendance records -->
    <div id="attendance-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('attendance')">&times;</span>
            <h2 id="attendance-modal-title">Add Attendance</h2>
            <form id="attendance-form" onsubmit="saveData('attendance')">
                <!-- Hidden field for attendance ID used for editing -->
                <input type="hidden" id="attendance-attendance_id" name="id">
                <div class="form-row hide-on-edit">
                    <label for="student_id">Student ID</label>
                    <input type="text" id="attendance-student_id" name="student_id" oninput="searchStudent(this.value, 'attendance')" required>
                    <div id="attendance-search-results" class="search-results"></div>
                </div>
                <div class="form-row">
                    <label for="date">Date</label>
                    <input type="date" id="attendance-date" name="date" required>
                </div>
                <div class="form-row">
                    <label for="time">Time</label>
                    <input type="time" id="attendance-time" name="time" required>
                </div>
                <div class="form-row">
                    <label for="status">Status</label>
                    <select id="attendance-status" name="status" required>
                        <option value="in">Signed In</option>
                        <option value="out">Signed Out</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="reason">Reason</label>
                    <input type="text" id="attendance-reason" name="reason" maxlength="100">
                </div>
                <div class="form-row">
                    <button type="submit" name="save_attendance" class="btn">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Classes: Allows adding or editing class details -->
    <div id="classes-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('classes')">&times;</span>
            <h2 id="classes-modal-title">Add Class</h2>
            <form id="classe-form" onsubmit="saveData('classe')">
                <!-- Hidden field for class ID used for editing -->
                <input type="hidden" id="classes-class_id" name="id">
                <div class="form-row">
                    <label for="name">Class Name</label>
                    <input type="text" id="classes-name" name="name" required>
                </div>
                <div class="form-row">
                    <label for="semester">Semester</label>
                    <select id="classes-semester" name="semester" required>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="year">Year</label>
                    <select id="classes-year" name="year" required>
                        <!-- Options populated by JavaScript -->
                    </select>
                </div>
                <div class="form-row">
                    <button type="submit" name="save_class" class="btn">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Viewing Timetable: Displays the timetable in a popup -->
    <div id="timetable-modal" class="popup">
        <div class="modal-content">
            <!-- Close button to close the timetable modal -->
            <span class="close" onclick="closeTimetable()">&times;</span>
            <h1>Timetable</h1>
            <div id="timetable-container">
                <!-- Container where timetable data will be dynamically filled by JavaScript -->
            </div>
        </div>
    </div>


    <!-- Modal for Class Periods: Allows adding or editing class periods -->
    <div id="class_periods-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('class_periods')">&times;</span>
            <h2 id="class_periods-modal-title">Add Class Period</h2>
            <form id="class_period-form" onsubmit="saveData('class_period')">
                <!-- Hidden fields for class period details -->
                <input type="hidden" id="class_periods-id" name="id">
                <input type="hidden" id="class_periods-class_id" name="class_id">
                <input type="hidden" id="class_periods-period" name="period">
                
                <div class="form-row">
                    <label for="room">Classroom</label>
                    <select id="class_periods-room" name="room" required>
                        <!-- List of classroom options -->
                        <option value="D1">D1</option>
                        <option value="D2">D2</option>
                        <option value="J1">J1</option>
                        <option value="J2">J2</option>
                        <option value="J3">J3</option>
                        <option value="J4">J4</option>
                        <option value="J5">J5</option>
                        <option value="J6">J6</option>
                        <option value="K1">K1</option>
                        <option value="K2">K2</option>
                        <option value="K3">K3</option>
                        <option value="K4">K4</option>
                        <option value="K5">K5</option>
                        <option value="K6">K6</option>
                        <option value="F7">F7</option>
                        <option value="Tech1">Tech1</option>
                        <option value="Tech2">Tech2</option>
                        <option value="Tech3">Tech3</option>
                        <option value="Stem1">Stem1</option>
                        <option value="Stem2">Stem2</option>
                        <option value="Stem3">Stem3</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                        <option value="C3">C3</option>
                        <option value="C4">C4</option>
                        <option value="C5">C5</option>
                        <option value="C6">C6</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="B4">B4</option>
                        <option value="B5">B5</option>
                        <option value="B6">B6</option>
                        <option value="B7">B7</option>
                        <option value="B8">B8</option>
                        <option value="B9">B9</option>
                        <option value="IRC1">IRC1</option>
                        <option value="IRC2">IRC2</option>
                        <option value="IRC3">IRC3</option>
                        <option value="IRC4">IRC4</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="GYM">Gym</option>
                        <option value="VAStudio1">VA-Studio1</option>
                        <option value="VAStudio2">VA-Studio2</option>
                        <option value="FAB">FAB</option>
                        <option value="Study">Study</option>
                    </select>
                </div>
                <input type="hidden" id="class_periods-day_of_week" name="day_of_week">
                <div class="form-row">
                    <button type="submit" name="save_class_period" class="btn">Save</button>
                </div>
                <div class="form-row show-on-edit">
                    <button type="button" name="delete_class_period" class="btn btn-delete" 
                        onclick="deleteData('class_periods', currentEditId, () => { closeModal('class_periods'); showTimetable('classes', currentTimetableID, 0); })">Delete
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Managing Student Classes: Allows adding or removing student classes -->
    <div id="student-classes-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeModal('student-classes')">&times;</span>
            <h2 id="student-classes-modal-title">Manage Student Classes</h2>
            <form id="student-classes-form">
                <input type="hidden" id="student-classes-student_id" name="student_id">
                <div class="form-row">
                    <label for="student-name">Student Name</label>
                    <input type="text" id="student-classes-student-name" name="student_name" readonly>
                </div>
                <div class="form-row">
                    <label for="available-classes">Available Classes</label>
                    <select id="available-classes" name="available_classes[]" multiple>
                        <!-- Options populated by JavaScript -->
                    </select>
                    <button type="button" onclick="addClassToStudent()" class="btn">Add</button>
                </div>
                <div class="form-row">
                    <label for="student-classes">Student's Current Classes</label>
                    <select id="student-classes" name="student_classes[]" multiple>
                        <!-- Options populated by JavaScript -->
                    </select>
                    <button type="button" onclick="removeClassFromStudent()" class="btn btn-delete">Remove</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal for Changing User Password -->
    <div id="changePassword-modal" class="popup">
        <div class="modal-content">
            <span class="close" onclick="closeChangePassword()">&times;</span>
            <h2>Change User's Password</h2>
            <form id="changePasswordForm" onsubmit="savePassword()">
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                <button type="submit" class="btn">Change Password</button>
            </form>
        </div>
    </div>


    <!-- Overlay for blocking background when popups are open -->
    <div id="popupOverlay"></div>

    <!-- Custom popup for displaying messages and confirmations -->
    <div id="customPopup" class="popup" style="display: none;">
        <div class="popup-content">
            <p id="popupMessage"></p> <!-- Placeholder for custom messages -->
            <div id="popupButtons" class="popup-buttons"> <!-- Placeholder for action buttons -->
                <!-- Buttons to be filled by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Include JavaScript file for managing dashboard interactions -->
    <script src="js/admin_dashboard.js"></script>
</body>
</html>