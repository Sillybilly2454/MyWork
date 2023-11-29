// Initialize the socket for real-time communication
const socket = io();

// Get references to various HTML elements
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("createAccountButton");

const toLoginPage = document.getElementById("toLoginPage");
const toRegisterPage = document.getElementById("toRegisterPage");
const toAccountPage = document.getElementById("toAccountPage");


// User interface elements
const logoutButton = document.getElementById("logoutButton");
const deleteAccountButton = document.getElementById("deleteAccountButton");
const myWishListsButton = document.getElementById("myWishListsButton");
const sharedWishListsButton = document.getElementById("sharedWishListsButton");
const newWishListButton = document.getElementById("newWishListButton");
const wishListsDiv = document.getElementById("wishListsDiv");
const currentWishListName = document.getElementById("currentWishListName");
const currentWishListItemsDiv = document.getElementById("currentWishListItemsDiv");
const currentWishListDiv = document.getElementById("currentWishListDiv");
const shareError = document.getElementById("shareError");
const deleteCurrentWishListButton = document.getElementById("deleteCurrentWishListButton");
const shareWishListButton = document.getElementById("shareWishListButton");
const changeCurrentWishListNameButton = document.getElementById("changeCurrentWishListNameButton");

// Share wish list popup elements
const sharePopup = document.getElementById("sharePopup");
const closeSharePopup = document.getElementById("closeSharePopup");
const shareWishListSubmit = document.getElementById("shareSubmit");
const popupSharedWith = document.getElementById("popupSharedWith");

// Change wish list name popup elements
const changeWishlistNamePopup = document.getElementById("changeWishlistNamePopup");
const closeChangeWishlistNamePopup = document.getElementById("closeChangeWishlistNamePopup");
const changeWishlistNameSubmit = document.getElementById("changeWishlistNameSubmit");
const wishListNameInput = document.getElementById("wishListNameInput");

// Add item to wish list popup elements
const addItemToCurrentWishListButton = document.getElementById("addItemToCurrentWishListButton");
const addItemPopup = document.getElementById("addItemPopup");
const closeAddItemPopup = document.getElementById("closeAddItemPopup");
const updateItemButton = document.getElementById("updateItemButton");
const addItemButton = document.getElementById("addItemButton");
const nameInput = document.getElementById("nameInput");
const urlInput = document.getElementById("urlInput");
const imageInput = document.getElementById("imageInput");
const priceInput = document.getElementById("priceInput");
const oldItemImage = document.getElementById("oldItemImage");
const itemPopupTitle = document.getElementById("itemPopupTitle");

// Variables to store the current wish list and item editing information
let currentWishListId = -1;
let currentWishListType = -1;
let itemEditingInfo;


