// setup the web server
const express = require('express');
const webServer = express();
const port = 80;

webServer.use(express.static('public'));

// setup sockets
const http = require('http');
const httpServer = http.createServer(webServer);
const { Server } = require("socket.io");
const io = new Server(httpServer);

// setup file system
const fs = require('fs');

// setup hashing tools
const crypto = require('crypto');

// setup database
const sqlite3 = require('sqlite3');

// opens the database file, creating it if required
let db = new sqlite3.Database('data.sqlite', (err) => {
   if (err) {
     console.error(err.message);
   }

   // Makes sure that all the tables exist if they don't create new ones
   db.run("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, dateCreated DATETIME DEFAULT (DATETIME('now', 'localtime')))");
   db.run("CREATE TABLE IF NOT EXISTS wishLists (id INTEGER PRIMARY KEY NOT NULL, name TEXT, ownerUsername TEXT NOT NULL, sharedUsernames TEXT, items TEXT, dateCreated DATETIME DEFAULT (DATETIME('now', 'localtime')))");


   console.log('Connected to the database.');
});

// user login related queries
const userExists = "SELECT 1 FROM users WHERE username = ?";
const loginUser = "SELECT username FROM users WHERE username = ? AND password = ?";
const newUser = "INSERT INTO users(username,password) VALUES(?,?)"
const removeUser = "DELETE FROM users WHERE username = ?"





// start http server
httpServer.listen(port, () => {
   console.log("Web Server listening on port " + port);
});

