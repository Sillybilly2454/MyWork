import java.io.IOException;
import java.util.Scanner;

public class Yahtzee {
   private YahtzeeGame game; // Creates an instance of YahtzeeGame to play the game
   private Scanner scanner; // Creates an instance of Scanner to read input from the user

   public Yahtzee() {
      scanner = new Scanner(System.in); // Initializes the scanner to read input from the user
   }

   public void NewGame(String[] playersName, int[] botsDifficulty) throws IOException {
      game = new YahtzeeGame(playersName, botsDifficulty); // Creates a new instance of the YahtzeeGame with the given player name and bot difficulty
      game.playGame(); // Starts a new game
   }

   public static void ResetHeader() {
      System.out.print("\033\143"); // Clears the console

      // ANSI escape code for yellow color
      String yellowColor = "\u001B[33m";

      // ANSI escape code for blue color
      String blueColor = "\u001B[34m";
        
      // ANSI escape code for reset (to revert back to default color)
      String resetColor = "\u001B[0m";
      
      // Prints out lines of yellow-colored text that make up the word Yahtzee
      System.out.println(yellowColor + "██╗   ██╗ █████╗ ██╗  ██╗████████╗███████╗███████╗███████╗ ");
      System.out.println("╚██╗ ██╔╝██╔══██╗██║  ██║╚══██╔══╝╚══███╔╝██╔════╝██╔════╝ ");
      System.out.println(" ╚████╔╝ ███████║███████║   ██║     ███╔╝ █████╗  █████╗   ");
      System.out.println("  ╚██╔╝  ██╔══██║██╔══██║   ██║    ███╔╝  ██╔══╝  ██╔══╝   ");
      System.out.println("   ██║   ██║  ██║██║  ██║   ██║   ███████╗███████╗███████╗ ");
      System.out.println("   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚══════╝ ");
      System.out.println(blueColor + "========================================================== " + resetColor); // Prints line a blue color
      System.out.println("                   Made by Mason Gourlay\n");
   }