// Check the current page's URL path
if (window.location.pathname == '/loginpage.html') {
   // If on the login page, add an event listener to the login button
   loginButton.addEventListener("click", attemptLogin);
} else if (window.location.pathname == '/registerpage.html') {
   // If on the registration page, add an event listener to the register button
   registerButton.addEventListener("click", attemptRegister);
} else if (window.location.pathname == '/policiespage.html') {
   toAccountPage.style.display = "none";
} else if (window.location.pathname == '/index.html' || window.location.pathname == '/') {
   // If on the main index page:

   // Add event listeners for various buttons and actions
   logoutButton.addEventListener("click", logout);
   deleteAccountButton.addEventListener("click", deleteAccount);
   myWishListsButton.addEventListener("click", myWishLists);
   sharedWishListsButton.addEventListener("click", sharedWishLists);
   
   // Create a new wish list on button click
   newWishListButton.addEventListener("click", function() {
      socket.emit("createWishList");
   });

   // Delete the current wish list on button click
   deleteCurrentWishListButton.addEventListener("click", function() {
      socket.emit("deleteWishList", currentWishListId);
   });

   // Show the share wish list popup and update its content
   shareWishListButton.addEventListener("click", () => {
      sharePopup.style.display = "block";
      shareError.textContent = "";
      updateShareWishList();
   });
   
   // Close the share wish list popup
   closeSharePopup.addEventListener("click", () => {
      sharePopup.style.display = "none";
   });

   // Show the change name wish list popup
   changeCurrentWishListNameButton.addEventListener("click", () => {
      changeWishlistNamePopup.style.display = "block";
   });
   
   // Close the change name wish list popup
   closeChangeWishlistNamePopup.addEventListener("click", () => {
      changeWishlistNamePopup.style.display = "none";
   });

   // Changes the name of the current wishlist
   changeWishlistNameSubmit.addEventListener("click", () => {
      changeWishlistNamePopup.style.display = "none";

      // Prepare data
      let data = {
         newName: wishListNameInput.value,
         wishlistId: currentWishListId
      };

      // Emit the update request to the server
      socket.emit("changeWishListName", data);
   });

   // Trigger sharing a wish list on button click
   shareWishListSubmit.addEventListener("click", shareWishList);

   // Function to load and display the user's wish lists
   function myWishLists() {
      updateWishListsDiv(0);
   }
   
   // Function to load and display shared wish lists
   function sharedWishLists() {
      updateWishListsDiv(1);
   }

   // Open the "Add Item" popup and set its initial state
   addItemToCurrentWishListButton.addEventListener("click", function() {
      addItemPopup.style.display = "block";
      itemPopupTitle.textContent = "Add Item";
      addItemButton.style.display = "block";
      updateItemButton.style.display = "none";
   });

   // Add a custom item to the wish list on button click
   addItemButton.addEventListener('click', function() {
      addCustomItem();
   });

   // Close the "Add Item" popup
   closeAddItemPopup.addEventListener("click", () => {
      addItemPopup.style.display = "none";
      resetCustomItemInput();
   });

   // Update an item in the wish list
   updateItemButton.addEventListener('click', function() {
      // Check if an item is being edited
      if (itemEditingInfo == null) {
         return; // No item is being edited, exit the function
      }

      // Prepare item updates
      let itemUpdates = {
         info: itemEditingInfo,
         name: nameInput.value,
         webpageurl: urlInput.value,
         price: priceInput.value,
         image: null
      }

      // Reset the itemEditingInfo as it's no longer needed
      itemEditingInfo = null;

      // Check if an image file is attached
      const file = imageInput.files[0];
      if (file) {
         // If an image is attached, read it as a data URL and set it in itemUpdates
         const reader = new FileReader();
         reader.onload = (event) => {
            itemUpdates.image = event.target.result; 
            // Emit the update request to the server
            socket.emit("updateItemInWishList", itemUpdates);
            // Hide the "Add Item" popup and reset input fields
            addItemPopup.style.display = "none";
            resetCustomItemInput();
         };
         reader.readAsDataURL(file);
      } else { 
         // If no image is attached, emit the update request with the existing data
         socket.emit("updateItemInWishList", itemUpdates);
         // Hide the "Add Item" popup and reset input fields
         addItemPopup.style.display = "none";
         resetCustomItemInput();
      }
   });

   // Reset custom item input fields
   resetCustomItemInput();
}


// Get reference to input fields for username and password
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Get references to all elements with the "accountUsername" class
const accountUsernameTexts = document.getElementsByClassName("accountUsername");

// Automatically attempt login from cookies when the page loads
loginFromCookie();

// Function to attempt login using stored cookies
function loginFromCookie() {
   // Read login details from cookies and attempt login
   const cookieData = document.cookie.split('; ').find(cookie => cookie.startsWith('loginDetails='));
   if (cookieData) {
      // Extract user data from the cookie
      const userData = JSON.parse(decodeURIComponent(cookieData.split('=')[1]));

      // Send a login attempt request to the server using the user data from the cookie
      socket.emit("loginAttempt", userData);
   } else {
      // If user is not logged in and trying to access their data, redirect to the login page
      if (window.location.pathname == '/index.html' || window.location.pathname == '/') {
         window.location.replace("loginpage.html");
      }
   }
}


// Function to handle login attempt
function attemptLogin() {
   // Prepare user data object with username and password
   const userdata = {
      username: usernameInput.value.toLowerCase().replace(/[^a-zA-Z]/g, ''), // Sanitize the username
      password: passwordInput.value
   }

   // Clear the password input field for security
   passwordInput.value = "";

   // Send a login attempt request to the server with the user data
   socket.emit("loginAttempt", userdata);
}


/**
 * Event handler for a login failure due to incorrect password or account not existing
 */