// on a socket connection
io.on('connection', (socket) => {
   console.log('a user connected');
   // Custom properties to track user's login status and username
   socket.loggedIn = false;
   socket.username = "";

   // Manage communication

   // Logout event
   socket.on("userLogout", () => {
      // Disconnect the socket and log the user's logout
      socket.disconnect(true);
      console.log("user logout " + socket.username);
   });

   // Register attempt event
   socket.on("registerAttempt", (data) => {
      // Hashing the password to secure it
      let hash = crypto.createHash('sha256').update(data.password).digest('hex');

      // Check if the user already exists in the database
      db.get(userExists, [data.username], (error, row) => {
         // Handle SQLite errors
         if (error) {
            console.log(error.message);
         } else if (row) {
            // User already exists, send a registration failure message
            socket.emit("registerFail", "User Already Exists");
         } else {
            // If the user doesn't exist, insert their data into the database
            db.serialize(() => {
               // Add the user to the users table with their username and hashed password
               db.run(newUser, [data.username, hash], (error) => {
                  console.log("user created for " + data.username);
                  socket.loggedIn = true;
                  socket.username = data.username;
                  // Send a registration success message with the username and password
                  socket.emit("registerSuccess", { username: data.username, password: data.password });
               });
            });
         }
      });
   });

   // Login attempt event
   socket.on("loginAttempt", (data) => {
      // Hashing the password for comparison
      let hash = crypto.createHash('sha256').update(data.password).digest('hex');

      // Check if the user exists in the database
      db.get(userExists, [data.username], (error, row) => {
         // Handle SQLite errors
         if (error) {
            console.log(error.message);
         } else if (row) {
            // User exists in the database
            console.log("user exists: " + data.username);
            // Check if the provided password matches the stored password hash
            db.get(loginUser, [data.username, hash], (error, userRow) => {
               if (error) {
                  console.log(error.message);
               } else if (userRow) {
                  // Password is correct, update the user's login status and username
                  console.log("login success for " + data.username);
                  socket.username = data.username;
                  socket.loggedIn = true;
                  // Send a login success message with user data
                  socket.emit("loginSuccess", data);
               } else {
                  // Password is incorrect, send a login failure message
                  console.log("login fail for " + data.username);
                  socket.emit("loginFail", data.username, "WrongPassword");
               }
            });
         } else {
            // User does not exist, send a login failure message
            socket.emit("loginFail", data.username, "UserDoesntExist");
         }
      });
   });

   // Delete account event
   socket.on("deleteAccount", (data) => {
      // Hash the provided password for verification
      let hash = crypto.createHash('sha256').update(data.password).digest('hex');
   
      // Check if the user exists in the database
      db.get(userExists, [data.username], (error, row) => {
         // Handle SQLite errors
         if (error) {
            console.log(error.message);
         } else if (row) {
            // User exists in the database
   
            // Check if the provided password matches the stored password hash
            db.get(loginUser, [data.username, hash], (error, userRow) => {
               if (error) {
                  console.log(error.message);
               } else if (userRow) {
                  // Password is correct
   
                  // Delete the user's account from the database
                  db.run(removeUser, [data.username], (error) => {
                     if (error) {
                        console.log(error.message);
                     } else {
                        console.log(`Table ${data.username}'s data has been deleted.`);
                     }
                  });
   
                  // Delete all wishlists owned by the user
                  getAllWishListsOwned(socket.username, function(ownedWishlists) {
                     for (let i = 0; i < ownedWishlists.length; i++) {
                        deleteWishList(ownedWishlists[i].id, socket);
                     }
                  });
   
                  // Update and remove the user from shared wishlists
                  getAllWishListsShared(socket.username, function(sharedWishlists) {
                     sharedWishlists.forEach(function (sharedWishlist) {
                        const id = sharedWishlist.id;

                        // Gets the usernames that the wishlist are shared to
                        const sharedUsernames = sharedWishlist.sharedUsernames.split(',').map(username => username.trim());
   
                        // Remove the username from the sharedUsernames array
                        const updatedSharedUsernames = sharedUsernames.filter(username => username != socket.username).join(', ');
   
                        // Update the wishlist with the new sharedUsernames
                        db.run("UPDATE wishLists SET sharedUsernames = ? WHERE id = ?", [updatedSharedUsernames, id], function(err) {
                           if (err) {
                              console.error(err.message);
                           }
                        });
                     });
                  });
   
                  // Send a message that the account has been deleted
                  socket.emit("accountDeleted");
               } else {
                  // Incorrect password, account cannot be deleted
                  console.log("Incorrect details so cannot delete account: " + data.username);

                  // Failed to delete account, send a failure message
                  socket.emit("accountDeleteFail");
               }
            });
         }
      });
   });
   

   // Create a wishlist event
   socket.on("createWishList", () => {
      // Insert a new wishlist record into the database with default values
      db.run("INSERT INTO wishLists (name, ownerUsername, sharedUsernames, items) VALUES (?, ?, ?, ?)", ["New WishList", socket.username, "", ""], function(err) {
         if (err) {
            // Handle any errors that occur during the database insertion
            console.error(err.message);
         } else {
            // Log a success message with the new record's ID
            console.log(`A new record with ID ${this.lastID} has been inserted.`);
   
            // Prepare data to send to the client
            var data = {
               name: "New WishList",
               ownerUsername: socket.username,
               id: this.lastID
            }
   
            // Emit a "createdWishList" event to inform the client about the new wishlist
            socket.emit("createdWishList", data);
         }
      });
   });
   

   // Share the wishlist to someone event
   socket.on("shareWishList", (data) => {
      // Check if the owner is trying to share with themselves
      if (data.ownerUsername == data.usernameToShareTo) {
         // Emit a message to inform the user that self-sharing is not allowed
         socket.emit("shareWishListMessage", "Can't share with yourself");
         return; // Exit the function
      }

      // Get the owner and shared usernames for the wishlist
      db.get("SELECT ownerUsername, sharedUsernames FROM wishLists WHERE id = ?", [data.wishlistId], function(err, row) {
         if (err) {
            // Emit an error message if there's a database error
            socket.emit("shareWishListMessage", "Error");
            console.error(err.message);
         } else {
            if (row) {
               const ownerUsername = row.ownerUsername;

               // Check if the requester's username matches the owner's username
               if (data.ownerUsername == ownerUsername) {

                  // Check if the user to share with exists
                  db.get(userExists, [data.usernameToShareTo], (error, row1) => {
                     // Handle SQLite error
                     if (error) {
                        // Emit an error message for the database error
                        socket.emit("shareWishListMessage", "Error");
                        console.log(error.message);
                     } else if (row1) {
                        var usernames = [];
                        if (row.sharedUsernames != undefined) {
                           // Split the shared usernames into an array
                           usernames = row.sharedUsernames.split(',');
                        }

                        // Check if the user is not already a shared user
                        if (!usernames.includes(data.usernameToShareTo)) {
                              // Add the new username to the list of shared users
                              usernames.push(data.usernameToShareTo);
                              const newUsernames = usernames.join(',');

                              // Update the wishlist with the new sharedUsernames in the database
                              db.run("UPDATE wishLists SET sharedUsernames = ? WHERE id = ?", [newUsernames, data.wishlistId], function(err) {
                                 if (err) {
                                    // Emit an error message if there's a database error during the update
                                    socket.emit("shareWishListMessage", "Error");
                                    console.error(err.message);
                                 } else {
                                    // Emit a success message and log the action
                                    socket.emit("shareWishListMessage", "Successfully Shared");
                                    console.log(`${data.usernameToShareTo} has been added to the shared users of wishlist ${data.wishlistId}.`);
                                 }
                              });
                        } else {
                           // Emit a message if the user is already a shared user
                           socket.emit("shareWishListMessage", `${data.usernameToShareTo} is already a shared user`);
                           console.log(`${data.usernameToShareTo} is already a shared user of wishlist ${data.wishlistId}.`);
                        }
                     } else {
                        // Emit a message if the user to share with doesn't exist
                        socket.emit("shareWishListMessage", `${data.usernameToShareTo} does not exist`);
                        console.log(`${data.usernameToShareTo} does not exist. Can't share with.`);
                     }
                  });

               } else {
                  // Emit a message if the requester is not the owner of the wishlist
                  socket.emit("shareWishListMessage", "You cannot share this");
                  console.log("Unauthorized: Requester does not match the wishlist owner.");
               }
            } else {
               // Emit an error message if the wishlist is not found
               socket.emit("shareWishListMessage", "Error");
               console.log(`No wishlist found with ID ${wishlistId}.`);
            }
         }
      });
   });

  
   

   // Unshare the wishlist from someone event
   socket.on("unshareWishList", (data) => {
      // Get the owner and shared usernames for the wishlist
      db.get("SELECT ownerUsername, sharedUsernames FROM wishLists WHERE id = ?", [data.wishlistId], function(err, row) {
         if (err) {
            // Log an error message if there's a database error
            console.error(err.message);
         } else {
            if (row) {
               const ownerUsername = row.ownerUsername;

               // Check if the requester's username matches the owner's username
               if (socket.username == ownerUsername) {

                  var usernames = [];
                  if (row.sharedUsernames != undefined) {
                     // Split the shared usernames into an array
                     usernames = row.sharedUsernames.split(',');

                     // Find the index of the username to remove
                     var indexToRemove = usernames.indexOf(data.unsharedUsername);

                     if (indexToRemove != -1) {

                        // Remove the username at the found index
                        usernames.splice(indexToRemove, 1);

                        const newUsernames = usernames.join(',');

                        // Update the wishlist with the new sharedUsernames in the database
                        db.run("UPDATE wishLists SET sharedUsernames = ? WHERE id = ?", [newUsernames, data.wishlistId], function(err) {
                           if (err) {
                              // Log an error message if there's a database error during the update
                              console.error(err.message);
                           } else {
                              // Emit an "unsharedWishList" event and log the action
                              socket.emit("unsharedWishList");
                              console.log("Unshared wishlist from:" + data.unsharedUsername);
                           }
                        });

                     }
                  }

               } else {
                  // Log a message if the requester is not the owner of the wishlist
                  console.log("Unauthorized: Requester does not match the wishlist owner.");
               }
            } else {
               // Log a message if the wishlist is not found
               console.log(`No wishlist found with ID ${data.wishlistId}.`);
            }
         }
      });
   });


   // Gets all the people shared in the wishlist and sends them to the client
   socket.on("getWishListSharedWith", (wishListId) => {
      // Check if the user has the required permissions to retrieve shared users
      getWishListPermsNeeded(wishListId, socket.username, function(hasPermissions, row) {
         if (hasPermissions) {
            // Split the shared usernames and emit them to the client
            const sharedUsernames = row.sharedUsernames.split(",");
            socket.emit("retrievedWishListSharedWith", sharedUsernames);
         } else {
            console.log(`${socket.username} does not have permissions for wishlist ${wishListId}.`);
         }
      });
   });


   // Request and retrieve a specific wishlist
   socket.on("requestWishList", (wishlistId) => {
      // Check if the user has the required permissions to retrieve the wishlist
      getWishListPermsNeeded(wishlistId, socket.username, function(hasPermissions, row) {
         if (hasPermissions) {
            // Emit the retrieved wishlist data to the client
            socket.emit("retrievedWishList", row);
         } else {
            console.log(`${socket.username} does not have permissions for wishlist ${wishlistId}.`);
         }
      });
   });

   // Delete a wishlist
   socket.on("deleteWishList", (wishlistId) => {
      // Call the function to delete the specified wishlist
      deleteWishList(wishlistId, socket);
   });

   // Retrieve wishlists owned by the user
   socket.on("getWishListsOwned", () => {
      // Get and emit wishlists owned by the user
      getAllWishListsOwned(socket.username, function(wishlists) {
         // Emit the retrieved wishlist data to the client
         socket.emit("retrievedWishLists", wishlists);
      });
   });

   // Retrieve wishlists shared with the user
   socket.on("getWishListsShared", () => {
      // Get and emit wishlists shared with the user
      getAllWishListsShared(socket.username, function(wishlists) {
         // Emit the retrieved wishlist data to the client
         socket.emit("retrievedWishLists", wishlists);
      });
   });


   // Add an item to a wishlist
   socket.on("addItemToWishList", (data) => {
      // Get the owner and items of the wishlist
      db.get("SELECT ownerUsername, items FROM wishLists WHERE id = ?", [data.wishlistId], function(err, row) {
         if (err) {
            // Handle any database errors
            console.error(err.message);
         } else if (row) {
            const ownerUsername = row.ownerUsername;

            // Check if the requester's username matches the owner's username
            if (socket.username == ownerUsername) {
               // User is authorized to add an item to the wishlist

               var items = [];

               if (row.items) {
                  items = JSON.parse(row.items);
               }

               // Create a new item with the provided data
               var newItem = {
                  idInWishList: 1,
                  name: data.name,
                  webpageurl: data.webpageurl,
                  price: data.price,
                  imageurl: ""
               }

               // Generate a unique ID for the new item
               if (items.length > 0) {
                  newItem.idInWishList = items[items.length - 1].idInWishList + 1;
               }

               // If a image is provided save the image
               if (data.image) {
                  // Remove the data URL prefix
                  const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
                  const buffer = Buffer.from(base64Data, 'base64');

                  // Create a unique filename
                  const uniqueFileName = `image_${Date.now()}.png`;
                  const filePath = `public/images/${uniqueFileName}`;

                  // Save the image to the images files
                  fs.writeFile(filePath, buffer, (err) => {
                     if (err) {
                        console.error(err);
                     } else {
                        // If successfully made new image save the url to the item
                        newItem.imageurl = `/images/${uniqueFileName}`;
                     }
                     // Add the new item to the wishlist
                     addNewItem(newItem, items, data.wishlistId);
                  });
               } else {
                  // Add the new item to the wishlist without an image
                  addNewItem(newItem, items, data.wishlistId);
               }
            } else {
               // Log a message if the requester is not the owner of the wishlist
               console.log("Unauthorized: Requester does not match the wishlist owner.");
            }
         } else {
            // Log a message if the wishlist is not found
            console.log(`No wishlist found with ID ${data.wishlistId}.`);
         }
      });
   });


   // Add a new item to the wishlist and update the database
   function addNewItem(newItem, items, wishlistId) {
      // Push the new item into the existing items array
      items.push(newItem);

      // Convert the updated items array to a JSON string
      var newItems = JSON.stringify(items);

      // Update the wishlist in the database with the new items
      db.run("UPDATE wishLists SET items = ? WHERE id = ?", [newItems, wishlistId], function(err) {
         if (err) {
            // Handle any errors that occur during the database update
            console.error(err.message);
         } else {
            // Log a success message after adding the item to the wishlist
            console.log("Added item to wishlist: " + wishlistId);
         }
      });

      // Notify the client that the wishlist has been updated
      socket.emit("changedWishList");
   }



   // Remove an item from a wishlist
   socket.on("removeItemFromWishList", (data) => {
      // Get the owner and items of the wishlist
      db.get("SELECT ownerUsername, items FROM wishLists WHERE id = ?", [data.wishlistId], function(err, row) {
         if (err) {
            // Handle any database errors
            console.error(err.message);
         } else if (row) {
            const ownerUsername = row.ownerUsername;

            // Check if the requester's username matches the owner's username
            if (socket.username == ownerUsername) {
               // User is authorized to remove an item from the wishlist

               var items = [];

               if (row.items) {
                  items = JSON.parse(row.items);
               }

               // Run threw all the items in the wishlist until it finds the one with the same id
               for (var i = 0; i < items.length; i++) {
                  if (items[i].idInWishList == data.idInWishList) {

                     // If the item has an image attached to it
                     if (items[i].imageurl) {
                        // Remove the associated image file from the server
                        const filePath = "public/" + items[i].imageurl;
                        if (fs.existsSync(filePath)) {
                           fs.unlink(filePath, (err) => {
                              if (err) {
                                 console.error(err);
                              } else {
                                 console.log('File deleted successfully.');
                              }
                           });
                        }
                     }

                     // Remove the item from the items array
                     items.splice(i, 1);

                     // Convert the updated array back to a JSON string
                     var newItems = JSON.stringify(items);

                     // Update the wishlist with the new items in the database
                     db.run("UPDATE wishLists SET items = ? WHERE id = ?", [newItems, data.wishlistId], function(err) {
                        if (err) {
                           // Handle any database errors during the update
                           console.error(err.message);
                        } else {
                           // Log a success message after removing the item from the wishlist
                           console.log("Removed item from wishlist: " + data.wishlistId);
                           socket.emit("changedWishList");
                        }
                     });

                     // Found the correct item so stop looking
                     break;
                  }
               }

            } else {
               // Log a message if the requester is not the owner of the wishlist
               console.log("Unauthorized: Requester does not match the wishlist owner.");
            }
         } else {
            // Log a message if the wishlist is not found
            console.log(`No wishlist found with ID ${data.wishlistId}.`);
         }
      });
      
   });


   // Update an item in a wishlist
   socket.on("updateItemInWishList", (data) => {
      if (data.info.idInWishList) {
         // Get the owner and items of the wishlist
         db.get("SELECT ownerUsername, items FROM wishLists WHERE id = ?", [data.info.wishlistId], function(err, row) {
            if (err) {
               // Handle any database errors
               console.error(err.message);
            } else if (row) {
               const ownerUsername = row.ownerUsername;

               // Check if the requester's username matches the owner's username
               if (socket.username == ownerUsername) {
                  // User is authorized to update an item in the wishlist

                  var items = [];

                  if (row.items) {
                     items = JSON.parse(row.items);
                  }

                  // Run threw all the items in the wishlist until it finds the one with the same id
                  for (var i = 0; i < items.length; i++) {
                     if (items[i].idInWishList == data.info.idInWishList) {
                        // Update item properties with new data
                        items[i].name = data.name;
                        items[i].price = data.price;
                        items[i].webpageurl = data.webpageurl;

                        if (data.image) {
                           // Handle image updates

                           // Remove the existing image file from the server
                           const filePath = "public/" + items[i].imageurl;
                           if (fs.existsSync(filePath)) {
                              fs.unlink(filePath, (err) => {
                                 if (err) {
                                    console.error(err);
                                 } else {
                                    console.log('File deleted successfully.');
                                 }
                              });
                           }

                           // Remove the data URL prefix from the new image
                           const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
                           const buffer = Buffer.from(base64Data, 'base64');

                           // Create a unique filename
                           const uniqueFileName = `image_${Date.now()}.png`;
                           const newfilePath = `public/images/${uniqueFileName}`;

                           // Save the image to the images files
                           fs.writeFile(newfilePath, buffer, (err) => {
                              if (err) {
                                 console.error(err);
                              } else {
                                 // If successfully made new image save the url to the item
                                 items[i].imageurl = `/images/${uniqueFileName}`;
                              }

                              // Convert the updated array back to a JSON string
                              var newItems = JSON.stringify(items);

                              // Update the wishlist with the new items in the database
                              db.run("UPDATE wishLists SET items = ? WHERE id = ?", [newItems, data.info.wishlistId], function(err) {
                                 if (err) {
                                    // Handle any database errors during the update
                                    console.error(err.message);
                                 } else {
                                    // Log a success message after updating the item in the wishlist
                                    console.log("Updated item from wishlist: " + data.info.wishlistId);
                                    socket.emit("changedWishList");
                                 }
                              });
                           });
                        } else {
                           // No image update, simply update the wishlist in the database

                           // Convert the updated array back to a JSON string
                           var newItems = JSON.stringify(items);

                           // Update the wishlist with the new items in the database
                           db.run("UPDATE wishLists SET items = ? WHERE id = ?", [newItems, data.info.wishlistId], function(err) {
                              if (err) {
                                 // Handle any database errors during the update
                                 console.error(err.message);
                              } else {
                                 // Log a success message after updating the item in the wishlist
                                 console.log("Updated item from wishlist: " + data.info.wishlistId);
                                 socket.emit("changedWishList");
                              }
                           });
                        }

                        // Found the correct item so stop looking
                        break;
                     }
                  }
               } else {
                  // Log a message if the requester is not the owner of the wishlist
                  console.log("Unauthorized: Requester does not match the wishlist owner.");
               }
            } else {
               // Log a message if the wishlist is not found
               console.log(`No wishlist found with ID ${data.info.wishlistId}.`);
            }
         });
      }
   });

   // Update the wishlist name
   socket.on("changeWishListName", (data) => {
      // Get the owner of the wishlist
      db.get("SELECT ownerUsername FROM wishLists WHERE id = ?", [data.wishlistId], function(err, row) {
         if (err) {
            // Handle any database errors
            console.error(err.message);
         } else if (row) {
            const ownerUsername = row.ownerUsername;

            // Check if the requester's username matches the owner's username
            if (socket.username == ownerUsername) {
               // User is authorized to update the name of the wishlist

               // Update the wishlist with the new items in the database
               db.run("UPDATE wishLists SET name = ? WHERE id = ?", [data.newName, data.wishlistId], function(err) {
                  if (err) {
                     // Handle any database errors during the update
                     console.error(err.message);
                  } else {
                     // Log a success message after updating the item in the wishlist
                     console.log("Updated name for wishlist: " + data.wishlistId);
                     socket.emit("refresh");
                  }
               });

            } else {
               // Log a message if the requester is not the owner of the wishlist
               console.log("Unauthorized: Requester does not match the wishlist owner.");
            }
         } else {
            // Log a message if the wishlist is not found
            console.log(`No wishlist found with ID ${data.wishlistId}.`);
         }
      });
   });
});


