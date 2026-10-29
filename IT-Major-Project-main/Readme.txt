Mason Belmonte's Major Project - Independent Sign-In/Sign-Out System for the School

Below should be everything you need to setup and use the application. The more in depth examples on how the project will be used will be presented in the Project Showcase on the 8th of November.



Server Setup: (If anything doesn't work please send me an email, if i don't respond you can also email my personal email: masonbelmonte2024@gmail.com)

I also recommend disabling any anti viruses as for some reason it decides to block the ports. And installing with administrator.





Download and Install XAMPP Apache for windows: 
https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe


At the installation it will ask you to select components, you only need Apache, MySQL, PHP and phpMyAdmin. You can deselect the rest and continue installing. Just follow default setting after that.

During the installation a directory will be created: 'C:\xampp\htdocs\' and an application 'XAMPP Control Panel'. And make sure you allow all Apache and MySQL windows security stuff so it can go threw ports.

The new folder 'C:\xampp\htdocs\' will have some example code inside just delete it all and extract the project folder 'IT-Major-Project.zip', and move the contents of the Server file into the new folder 'C:\xampp\htdocs\'

Ensure that the contents are extracted into the folder 'C:\xampp\htdocs\'. An example of the path is 'C:\xampp\htdocs\index.php'

Open 'XAMPP Control Panel' and start 'Apache' and 'MySQL'





MySQL:
MySQL is automatically installed with the above link. 

Click Start and then admin, this will bring you into a browser running the link 'http://localhost/phpmyadmin'

Near the top left of the screen you should see a 'New' button click that and name new new database 'school' and click create. After its created click on the new 'school' databse near the top left.

Click on the import tab at the top centre of the screen. In the 'File to import:' click on 'Browse file' and find and select the 'school.sql' file located in the IT-Major-Project folder.

Go to the bottom of the page and click 'Import'.

This will fill the new school database with 6 tables and a bunch of data.




Setting up password:
Click on the User Accounts tab at the top centre of the screen. If you can't find click Privileges around the top centre of the screen, and click Edit privileges for user: root and host: localhost. This will show the User accounts button at the top of the screen

Click 'edit privileges' for the User name: 'root' and Host name: 'localhost'

At the top of the screen click 'Change Password' and enter the Password: ubbYnnXe5h)tgHqF

Click 'Go' to save the password. This will likely kick you out and so we need to change the password in the config.

Edit the file 'config.inc.php' located: 'C:\xampp\phpMyAdmin\config.inc.php'

Line 21 should look like: $cfg['Servers'][$i]['password'] = '';

Change it to the new line to include the password: $cfg['Servers'][$i]['password'] = 'ubbYnnXe5h)tgHqF';

Now you can view the phpMyAdmin again.

In the db.php file located: 'C:\xampp\htdocs\db.php'. Make sure the password matches what you typed in and that the dbname matches the databases name.

To ensure the project is working and database is connecting open a web brower and put the link: 'localhost'

You should see the website appear asking for a System Admin Password.





System admin password:
The password is already set to '1234!', but if you want to change it you can go to 'http://localhost/phpmyadmin/index.php?route=/sql&db=school&table=settings&pos=0'
Which you need to put the hashed version of the password in.





Node.js installation (kiosks/Client Setup) for Electron:
Download Node.js: Go to Node.js official website and download the latest LTS version. https://nodejs.org/en

Install Node.js: Run the downloaded file and follow the installation instructions. After its installed you can check that its installed properly by typing node -v and npm -v.

Now you can skip this next step and follow the 'Electron Application (kiosks/Client Setup):' If it doesn't start properly then come back and complete this step. (Should already work without installing dependencies)
Install the needed dependencies (For the Electron App): Navigate to the Electron Application file directory 'IT-Major-Project\Electron Application' and open a command prompt and run: npm install





Electron Application (kiosks/Client Setup):
This is the client files which is the folder that would be put in all the kiosks.

The electron application runs separately from the main server and can be run across multiple computers, 
it can be run by going back to the extracted project file at the start and clicking the 'Start.bat' which will launch the application.

To make testing easier you can go into the main.js file and change line 15: to 'let testing = true;', this unlocks the screen and lets you close it without needing the close application button.





RFID Setup:
Plug in the RFID device and find out what COM port it is for that computer, which can be done with many softwares but i used Arduino IDE.

Once you have the COM port go back to the main.js file and update the port path on line 6, for example mine shows up in COM7 so i did: 'const portPath = 'COM7';'

You must have the RFID reader plugged in before you start the Electron Application. 





Extra:
Use the System admin password: '1234!'
All User and Admin login passwords are currently: '12345678'


If you want to update the admin password you have to open a web browser login to the admin account and then change the browser link to:
http://localhost/IT-Major-Project/reset_password.php?id=3&password=newpassword

But replace the 'newpassword' text with the actual new password.

If you are setting this up on multiple devices. Only setup the server side on one and then get the IPv4 of that computer (can use ipconfig in command promp).

The Electron Application can be setup on multiple devices but will need an extra change by going into the main.js and editing the 'main application URL' on line
57 change the localhost to the ip of the computer running the server: win.loadURL('http://localhost'); also might need to add the port to the end of the ip ':80'




Usage:
At the start of the day pc teachers would have to submit an attendance record with:
Student ID: That Students ID
Date: Current Date
Time: Current time
Status: Checked In
Reason:

This makes sure all student attendance is recorded properly at the start of the day, 
and if students don't make it to pc before the role is marked (9am) and attendance record submitted then they will be classified as late (No attendance record). 
To fix this, late students must go to the front office where the kiosks are located. When the student logs in the kiosk will check attendance history and know they are late asking them for a reason.





PHP Scripts:
Core Functionalities:
index.php: The main entry point for the application.
login.php and logout.php: Handling user authentication.
admin_dashboard.php: Manages the admin's dashboard.

Data Management:
db.php: Handles database connections.
save_data.php, delete.php, fetch_data.php, fetch_row.php: Performs CRUD operations.
attendance_submission.php: Submitting attendance data.
search_student.php: Searching for student (used to help find student in admin dashboard).

Session and Configuration:
session_config.php: Manages session configurations.
system_logout.php, verify_system_password.php: Additional authentication functions.

Specialized Features:
change_class_activity.php and change_student_activity.php: Enabling/Disabling a class or student.
fetch_timetable_data.php and fetch_common_period_data.php: Gets data and organises it for easy display and use later.
get_student_status.php: Retrieves a student's current status in the school.



Reference List:
St Mary MacKillop College Canberra Logo (n.d.) [digital art], St Mary MacKillop College, accessed 22 October 2024. https://www.mackillop.act.edu.au

School website CSS file [CSS file] (n.d.), St Mary MacKillop College, accessed 30 October 2024. https://www.mackillop.act.edu.au