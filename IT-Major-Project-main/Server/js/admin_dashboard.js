//#region Year Dropdown
// Get the current year, set a start year, and end year range (10 years ahead)
const currentYear = new Date().getFullYear();
const startYear = 2000;
const endYear = currentYear + 10;

// Populate year dropdown with options from startYear to endYear
const yearSelect = document.getElementById("classes-year");

for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
}
//#endregion

//#region Electron Detection, RFID Setup, and Close Application Button (Electron Only)
// Check if running inside Electron (for desktop app vs browser)
let rfid_enabled = false;
let ipcRenderer;

if (typeof require !== 'undefined' && typeof require('electron') !== 'undefined') {
    ipcRenderer = require('electron').ipcRenderer; // Get Electron's IPC renderer for communication
    rfid_enabled = true;
} else {
    console.log('Running in browser, Electron features are disabled.');
    rfid_enabled = false;
}

let currentRFIDField = null;
let currentScanButton = null;


function startRFIDListening(rfidFieldId, buttonId) {
    // Start listening for RFID input if RFID is enabled
    if (rfid_enabled) {
        currentRFIDField = document.getElementById(rfidFieldId);
        currentScanButton = document.getElementById(buttonId);
        currentScanButton.disabled = true;
        currentScanButton.textContent = 'Scanning for RFID...';
    }
}

function stopRFIDListening() {
    // Stop listening for RFID input and reset button state if RFID is enabled
    if (currentScanButton != null && rfid_enabled) {
        currentScanButton.textContent = 'Scan RFID';
        currentScanButton.disabled = false;
        currentRFIDField = null;
        currentScanButton = null;
    }
}

// Get reference to the button
const closeAppButton = document.getElementById('closeAppButton');

if (rfid_enabled) {
    // Listen for RFID data from main process
    ipcRenderer.on('rfid', (event, rfid) => {
        if (currentRFIDField && currentScanButton) {
            currentRFIDField.value = rfid;

            // Trigger the search after the RFID is set
            if (currentRFIDField.id === 'users-search') {
                searchSection('users');
            }

            stopRFIDListening();
        }
    });

    // Add an event listener to the button
    closeAppButton.addEventListener('click', function() {
        // Send a message to the main process to close the app
        ipcRenderer.send('close-app');
    });
} else {
    // Disable the button if RFID is not enabled
    closeAppButton.disabled = true;
    closeAppButton.title = "Not running as application so it cannot be closed.";
}
//#endregion

//#region Modal Managemen
function showSection(sectionId) {
    // Show the specified section and hide all others
    const sections = document.getElementsByClassName('data-section');
    
    // Remove the 'active' class from all sections to hide them
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    
    // Add 'active' class to the selected section to show it
    document.getElementById(`${sectionId}-section`).classList.add('active');
    
    // Clear the search field and reset the filter value to its default
    document.getElementById(`${sectionId}-search`).value = '';
    document.getElementById(`${sectionId}-filter`).value = 1;

    // Refresh content of the selected section
    refreshSection(sectionId);
}

let editMode = false; // Tracks if in edit mode
let currentEditId = null; // Stores ID of the current item being edited
let currentTable = null; // Stores the table name for current modal

function showModal(table, mode = 'add', id = null) {
    // Display modal for adding or editing data
    const modal = document.getElementById(`${table}-modal`);
    const modalTitle = document.getElementById(`${table}-modal-title`);
    modal.style.display = 'block'; // Show the modal
    editMode = (mode === 'edit'); // Set mode to edit if specified
    currentEditId = id; // Store ID if editing an existing item
    currentTable = table; // Store table name for reference

    // Show popup overlay
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = 'block';

    // Get elements that should be shown or hidden based on mode
    const hideOnEditElements = modal.querySelectorAll('.hide-on-edit');
    const showOnEditElements = modal.querySelectorAll('.show-on-edit');

    if (editMode) {
        // Edit mode: adjust title and show/hide elements
        modalTitle.textContent = `Edit ${capitalizeFirstLetter(table.slice(0, -1))}`;
        hideOnEditElements.forEach(element => element.style.display = 'none');
        showOnEditElements.forEach(element => element.style.display = 'block');

        // Fetch and populate data for the item being edited
        fetch(`fetch_row.php?table=${table}&id=${id}`)
            .then(response => response.json())
            .then(data => {
                for (let key in data) {
                    let inputField = document.getElementById(`${table}-${key}`);
                    if (inputField) inputField.value = data[key];
                }
            });
    } else {
        // Add mode: adjust title and reset modal fields
        modalTitle.textContent = `Add ${capitalizeFirstLetter(table.slice(0, -1))}`;
        hideOnEditElements.forEach(element => element.style.display = 'block');
        showOnEditElements.forEach(element => element.style.display = 'none');
        resetModal(modal);

        // Prefill date and time for attendance records
        if (table === 'attendance') {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
            document.getElementById('attendance-date').value = formattedDate;
            document.getElementById('attendance-time').value = formattedTime;
        }
    }
}