socket.on("loginFail", (username, cause) => {
   // Clear login details from cookies to enhance security
   document.cookie = `${"loginDetails"}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

   if (cause == "UserDosentExist") {
      // Alert the user that the account doesn't exist
      alert("Account: " + username + " Doesn't Exist");
   } else if (cause == "WrongPassword") {
      // Alert the user that the password is incorrect
      alert("Incorrect password for " + username);
   }

   // If they are not logged in and trying to access their data, redirect to the login page
   if (window.location.pathname == '/index.html' || window.location.pathname == '/') {
      window.location.replace("loginpage.html");
   }
});


/**
 * Event handler for a successful login attempt
 */
socket.on("loginSuccess", (data) => {
   console.log("Logged in");
   
   // Set a flag in the socket to indicate that the user is logged in
   socket.loggedIn = true;
   
   // Store the username in the socket
   socket.username = data.username;

   // Serialize the user data as a string and store it as a cookie with an expiration date
   const userDataString = JSON.stringify(data);

   // Get the current date
   const currentDate = new Date();

   // Calculate the expiration date 1 week from the current time
   const expirationDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

   // Convert the expiration date to a string in the desired format
   const expirationDateString = expirationDate.toUTCString();

   // Set the cookie with the calculated expiration date
   document.cookie = `loginDetails=${encodeURIComponent(userDataString)}; expires=${expirationDateString}; path=/`;


   // Update the account username display in the UI
   for (let i = 0; i < accountUsernameTexts.length; i++) {
      accountUsernameTexts[i].innerText = socket.username;
   }

   // If not already on the index page, redirect to it; otherwise, load the user's wish lists
   if (window.location.pathname != '/index.html' && window.location.pathname != '/') {
      if(window.location.pathname == '/policiespage.html') {
         toAccountPage.style.display = "inline-block";
         toLoginPage.style.display = "none";
         toRegisterPage.style.display = "none";
      } else {
         window.location.replace("index.html");
      }
   } else {
      myWishLists();
   }
});


/**
 * Function to handle a registration attempt
 */
function attemptRegister() {
   // Get user data from the input fields
   let userdata = {
      username: usernameInput.value.toLowerCase().replace(/[^a-zA-Z]/g, ''), // Sanitize the username
      password: passwordInput.value
   }

   // Clear the password and username input fields for security
   passwordInput.value = "";
   usernameInput.value = "";

   // Send a registration attempt request to the server
   socket.emit("registerAttempt", userdata);
}


/**
 * Event handler for a failed registration attempt
 */
socket.on("registerFail", (cause) => {
   // Display an alert message with the specific cause of the registration failure
   alert(cause);
});

/**
 * Event handler for a successful registration
 */
socket.on("registerSuccess", (data) => {
   // Display an alert message indicating that the account has been created
   alert("Account created");
   
   // Automatically attempt a login with the newly registered account
   socket.emit("loginAttempt", data);
});


/**
 * Function to handle user logout
 */
function logout() {
   // Notify the server about the user's logout
   socket.emit("userLogout");

   // Clear the login details from cookies to enhance security
   document.cookie = `${"loginDetails"}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

   // Redirect the user to the login page
   window.location.replace("loginpage.html");

   // Display an alert message to indicate that the user has been logged out
   alert("Logged Out");
}

/**
 * Function to handle account deletion
 */
function deleteAccount() {
   // Prepare user data with the username (from the socket) and password from the input field
   let userdata = {
      username: socket.username,
      password: passwordInput.value
   }

   // Clear the password input field for security
   passwordInput.value = "";

   // Send a request to the server to delete the account
   socket.emit("deleteAccount", userdata);
}

/**
 * Event handler for a successful account deletion
 */
socket.on("accountDeleted", (data) => {
   // Display an alert message to indicate that the account has been successfully deleted
   alert("Account Deleted");

   // Perform a logout (clears cookies and redirects to the login page)
   logout();
});

/**
 * Event handler for a failed account deletion due to incorrect password
 */
socket.on("accountDeleteFail", () => {
   // Display an alert message indicating that the deletion has failed due to an incorrect password
   alert("Incorrect Password");
});


/**
 * Event handler for a socket disconnect
 */
socket.on("disconnect", () => {
   if(window.location.pathname == '/policiespage.html') {
      toAccountPage.style.display = "none";
      toLoginPage.style.display = "inline-block";
      toRegisterPage.style.display = "inline-block";
   } else {
      // Redirect the user to the login page upon socket disconnection
      window.location.replace("loginpage.html");
   }

   // Reconnect the socket to maintain real-time communication
   socket.connect();
});


/**
 * Create and display a new wish list in the UI
 */
function createWishList(data) {
   // Create a button element for the wish list
   const wishlistButton = document.createElement('button');
   wishlistButton.className = 'wishlist';

   // Create a title element and set its text content to the wish list name
   const wishlistTitle = document.createElement('h2');
   wishlistTitle.textContent = data.name;

   // Create an owner element and set its text content to the wish list owner's username
   const wishlistOwner = document.createElement('h4');
   wishlistOwner.textContent = "Owner: " + data.ownerUsername;

   // Append the title and owner elements to the wishlist button
   wishlistButton.appendChild(wishlistTitle);
   wishlistButton.appendChild(wishlistOwner);

   // Add a click event listener to the wishlist button to update the current wish list
   wishlistButton.addEventListener("click", function() {
      // Set the currentWishListId to the ID of the selected wish list
      currentWishListId = data.id;
      // Update the displayed current wish list
      updateCurrentWishList();
   });

   // Append the wishlist button to the wishListsDiv in the UI
   wishListsDiv.appendChild(wishlistButton);

   // Update the displayed current wish list
   updateCurrentWishList();
}


/**
 * Event handler for a newly created wish list
 */
socket.on("createdWishList", (data) => {
   // Call the createWishList function to handle the newly created wish list
   createWishList(data);

   // Update the currentWishListId with the ID of the newly created wish list
   currentWishListId = data.id;
});



/**
 * Attempt to share the current wish list with another user
 */
function shareWishList() {
   // Prepare data to send to the server for sharing the wish list
   var data = {
      ownerUsername: socket.username,        // The owner's username
      usernameToShareTo: usernameInput.value, // The username to share the wish list with
      wishlistId: currentWishListId           // The ID of the current wish list to share
   }

   // Clear the username input field
   usernameInput.value = "";

   // Display message in the UI
   shareError.textContent = "Sharing...";

   // Send a request to the server to share the wish list
   socket.emit("shareWishList", data);
}



/**
 * Function to update the shared user list in the share wish list popup
 */
function updateShareWishList() {
   // Clear the list of shared users in the UI
   var children = popupSharedWith.children;
   for (var i = children.length - 1; i >= 0; i--) {
      // Remove all children except the "sharedWithTitle" element
      if (children[i] != document.getElementById("sharedWithTitle")) {
         popupSharedWith.removeChild(children[i]);
      }
   }

   // Request the list of users with whom the wish list is shared from the server
   socket.emit("getWishListSharedWith", currentWishListId);
}

/**
 * Event handler for messages related to sharing a wish list
 */
socket.on("shareWishListMessage", (message) => {
   if (message == "Successfully Shared") {
      // If the sharing was successful, update the list of shared users
      updateShareWishList();
   }
   
   // Display the share message in the UI, whether it's successful or an error
   shareError.textContent = message;
});


/**
 * Function to update the displayed wish lists in the UI based on the type (My WishLists or Shared WishLists)
 */
function updateWishListsDiv(type) {
   // Set the currentWishListType to the specified type (0 or 1) if a type was provided
   if(type != null) {
      currentWishListType = type;
   }

   // Reset the background styles for My WishLists and Shared WishLists buttons
   myWishListsButton.style.background = "none";
   sharedWishListsButton.style.background = "none";

   // Clear the list of wish lists in the UI
   var children = wishListsDiv.children;
   for (var i = children.length - 1; i >= 0; i--) {
      // Remove all children except the "New Wish List" and "Add Item" buttons
      if (children[i] != newWishListButton && children[i] != addItemToCurrentWishListButton) {
         wishListsDiv.removeChild(children[i]);
      }
   }

   if (currentWishListType == 1) {
      // Display Shared WishLists
      sharedWishListsButton.style.background = "#555";
      newWishListButton.style.display = "none";

      // Load the wish lists that the user has been shared
      socket.emit("getWishListsShared");
   } else {
      // Display My WishLists
      myWishListsButton.style.background = "#555";
      newWishListButton.style.display = "block";

      // Load the wish lists that the user owns
      socket.emit("getWishListsOwned");
   }

   // Hide the current wish list display
   currentWishListDiv.style.visibility = "hidden";

   // Reset the currentWishListId to -1 and update the displayed current wish list
   currentWishListId = -1;
   updateCurrentWishList();
}


/**
 * Event handler for retrieved wish lists from the server
 */
socket.on("retrievedWishLists", (wishlists) => {
   // Iterate through the retrieved wish lists and create UI elements for each
   for (let i = 0; i < wishlists.length; i++) {
      createWishList(wishlists[i]);
   }

   // Update the displayed current wish list
   updateCurrentWishList();
});

/**
 * Function to update the current wish list display
 */
function updateCurrentWishList() {
   // Hide the current wish list display
   currentWishListDiv.style.visibility = "hidden";

   // Check if there is a valid currentWishListId, and if so, request the wish list from the server
   if (currentWishListId != -1) {
      socket.emit("requestWishList", currentWishListId);
   }
}


/**
 * Function to reset the input fields and styling for adding or updating a custom item
 */
function resetCustomItemInput() {
   // Clear the values of input fields
   nameInput.value = "";
   priceInput.value = "";
   imageInput.value = "";
   urlInput.value = "";

   // Hide the old item image
   oldItemImage.style.display = "none";

   // Reset any custom styling applied to the input fields (e.g., border)
   nameInput.style.border = "";
   priceInput.style.border = "";
}


/**
 * Function to add a custom item to the current wish list
 */
function addCustomItem() {
   var missingValues = false;

   // Check if the name input field is empty and apply a red border if it is
   if (!nameInput.value) {
      nameInput.style.border = "2px solid red";
      missingValues = true;
   }

   // Check if the price input field is empty and apply a red border if it is
   if (!priceInput.value) {
      priceInput.style.border = "2px solid red";
      missingValues = true;
   }

   // If any required values are missing, exit the function
   if (missingValues) {
      return;
   }

   // Prepare item information with the current wishlist ID and user input
   var info = {
      wishlistId: currentWishListId,
      name: nameInput.value,
      webpageurl: urlInput.value,
      price: priceInput.value,
      image: null
   }

   // Check if an image file is attached if it is send the item information to the server
   const file = imageInput.files[0];
   if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
         // Set the item's image to the loaded image data
         info.image = event.target.result;
         // Emit a request to add the item to the wish list to the server
         socket.emit("addItemToWishList", info);
      };
      reader.readAsDataURL(file);
   } else {
      // If no image file is attached, emit a request to add the item to the wish list without an image
      socket.emit("addItemToWishList", info);
   }

   // Close the add item popup and reset input fields and styling
   addItemPopup.style.display = "none";
   resetCustomItemInput();
}