// Retrieve all wishlists owned by a specific user
function getAllWishListsOwned(ownerUsername, callback) {
   // Get all wishlists owned by the specified user
   db.all("SELECT * FROM wishLists WHERE ownerUsername = ?", [ownerUsername], function(err, rows) {
      if (err) {
         // Handle any database errors and provide an empty array in case of an error
         console.error(err.message);
         callback([]);
      } else {
         // Invoke the callback with the retrieved rows (wishlists)
         callback(rows);
      }
   });
}

// Get all wishlists shared with a specific user
function getAllWishListsShared(username, callback) {
   // Gets all wishlists where the username is like one in the shared usernames
   db.all("SELECT * FROM wishLists WHERE sharedUsernames LIKE ?", [`%${username}%`], function(err, rows) {
      if (err) {
         // Error occurred for a reason so return nothing
         console.error(err.message);
         callback([]);
      } else {
         let checkedRows = []; // Holds the new wishlists that have been checked to verify that its actually shared with them

         // Runs threw all wishlists to verify that its actually shared with the specific user
         for(i = 0; i < rows.length; i++) {
            const sharedUsernames = rows[i].sharedUsernames.split(",");

            // Runs threw all the users that the wishlist is shared with
            for(j = 0; j < sharedUsernames.length; j++) { 

               // Check if the user's username is found in the list of sharedUsernames for each wishlist
               if(sharedUsernames[j] == username) {
                  // If it is the exact same add it to the list of checked rows
                  checkedRows.push(rows[i]);

                  // Already verified its the exact same so stop checking this wishlist
                  break;
               }
            }
         }

         // Return all the checked rows
         callback(checkedRows);
      }
   });
}