function showPopup(message, buttons, closeOverlayOnNo = true) {
    // Display a popup with a message and action buttons
    const popup = document.getElementById('customPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    popupMessage.innerText = message; // Set the message in the popup
    popupButtons.innerHTML = ''; // Clear any existing buttons

    // Create each button based on the provided button array
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.innerText = button.text; // Set button text
        btn.className = "btn btn-custom";

        // Set button action and handle overlay display
        btn.onclick = function() {
            button.action();
            closePopup(); // Close the popup
            if (!closeOverlayOnNo) document.getElementById('popupOverlay').style.display = 'block';
        };

        popupButtons.appendChild(btn); // Add button to popup
    });

    popupOverlay.style.display = 'block'; // Show overlay
    popup.style.display = 'block'; // Show popup
}

function closePopup() {
    // Hide the popup and overlay
    document.getElementById('customPopup').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';
}

//#endregion

//#region Timetable
let currentTimetableID = null; // Store the current timetable ID

function createTimetable(container, week, data, section) {
    // Create a timetable table and add it to the specified container
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const periods = ['Period', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Add a header row with period and day labels
    periods.forEach(period => {
        const th = document.createElement('th');
        th.textContent = period;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const numPeriods = 6;

    // Create rows for each period and add day cells with data
    for (let p = 0; p < numPeriods; p++) {
        const tr = document.createElement('tr');
        const tdPeriod = document.createElement('td');
        tdPeriod.className = 'period-header';
        tdPeriod.textContent = p === 0 ? 'Pc' : `Period ${p}`;
        tr.appendChild(tdPeriod);

        // Add cells for each weekday, showing class names if present
        for (let d = 1; d <= 5; d++) {
            const td = document.createElement('td');
            if (section === 'classes') td.onclick = () => slotClicked(week, d, p, data[week][d][p]);
            td.innerHTML = data[week][d][p] ? data[week][d][p].map(item => item.class_name).join(', ') : ''; // Show class names
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table); // Append the completed table to the container
}

function slotClicked(week, day, period, classPeriodData) {
    // Handle clicking on a timetable slot to show a modal for editing or adding data
    if (Array.isArray(classPeriodData)) {
        // Open modal in edit mode if there’s data in the slot
        showModal("class_periods", "edit", classPeriodData[0].id);
    } else {
        // Open modal for adding a new entry
        showModal("class_periods");

        let form = document.forms['class_period-form'];
        form.elements["class_id"].value = currentTimetableID;
        form.elements["day_of_week"].value = (week - 1) * 5 + day;
        form.elements["period"].value = period;

        // Autofill room data if available by fetching common period data
        fetch(`fetch_common_period_data.php?id=${currentTimetableID}`)
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                if (data && data.room) form.elements["room"].value = data.room;
            })
            .catch(error => console.error('Error fetching class data:', error));
    }
}

function setupTimetable(section, class_ids, student_id) {
    // Fetch timetable data for the provided class IDs
    fetch(`fetch_timetable_data.php?class_ids=${class_ids}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('timetable-container');
            container.innerHTML = ''; // Clear any existing content

            // Add header and create timetable for Week 1
            const week1Header = document.createElement('h3');
            week1Header.className = 'week-header';
            week1Header.textContent = 'Week 1';
            container.appendChild(week1Header);
            createTimetable(container, 1, data, section);

            // Add header and create timetable for Week 2
            const week2Header = document.createElement('h3');
            week2Header.className = 'week-header';
            week2Header.textContent = 'Week 2';
            container.appendChild(week2Header);
            createTimetable(container, 2, data, section);

            // If viewing as a student, add a "Manage Classes" button
            if (section === 'students') {
                const manageClassesButton = document.createElement('button');
                manageClassesButton.textContent = 'Manage Classes';
                manageClassesButton.className = 'manage-classes-button btn';
                
                // Show the Manage Classes modal when the button is clicked
                manageClassesButton.addEventListener('click', () => {
                    showManageClassesModal(student_id);
                });
                
                container.appendChild(manageClassesButton);
            }

            // Display the timetable modal and overlay
            document.getElementById('timetable-modal').style.display = 'block';
            document.getElementById('popupOverlay').style.display = 'block';
        })
        .catch(error => console.error('Error fetching timetable data:', error)); // Log error if fetch fails
}

function showTimetable(section, id = null, type = 0) {
    // Display the timetable for a specified section and ID
    if (id === null || section === null) {
        console.error('No class ID provided or section provided');
        return; // Exit if no ID or section is provided
    }

    currentTimetableID = id; // Store the current timetable ID

    console.log("Showing timetable, Type: ", type, ", ID: ", id);
    
    if (type === 1) {
        // Fetch student data if type is 1
        fetch(`fetch_row.php?id=${id}&table=students`)
            .then(response => response.json())
            .then(data => {
                // Call setupTimetable with class IDs for the student
                setupTimetable(section, data.class_ids, id);
            })
            .catch(error => console.error('Error fetching class data:', error)); // Log errors if fetch fails
    } else {
        // Call setupTimetable with the provided section and ID
        setupTimetable(section, id);
    }
}

function closeTimetable() {
    // Hide the timetable modal and overlay
    document.getElementById('timetable-modal').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';

    currentTimetableID = null; // Reset the current timetable ID
}

//#endregion

//#region Class and Student Management
function showManageClassesModal(studentId) {
    // Display the modal to manage classes for the specified student ID
    console.log('Manage classes for student ID:', studentId);

    const modal = document.getElementById('student-classes-modal');
    modal.style.display = 'block'; // Show the modal

    // Fetch student data and current class enrollments
    fetch(`fetch_row.php?id=${studentId}&table=students`)
        .then(response => response.json())
        .then(data => {
            // Fill in student details in the modal
            document.getElementById('student-classes-student_id').value = data.student_id;
            document.getElementById('student-classes-student-name').value = data.name;

            // Get and process class IDs for the student
            const classIds = (data.class_ids && data.class_ids.trim() !== '') 
                ? data.class_ids.split(',').map(id => id.trim()) 
                : []; // Use empty array if no classes found

            // Populate current classes in the "student-classes" select box
            const studentClassesSelect = document.getElementById('student-classes');
            studentClassesSelect.innerHTML = ''; // Clear any existing options

            // Fetch and display details for each current class if class IDs are present
            if (classIds.length > 0) {
                classIds.forEach(classId => {
                    fetch(`fetch_row.php?id=${classId}&table=classes`)
                        .then(response => response.json())
                        .then(data => {
                            if (data != null) {
                                // Create and configure option for each class
                                const option = document.createElement('option');
                                option.value = classId;
                                option.textContent = `${data.class_id}: ${data.name} - Year: ${data.year}, Semester: ${data.semester}`;

                                // Mark class as disabled if inactive
                                if (!data.is_active) {
                                    option.textContent += ' - Disabled';
                                }

                                studentClassesSelect.appendChild(option); // Add class option to select box
                            }
                        })
                        .catch(error => console.error('Error fetching class data:', error));
                });
            }

            // Fetch available classes the student is not enrolled in
            fetch(`fetch_data.php?section=classes&include_actions=false`)
                .then(response => response.json())
                .then(data => {
                    const availableClassesSelect = document.getElementById('available-classes');
                    availableClassesSelect.innerHTML = ''; // Clear existing options

                    // Filter classes to include only active ones not already enrolled by student
                    const filteredClasses = data.filter(classItem => {
                        const isActive = classItem.is_active;
                        const isEnrolled = classIds.includes(classItem.class_id);
                        return isActive && !isEnrolled;
                    });

                    // Create options for each available class
                    filteredClasses.forEach(classItem => {
                        const option = document.createElement('option');
                        option.value = classItem.class_id;
                        option.textContent = `${classItem.class_id}: ${classItem.name} - Year: ${classItem.year}, Semester: ${classItem.semester}`;
                        availableClassesSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error fetching available classes:', error));
        })
        .catch(error => console.error('Error fetching student data:', error));
}

function addClassToStudent() {
    const availableClassesSelect = document.getElementById('available-classes');

    // Get the selected class from the available classes dropdown
    const selectedOption = availableClassesSelect.options[availableClassesSelect.selectedIndex];

    // Exit if no class is selected
    if (!selectedOption) {
        console.log('No class selected to add.');
        return;
    } 

    const classIdToAdd = selectedOption.value;
    console.log('Adding class:', classIdToAdd, '. For student ID:', currentTimetableID);

    // Fetch the current classes for the student
    fetch(`fetch_row.php?id=${currentTimetableID}&table=students`)
        .then(response => response.json())
        .then(data => {
            // Get current class IDs as an array, or initialize an empty array if none
            let classIds = data.class_ids ? data.class_ids.split(',') : [];

            // Add the new class ID if it's not already in the list
            if (!classIds.includes(classIdToAdd)) {
                classIds.push(classIdToAdd);
            }

            // Prepare the updated list of class IDs as a comma-separated string
            const updatedClassIds = classIds.join(',');

            console.log('Updated class IDs:', updatedClassIds);

            // Update the student record with the new list of classes
            updateStudentClasses(updatedClassIds);
        })
        .catch(error => console.error('Error fetching class data:', error));
}

function removeClassFromStudent() {
    const studentClassesSelect = document.getElementById('student-classes');

    // Get the selected class from the student's current classes
    const selectedOption = studentClassesSelect.options[studentClassesSelect.selectedIndex];

    // Exit if no class is selected
    if (!selectedOption) {
        console.log('No class selected to remove.');
        return;
    }

    const classIdToRemove = selectedOption.value;
    console.log('Removing class:', classIdToRemove, '. For student ID:', currentTimetableID);

    // Fetch current classes for the student
    fetch(`fetch_row.php?id=${currentTimetableID}&table=students`)
        .then(response => response.json())
        .then(data => {
            // Get current class IDs as an array, or initialize an empty array if none
            let classIds = data.class_ids ? data.class_ids.split(',') : [];

            // Remove the selected class ID from the list
            classIds = classIds.filter(id => id !== classIdToRemove);

            // Prepare the updated list of class IDs as a comma-separated string
            const updatedClassIds = classIds.join(',');

            // Update the student record with the new list of classes
            updateStudentClasses(updatedClassIds);
        })
        .catch(error => console.error('Error fetching class data:', error));
}

function updateStudentClasses(updatedClassIds) {
    // Send a POST request to update the student's classes
    fetch('save_data.php', { 
        method: 'POST',
        body: new URLSearchParams({
            'save_student_classes': true,
            'id': currentTimetableID,
            'class_ids': updatedClassIds
        })
    })
    .then(data => {
        // Refresh the modal and timetable after updating
        showManageClassesModal(currentTimetableID);
        showTimetable("students", currentTimetableID, 1);
    })
    .catch(error => console.error('Error:', error));
}
//#endregion

//#region Password Management

var changePasswordModal = document.getElementById('changePassword-modal'); // Reference to the change password modal
var newPasswordInput = document.getElementById("newPassword"); // Input field for the new password
var confirmPasswordInput = document.getElementById("confirmPassword"); // Input field to confirm new password

let currentPasswordChangeId = null; // Stores the ID of the user for password change

function resetPassword(id = null) {
    // Display the change password modal with cleared fields
    document.getElementById('popupOverlay').style.display = 'block'; // Show the overlay
    currentPasswordChangeId = id; // Set the user ID for password change
    newPasswordInput.value = ''; // Clear the new password input
    confirmPasswordInput.value = ''; // Clear the confirm password input
    changePasswordModal.style.display = 'block'; // Show the password modal
}

function savePassword() {
    event.preventDefault(); // Prevent form submission and page refresh
    
    // Retrieve values from input fields
    var newPassword = newPasswordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    let issue = true;
    let issueMessage = "";

    // Validate password length and match
    if (newPassword.length < 8) {
        issueMessage = "Password is too short";
    } else if (newPassword.length > 16) {
        issueMessage = "Password is too long";
    } else if (newPassword !== confirmPassword) {
        issueMessage = "Passwords do not match!";
    } else {
        issue = false; // No issues found
    }

    // If there's an issue, display a popup message and clear password fields
    if (issue) {
        showPopup(issueMessage, [
            { text: 'OK', action: function() { 
                console.log('Popup closed'); 
                newPasswordInput.value = ''; // Clear inputs if there's an issue
                confirmPasswordInput.value = '';
            }}
        ], false);
        return;
    }

    // Send password change request if validation passes
    fetch(`reset_password.php?id=${currentPasswordChangeId}&password=${newPassword}`)
        .then(response => response.text())
        .then(data => {
            // Show confirmation popup on success
            showPopup(data, [
                { text: 'OK', action: function() { 
                    console.log('Popup closed'); 
                    closeChangePassword(); // Close the modal after password is changed
                }}
            ], true);
        })
        .catch(error => console.error('Error:', error)); // Log error if fetch fails
}

function closeChangePassword() {
    changePasswordModal.style.display = 'none'; // Hide the change password modal    
    currentPasswordChangeId = null; // Clear the stored ID for password change
    closeModal('changePassword'); // Close the overlay or any additional modal elements related to change password
}

//#endregion

//#region Activity Status Change
function changeStudentActivity(id, is_active) {
    // Toggle the is_active status (0 becomes 1, and 1 becomes 0)
    is_active = 1 - is_active;

    // Create a confirmation message based on the new status
    let message = "Are you sure you want to ";
    if (is_active === 0) {
        message += "De-activate student: ";
    } else {
        message += "Re-activate student: ";
    }
    message += id;

    // Display a confirmation popup with Yes and No actions
    showPopup(message, [
        { 
            text: 'Yes', 
            action: function() {
                // Send request to update the student's activity status
                fetch(`change_student_activity.php?id=${id}&is_active=${is_active}`)
                    .then(response => response.text())
                    .then(data => {
                        // Refresh the student section on success
                        refreshSection('students');
                    })
                    .catch(error => console.error('Error:', error)); // Log any fetch errors
            } 
        },
        { 
            text: 'No', 
            action: function() { 
                console.log('Action cancelled'); // Log cancellation if No is clicked
            } 
        }
    ], true); // Keep overlay active if No is clicked
}

function changeClassActivity(id, is_active) {
    // Toggle the is_active status (0 becomes 1, and 1 becomes 0)
    is_active = 1 - is_active;

    // Create a confirmation message based on the new status
    let message = "Are you sure you want to ";
    if (is_active === 0) {
        message += "De-activate class: ";
    } else {
        message += "Re-activate class: ";
    }
    message += id;

    // Show confirmation popup with Yes and No options
    showPopup(message, [
        { 
            text: 'Yes', 
            action: function() {
                // Send request to update the class's activity status
                fetch(`change_class_activity.php?id=${id}&is_active=${is_active}`)
                    .then(response => response.text())
                    .then(data => {
                        // Refresh the class section on successful update
                        refreshSection('classes');
                    })
                    .catch(error => console.error('Error:', error)); // Log any fetch errors
            } 
        },
        { 
            text: 'No', 
            action: function() { 
                console.log('Action cancelled'); // Log cancellation if No is clicked
            } 
        }
    ], true); // Keep overlay active if No is clicked
}
//#endregion

//#region Data Management
function closeModal(table) {
    // Close the modal associated with the specified table
    var modal = document.getElementById(table + '-modal');
    modal.style.display = 'none'; // Hide the modal

    // Hide the overlay if the table is not 'student-classes' or 'class_periods'
    if (table !== 'student-classes' && table !== 'class_periods') {
        document.getElementById('popupOverlay').style.display = 'none';
    }
    
    resetModal(modal); // Reset modal fields and settings
}

function resetModal(modal) {
    // Clear all input and select fields within the modal
    var inputs = modal.querySelectorAll('input, select');
    inputs.forEach(function(input) {
        input.value = ''; // Reset each field to an empty value
    });
    editMode = false; // Reset edit mode to false

    // Clear any search results within the modal's search box
    var searchResultsContainer = modal.querySelector('.search-results');
    if (searchResultsContainer) {
        searchResultsContainer.innerHTML = ''; // Clear search results
    }
    
    // Stop RFID listening if active
    stopRFIDListening();
}

function refreshSection(section) {
    // Refreshes the content of a specific section based on search and filter criteria
    const tableId = section + '-table';
    const table = document.getElementById(tableId);
    const searchValue = document.getElementById(section + '-search').value || ''; // Get search input or default to empty string
    const filterValue = document.getElementById(section + '-filter').value; // Get the current filter value

    // Stop RFID listening before refreshing the section
    stopRFIDListening();
    
    // Fetch the updated data for the section using the search and filter criteria
    fetch(`fetch_data.php?section=${section}&search=${searchValue}&is_active=${filterValue}&include_actions=1`)
        .then(response => response.text())
        .then(data => {
            table.innerHTML = data; // Update the table content with the fetched data
        })
        .catch(error => console.error('Error:', error)); // Log any fetch errors
}
//#endregion

//#region Data Management
function deleteData(table, id, onSuccess = () => {}, onCancel = () => {}) {
    // Show a custom confirmation popup for deleting data
    showPopup('Are you sure you want to delete this data?', [
        { 
            text: 'Yes', 
            action: function() {
                console.log("Deleting Table: " + table + ". ID: " + id);

                // Send a request to delete the specified item
                fetch(`delete.php?table=${table}&id=${id}`)
                    .then(response => response.text())
                    .then(data => {
                        // Refresh the section if it's not "class_periods"
                        if (table !== "class_periods") {
                            refreshSection(table);
                        }
                        // Execute the onSuccess callback if provided
                        onSuccess();
                    })
                    .catch(error => console.error('Error:', error)); // Log any fetch errors
            } 
        },
        { 
            text: 'No', 
            action: function() { 
                console.log('Delete action cancelled'); 
                // Execute the onCancel callback if provided
                onCancel();
            } 
        }
    ], true); // Keep overlay active if No is clicked
}

// Save data using AJAX to prevent page refresh
function saveData(section) {
    event.preventDefault(); // Stop form submission to prevent page refresh

    // Collect form data from the specified section
    let formData = new FormData(document.getElementById(`${section}-form`));
    formData.append('save_' + section, true); // Add a save key to indicate the save action

    // Send data using a POST request
    fetch('save_data.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {   
        let sectionName = section;

        // Check if the response contains an error message
        if (data.includes("Error:")) {
            // Display the error message in a popup
            showPopup(data, [
                { text: 'OK', action: function() { console.log('Popup closed'); } }
            ], true);
            return;
        }

        // If section is not 'attendance', adjust the section name for consistency
        if (section !== 'attendance') {
            sectionName += 's';
        }

        // Close the modal associated with the section
        closeModal(sectionName);

        // If saving class periods, refresh the timetable instead of the section
        if (sectionName === "class_periods") {
            showTimetable('classes', currentTimetableID, 0);
            return;
        }

        // Refresh the section to show updated data
        refreshSection(sectionName);
    })
    .catch(error => {
        // Display an error popup if the request fails
        showPopup(error, [
            { text: 'OK', action: function() { console.log('Popup closed'); } }
        ], true);
        return;
    });
}
//#endregion

//#region Event Listeners
// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none"; // Hide the modal
            resetModal(modals[i]); // Reset the modal's content
        }
    }
}

// When the page loads, show the students section by default
window.onload = function() {
    showSection('students');
};
//#endregion

//#region Search Functionality
function searchSection(section) {
    // Refresh the section to show search results
    refreshSection(section);
}

function searchStudent(query, context) {
    // If the query is empty, clear search results and exit the function
    if (query.length === 0) {
        document.getElementById(context + '-search-results').innerHTML = '';
        return;
    }

    // Fetch search results based on the query
    fetch(`search_student.php?query=${query}`)
        .then(response => response.json())
        .then(data => {
            // Get the search results container and clear any previous results
            let resultBox = document.getElementById(context + '-search-results');
            resultBox.innerHTML = '';

            // Create a result item for each student in the fetched data
            data.forEach(student => {
                let item = document.createElement('div');
                item.style.padding = '8px';
                item.style.cursor = 'pointer';
                item.innerHTML = `${student.student_id} - ${student.name}`;

                // Set up an onclick event to populate the student ID in the context input
                item.onclick = function() {
                    document.getElementById(context + '-student_id').value = student.student_id;
                    resultBox.innerHTML = ''; // Clear search results after selection
                };

                resultBox.appendChild(item); // Add the item to the results container
            });
        })
        .catch(error => console.error('Error:', error)); // Log any fetch errors
}
//#endregion

//#region Attendance Management
function printAttendanceSlip(attendanceId) {
    // Fetch attendance data using the provided attendance ID
    fetch(`fetch_row.php?id=${attendanceId}&table=attendance`)
        .then(response => response.json())
        .then(data => {
            // Show an error popup if no data is returned
            if (!data) {
                showPopup("Error fetching attendance record.", [
                    { text: 'OK', action: function() { console.log('Popup closed'); } }
                ]);
                return;
            }
            
            // Construct the HTML content for the printable attendance slip
            const printableContent = `
                <div id="printableArea">
                    <img src="images/SMMC_Teal-20342cb8.png">
                    <h2 style="text-align: center;">Attendance Confirmation Slip</h2>
                    <h3 style="text-align: center;">St Mary Mackillop College, Canberra</h3>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                    <p><strong>Status:</strong> ${data.status === 'in' ? 'Signed In' : 'Signed Out'}</p>
                    <p><strong>Reason:</strong> ${data.reason}</p>
                </div>
            `;

            // Open a new window for printing
            const printWindow = window.open("", "", "width=800,height=600");

            // Write the HTML content to the new window
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Attendance Slip</title>
                        <link rel="stylesheet" href="css/mackillop school theme.css">
                        <link rel="stylesheet" href="css/dashboard.css">
                    </head>
                    <body>
                        ${printableContent}
                    </body>
                </html>
            `);
            
            // Finalize the document and print
            printWindow.document.close();
            printWindow.print();
            
            // Close the print window after printing
            printWindow.close();
        })
        .catch(error => {
            // Log any fetch errors and show an error popup
            console.error('Error:', error);
            showPopup("Error fetching attendance record.", [
                { text: 'OK', action: function() { console.log('Popup closed'); } }
            ]);
        });
}