/**
 * Event handler for retrieved wish list data from the server
 */
socket.on("retrievedWishList", (wishlistData) => {
   // Make the current wish list display visible
   currentWishListDiv.style.visibility = "visible";

   // Set the name of the current wish list
   currentWishListName.textContent = wishlistData.name;
   wishListNameInput.value = wishlistData.name;

   // Check if the current user owns the wish list and adjust button visibility accordingly
   if (wishlistData.ownerUsername == socket.username) {
      deleteCurrentWishListButton.style.display = "block";
      shareWishListButton.style.display = "block";
      addItemToCurrentWishListButton.style.display = "block";
      changeCurrentWishListNameButton.style.display = "block";
   } else {
      deleteCurrentWishListButton.style.display = "none";
      shareWishListButton.style.display = "none";
      addItemToCurrentWishListButton.style.display = "none";
      changeCurrentWishListNameButton.style.display = "none";
   }

   // Clear the list of items in the current wish list
   var children = currentWishListItemsDiv.children;
   Array.from(children).forEach(function (item) {
      currentWishListItemsDiv.removeChild(item);
   });

   // Check if the wish list contains items and display them if available
   if (wishlistData.items) {
      var items = JSON.parse(wishlistData.items);

      // Iterate through the items and create UI elements for each
      Array.from(items).forEach(function (item) {
         // Create a new 'div' element with class 'item'
         var itemDiv = document.createElement('div');
         itemDiv.className = 'item';

         // Create an 'h1' element for the item name
         var h1 = document.createElement('h1');

         // Create an 'a' element for the item name and link if available
         var a = document.createElement('a');
         a.textContent = item.name;
         if (item.webpageurl) {
            a.href = item.webpageurl;
            a.target = "_blank";
         }

         // Append the 'a' element as a child of the 'h1' element
         h1.appendChild(a);

         // Create an 'h3' element for the item price
         var h3 = document.createElement('h3');
         h3.textContent = '$' + item.price;

         // Create an 'img' element for the item image if available
         if (item.imageurl) {
            var img = document.createElement('img');
            img.src = item.imageurl;

            itemDiv.appendChild(img);
         }

         // Append the elements to the 'itemDiv'
         itemDiv.appendChild(h1);
         itemDiv.appendChild(h3);

         // Create a 'button' element for removing an item
         const button = document.createElement('button');

         // Prepare information for the item to be removed or edited
         const info = {
            wishlistId: wishlistData.id,
            idInWishList: item.idInWishList
         }

         // Check if the current user is the owner to display remove and edit options
         if (wishlistData.ownerUsername == socket.username) {
            button.textContent = 'Remove';

            button.addEventListener('click', function () {
               // Emit a request to remove the item from the wish list to the server
               socket.emit("removeItemFromWishList", info);
            });

            // Create a 'button' element for editing an item
            const editItemButton = document.createElement('button');
            editItemButton.textContent = "Edit"

            editItemButton.addEventListener('click', function () {
               // Fill the input fields with item information for editing
               nameInput.value = item.name;
               urlInput.value = item.webpageurl;
               priceInput.value = item.price;

               // Display the item's image if available
               if (item.imageurl) {
                  oldItemImage.style.display = "block";
                  oldItemImage.src = item.imageurl;
               }

               // Set the item popup title for editing
               itemPopupTitle.textContent = "Edit Item";

               // Display the add item popup with the update item button
               addItemPopup.style.display = "block";
               addItemButton.style.display = "none";
               updateItemButton.style.display = "block";

               // Set itemEditingInfo with the item information for reference
               itemEditingInfo = info;
            });

            // Append the elements to the 'itemDiv'
            itemDiv.appendChild(editItemButton);
            itemDiv.appendChild(button);
         }

         // Append the itemDiv to the currentWishListItemsDiv
         currentWishListItemsDiv.appendChild(itemDiv);
      });
   }
});