   public static void main(String[] args) throws IOException {
      ResetHeader();
      Yahtzee yahtzee = new Yahtzee(); // Creates an instance of the Yahtzee game
      String[] humanNames; // An array that holds human player names
      int[] botDifficulties; // An array that holds bot player difficulties

      String redColor = "\u001B[31m"; // ANSI escape code for red color
      String resetColor = "\u001B[0m"; // ANSI escape code for reset (to revert back to default color and text style)
      String boldText = "\u001B[1m"; // ANSI escape code for bold text
      String greenColor = "\u001B[32m"; // ANSI escape code for green color
      String yellowColor = "\u001B[33m"; // ANSI escape code for yellow color
      String lightBlueColor = "\u001B[94m"; // ANSI escape code for light blue color
      String pinkColor = "\u001B[95m"; // ANSI escape code for pink color
   
      while (true) { // Loops the main menu back to the start
         // Game menu options
         System.out.println("(1) New Game");
         System.out.println("(2) Game Information");
         System.out.println("(3) Quit Game");
         String choice = yahtzee.scanner.nextLine();
   
         if (choice.equals("1")) { // New Game
            ResetHeader(); // Reset game header
   
            while (true) { // Loops the selection of players
               humanNames = new String[0]; // Reset the array for human player names
               botDifficulties = new int[0]; // Reset the array for bot difficulties
               System.out.println(greenColor + "Limited to a total of 2-21 players (Humans and Bots) in a game\n" + resetColor); // Set the line of the text to green
               while (true) { // loops the selection of human players
                  System.out.println("How many human players will there be?\n");
                  String input = yahtzee.scanner.nextLine();
                  try { // Try's to do the conversion
                     int convertedInput = Integer.parseInt(input); // Converts the string into int 
   
                     if (convertedInput > 0 && convertedInput <= 21) { // Valid input
                        humanNames = new String[convertedInput]; // Makes a list of human names with the length as the chosen amount of human players
                        for (int i = 0; i < humanNames.length; i++) {
                           humanNames[i] = ""; // Run threw and initialize all human names to an empty string
                        }
   
                        for (int i = 0; i < humanNames.length; i++) { // Run threw all humanNames
                           ResetHeader();// Reset game header
                           while (true) { // Loops the choosing of a human players name
                              System.out.println("What is player " + (i + 1) + " name? (2-6 Characters)");
                              String tempName = yahtzee.scanner.nextLine();
                              if (tempName.length() <= 6 && tempName.length() >= 2) { // If the name chosen is between 2 and 6 characters
                                 // Variables to check if name cant be used
                                 boolean nameAlreadyUsed = false;
                                 boolean nameUsedByBot = false;

                                 for (int f = 0; f < humanNames.length; f++) { // Run threw all the human names
                                    if (tempName.toLowerCase().equals(humanNames[f].toLowerCase())) { // Check that the name is already used
                                       nameAlreadyUsed = true; // If it is used save the variable
                                    }
                                 }
                                 if (tempName.toLowerCase().contains("bill") || tempName.toLowerCase().contains("bob")) { // Check to make sure they don't choose one of the bots name including things like (billy, billy10, bob100)
                                    nameUsedByBot = true; // If they did save the variable
                                 }
   
                                 if (!nameAlreadyUsed && !nameUsedByBot) { // If the name hasn't been used and it isn't a bot name
                                    // Save the name and go to the next name
                                    humanNames[i] = tempName;
                                    break;
                                 } else if (nameUsedByBot) { // If the name is a bot name
                                    ResetHeader(); // Reset game header
                                    System.out.println(redColor + "Can't use a bot's name!\n" + resetColor); // Set the line of the text to red
                                 } else { // players name is already used by another player
                                    ResetHeader(); // Reset game header
                                    System.out.println(redColor + "Name already used by another player, try again!\n" + resetColor); // Set the line of the text to red 
                                 }
                              } else { // Invalid Name Size
                                 ResetHeader(); // Reset game header
                                 humanNames[i] = "P" + (i + 1); // Set the players name to P + there number out of the rest of players
                                 System.out.println(redColor + "Invalid length, using default name\n" + resetColor); // Set the line of the text to red
                                 break; // Go to the next name
                              }
                           }
                        }
                        break;
                     } else if (convertedInput == 0) { // 0 no human players 
                        break; // Break out of loop and go to bot selecting
                     } else if (convertedInput < 0) { // Error cant go below 0
                        ResetHeader(); // Reset game header
                        System.out.println(redColor + "You can't go below 0, try again!\n" + resetColor); // Set the line of the text to red
                     } else {
                        ResetHeader(); // Reset game header
                        System.out.println(redColor + "You can't go above 21, try again!\n" + resetColor); // Set the line of the text to red
                     }
                  } catch (Exception e) { // Fails to convert string to number
                     ResetHeader(); // Reset game header
                     System.out.println(redColor + "Invalid character" + resetColor); // Set the line of the text to red
                  }
               }
   
               if(humanNames.length != 21) { // Check if human players is already the max for all the players
                  ResetHeader(); // Reset game header
                  System.out.println(greenColor + "Limited to a total of 2-21 players (Humans and Bots) in a game\n" + resetColor); // Set the line of the text to green
                  while (true) { // loops the selection of bot players
                     System.out.println("How many AI players will there be?\n");
                     String input = yahtzee.scanner.nextLine();

                     try { // Try's to do conversion
                        int convertedInput = Integer.parseInt(input); // Converts string to int

                        if (convertedInput > 0 && convertedInput <= 21 - humanNames.length) { // If they enter between 1 and the max of 21 players minus how many human player slots are used
                              botDifficulties = new int[convertedInput]; // Makes a list of bot difficulties with the length as the chosen amount of bot players
                              ResetHeader(); // Reset game header
                              for (int i = 0; i < botDifficulties.length; i++) { // Run threw all the bots
                                 System.out.println("What is bot " + (i + 1) + " difficulty? (Normal, Hard) \n");
                                 String tempDifficulty = yahtzee.scanner.nextLine();

                                 if (tempDifficulty.toLowerCase().startsWith("n")) { // If input starts with n (case doesn't matter)
                                    ResetHeader(); // Reset game header
                                    botDifficulties[i] = 1; // Set bot difficulty to Normal (1)
                                 } else if (tempDifficulty.toLowerCase().startsWith("h")) { // If input starts with h (case doesn't matter)
                                    ResetHeader(); // Reset game header
                                    botDifficulties[i] = 2; // Set bot difficulty to Hard (2)
                                 } else { // If anything else is entered 
                                    botDifficulties[i] = 1; // Set bot difficulty to Normal (1) as default
                                    ResetHeader(); // Reset game header
                                    System.out.println(redColor + "Invalid choice, using Normal Difficulty\n" + resetColor); // Set the line of the text to red
                                 }
                              }
                              break; // Exit the loop
                        } else if (convertedInput == 0) {
                              break; // Exit the loop
                        } else if (convertedInput < 0) {
                              ResetHeader(); // Reset game header
                              System.out.println(redColor + "You can't go below 0, try again!\n" + resetColor); // Set the line of the text to red
                        } else {
                           ResetHeader(); // Reset game header
                           System.out.println(redColor + "You can't go over a total of 21 Players! You currently have " + humanNames.length + " human players\n" + resetColor); // Set the line of the text to red
                           
                        }
                     } catch (Exception e) { // Fails to convert string to number
                        ResetHeader(); // Reset game header
                        System.out.println(redColor + "Invalid Character\n" + resetColor); // Set the line of the text to red
                     }
                  }
               } 
   
               //Checks if the number of players and bots are greater than 2
               if (humanNames.length + botDifficulties.length < 2) { // Under 2
                  ResetHeader(); // Reset game header
                  System.out.println(redColor + "You need at least 2 players!\n" + resetColor); // Set the line of the text to red
               } else { // Valid number
                  break; // Breaks out to start a new game
               }
            }
            yahtzee.NewGame(humanNames, botDifficulties); // Starts a new game with the selected player name and difficulty level
         } else if (choice.equals("2")) { // Game information
            ResetHeader(); // Reset game header
            // Prints instructions on how to play
            System.out.println(boldText + yellowColor + "Game Information: " + resetColor); // Set the color of the text to yellow and bold then reset the color and bold for after the line
            System.out.println("In each turn a player may throw the dice up to three times. A player doesn't have to roll all five dice on the second and third throw of a round, he may put as many dice as he wants to the side and only throw the ones that don't have the numbers he's trying to get. For example, a player throws and gets 1,3,3,4,6. He decides he want to try for the large straight, 1,2,3,4,5. So, he puts 1,3,4 to the side and only throws 3 and 6 again, hoping to get 2 and 5. (https://cardgames.io/yahtzee/#rules)\n");

            // Sets all the command in brackets to a light blue color
            System.out.println("In this game you enter the number assigned to the dice " + lightBlueColor + "(1-5)" + resetColor + " that you want to keep, moving them one at a time. They will be kept and wont be rerolled the next time you enter the " + lightBlueColor + "(r)" + resetColor + " command. If you decide after the second roll in a turn that you don't want to keep the same dice before the third throw then you can just enter the number assigned to the dice " + lightBlueColor + "(1-5)" + resetColor + " again and they will move back to the table and be rerolled on the next roll.\n");
            // Sets all the command in brackets to a light blue color and the scoreboard potential brackets to pink
            System.out.println("All the commands you can enter are surrounded by " + lightBlueColor + "()" + resetColor + " brackets, etc roll is " + lightBlueColor + "(r)" + resetColor + ". The " + pinkColor + "()" + resetColor + " brackets within the scoreboard are all your potential values that you would get if you choose that category\n");

            System.out.println("You are limited to between 2 and 21 players, this includes both bots and humans.\n");


            // Prints information about bots
            System.out.println(boldText + yellowColor + "Bot information:" + resetColor); // Set the color of the text to yellow and bold then reset the color and bold for after the line
            System.out.println("- Bob: He is the normal bot and just picks the category that has the best score");
            System.out.println("- Billy: He is the hard bot and uses strategy to pick the categories\n\n");
         } else if (choice.equals("3")) { // Quit Game
            break; // Close Yahtzee
         } else { // No valid choice just reload it
            ResetHeader(); // Reset game header
         }
      }
   }   
}