function checkStudentStatus(studentId) {
    // Fetch student status information using the provided student ID
    fetch(`get_student_status.php?student_id=${studentId}`)
        .then(response => response.json())
        .then(data => {
            // Handle any errors in the response data
            if (data.error) {
                console.error('Error:', data.error);
                showPopup("Error fetching attendance record.", [
                    { text: 'OK', action: function() { console.log('Popup closed'); } }
                ]);
            } else {
                // Construct the status message with relevant student details
                let statusMessage = `Student Status: ${data.status}`;
                if (data.class_name) {
                    statusMessage += `\nClass: ${data.class_name}`;
                }
                if (data.room) {
                    statusMessage += `\nRoom: ${data.room}`;
                }
                // Show the status message in a popup
                showPopup(statusMessage, [
                    { text: 'OK', action: function() { console.log('Popup closed'); } }
                ]);
            }
        })
        .catch(error => {
            // Log any fetch errors and show an error popup
            console.error('Error:', error);
            showPopup("Error fetching attendance record.", [
                { text: 'OK', action: function() { console.log('Popup closed'); } }
            ]);
        });
}
//#endregion

function displayMessage(message, locationName) {
    // Get the message container by its ID
    const messageDiv = document.getElementById(locationName);

    // Set the message text and make the container visible
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    // Automatically hide the message after 2 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 2000);
}

function capitalizeFirstLetter(string) {
    // Capitalize the first letter of the given string and return it
    return string.charAt(0).toUpperCase() + string.slice(1);
}