/**
 * Event handler for retrieved shared users of a wish list from the server
 */
socket.on("retrievedWishListSharedWith", (sharedWith) => {
   for (let i = 0; i < sharedWith.length; i++) {
      // Skip empty usernames (if any)
      if (sharedWith[i] == '') {
         continue;
      }

      // Create a UI element to display the shared user
      const userDiv = document.createElement('div');
      userDiv.className = 'user';

      // Create a paragraph element to display the shared user's username
      const userName = document.createElement('p');
      userName.textContent = sharedWith[i];

      // Create a button element for removing the shared user
      const userButton = document.createElement('button');
      userButton.textContent = "Remove";

      // Append the elements to the userDiv
      userDiv.appendChild(userName);
      userDiv.appendChild(userButton);

      // Add a click event listener to the userButton for removing the shared user
      userButton.addEventListener("click", function () {
         // Prepare data for unsharing the wish list with the selected user
         data = {
            wishlistId: currentWishListId,
            unsharedUsername: sharedWith[i]
         }

         // Emit a request to unshare the wish list with the selected user to the server
         socket.emit("unshareWishList", data);
      });

      // Append the userDiv to the popupSharedWith
      popupSharedWith.appendChild(userDiv);
   }
});


/**
 * Event handler for unsharing a wish list with a user
 */
socket.on("unsharedWishList", () => {
   updateShareWishList();
});


/**
 * Event handler for a change in the wish list
 */
socket.on("changedWishList", () => {
   updateCurrentWishList();
});

/**
 * Event handler to refresh the list of wish lists
 */
socket.on("refreshWishLists", () => {
   updateWishListsDiv();
});


/**
 * Event handler to update the current wishlist and the wishlists div
 */
socket.on("refresh", () => {
   // Saves the currentWishList Id as it will be reset in the next function
   var wishListId = currentWishListId;

   // Refresh the list of wish lists
   updateWishListsDiv();

   // Update the current wishlist with the old id
   currentWishListId = wishListId;
   updateCurrentWishList();
});