// Function to check if a user has permissions for a wishlist
function getWishListPermsNeeded(wishlistId, username, callback) {
   db.get("SELECT * FROM wishLists WHERE id = ?", [wishlistId], function(err, row) {
       if (err) {
           console.error(err.message);
           callback(false); // Error occurred, permissions not granted
       } else if (row) {
           const ownerUsername = row.ownerUsername;
           const sharedUsernames = row.sharedUsernames.split(",");

           if (ownerUsername == username || sharedUsernames.includes(username)) {
               callback(true, row); // User has permissions
           } else {
               callback(false); // User does not have permissions
           }
       } else {
           console.log(`No wishlist found with ID ${wishlistId}.`);
           callback(false); // Wishlist not found, permissions not granted
       }
   });
}

// Delete a wishlist and its associated item images
function deleteWishList(wishlistId, socket) {
   // Query the database to retrieve the owner and items of the specified wishlist
   db.get("SELECT ownerUsername, items FROM wishLists WHERE id = ?", [wishlistId], function(err, row) {
      if (err) {
         // Handle any database errors
         console.error(err.message);
      } else {
         if (row) {
            const ownerUsername = row.ownerUsername;

            // Check if the requester's username matches the owner's username
            if (socket.username == ownerUsername) {
               // User is authorized to delete the wishlist

               var items = [];

               if (row.items) {
                  items = JSON.parse(row.items);
               }

               // Delete all the item images in the wishlist
               for (let i = 0; i < items.length; i++) {
                  // If the item dosent have an image attached to it, skip it.
                  if (!items[i].imageurl) {
                     continue;
                  }

                  const filePath = "public/" + items[i].imageurl;

                  // Check if the file exists and delete it
                  if (fs.existsSync(filePath)) {
                     fs.unlink(filePath, (err) => {
                        if (err) {
                           console.error(err);
                        } else {
                           console.log('File deleted successfully.');
                        }
                     });
                  }
               }

               // Delete the wishlist from the database
               db.run("DELETE FROM wishLists WHERE id = ?", [wishlistId], function(err) {
                  if (err) {
                     console.error(err.message);
                  } else {
                     // Notify clients to refresh their wishlists
                     socket.emit("refreshWishLists");
                     console.log(`Wishlist with ID ${wishlistId} has been deleted.`);
                  }
               });
            } else {
               // Log a message if the requester is not the owner of the wishlist
               console.log("Unauthorized: Requester does not match the wishlist owner.");
            }
         } else {
            // Log a message if the wishlist is not found
            console.log(`No wishlist found with ID ${data.wishlistId}.`);
         }
      }
  });
}