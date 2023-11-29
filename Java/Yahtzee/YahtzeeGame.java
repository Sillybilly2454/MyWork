import java.io.IOException;
import java.util.List;
import java.util.ArrayList;


public class YahtzeeGame {

   // instance variables
   public final Die[] dice; // Array of 5 dice

   private Player[] players; // A reference to all the players
   
   public boolean[] keepDice = {false, false, false, false, false}; // boolean array to represent which dice to keep
   public int turn = 0; // Keeps track of the players turn
   private int currentPlayersTurn; // So we know what players turn it is
 
   // CONSTRUCTOR
   // ===========
   public YahtzeeGame(String[] playersName, int[] botDifficulties) 
   {
      dice = new Die[5]; // create the array of 5 Dice objects
      for (int i = 0; i < 5; i++) {
         dice[i] = new Die(); // initialize each Dice object
      }

      // Get all the bots names by making an array of string with the length of botDifficulties
      String[] botsName = new String[botDifficulties.length];
      int[] countOfBotsName = new int[2]; // Create an array to store the count of bots with each name

      for (int i = 0; i < botDifficulties.length; i++) {
         if (botDifficulties[i] == 1) { // If the bot's difficulty is 1 (normal), name it "Bob"
            if (countOfBotsName[0] != 0) { // If there are already bots named "Bob"
               botsName[i] = "Bob" + countOfBotsName[0]; // Set the bot's name as "Bob" followed by the count
            } else {
               botsName[i] = "Bob"; // Set the bot's name as "Bob" (no count)
            }
            
            countOfBotsName[0]++; // Increment the count of bots named "Bob"
         } else if (botDifficulties[i] == 2) { // If the bot's difficulty is 2 (hard), name it "Bill"
            if (countOfBotsName[1] != 0) { // If there are already bots named "Bill"
               botsName[i] = "Bill" + countOfBotsName[1]; // Set the bot's name as "Bill" followed by the count
            } else {
               botsName[i] = "Bill"; // Set the bot's name as "Bill" (no count)
            }
            countOfBotsName[1]++; // Increment the count of bots named "Bill"
         }
      }      

      players = new Player[playersName.length + botDifficulties.length]; // Create an array to store players (human and bots)

      for (int i = 0; i < playersName.length; i++) { // Run threw all the human players name
         players[i] = new Player(playersName[i], true, -1, this); // Create a new human player with the given name
      }

      for (int i = 0; i < botDifficulties.length; i++) { // Run threw all the bot players difficulties
         players[i + playersName.length] = new Player(botsName[i], false, botDifficulties[i], this); // Create a new bot player with the assigned name and difficulty
         // i add the playersName.length to i so that it adds to the list of players in the right position.
      }
   }
 
   // METHODS
   // =======

   // The main game loop
   public void playGame() throws IOException {
      // Run for 13 rounds
      for (int round = 0; round < 13; round++) {
         // Iterate through each player
         for (int i = 0; i < players.length; i++) {
            currentPlayersTurn = i; // Keep track of which players turn it is
            players[i].Turn(dice); // Perform a turn for the current player
         }
      }
      clearConsole(); // Clear the console

      int[] allTotalScores = new int[players.length];

      // Iterate through each player to find the player with the highest score
      for (int i = 0; i < players.length; i++) {
         // Get the score of the current player and store it in the array
         allTotalScores[i] = players[i].scoreboard.getTotalScore();
      }

      // Sort players by total score in descending order - CODE FROM CHAT GPT - 
      for (int i = 0; i < players.length - 1; i++) {
         for (int j = i + 1; j < players.length; j++) {
            if (allTotalScores[j] > allTotalScores[i]) {
               // Swap players[i] and players[j]
               Player temp = players[i];
               players[i] = players[j];
               players[j] = temp;

               // Swap allTotalScores[i] and allTotalScores[j]
               int tempScore = allTotalScores[i];
               allTotalScores[i] = allTotalScores[j];
               allTotalScores[j] = tempScore;
            }
         }
      }

      String resetColor = "\u001B[0m"; // ANSI escape code for reset (to revert back to default color and text style)
      String boldText = "\u001B[1m"; // ANSI escape code for bold text
      String yellowColor = "\u001B[33m"; // ANSI escape code for yellow color

      System.out.println("Player Rankings:"); // Print a heading for the player rankings

      // Iterate through each player and print their ranking, name, and total score
      for (int i = 0; i < players.length; i++) {
         System.out.println((i + 1) + ". " + yellowColor + boldText + players[i].name + resetColor + " - Total Score: " + allTotalScores[i]); // Prints out the players name in bold and yellow colored text, and the players total score in normal white text
      }

      System.out.println("\n\n"); // Print blank lines
   }

   // A function that when called will flip if the dice is being kept or not.
   public void keepOrPutBackDice(int dice) {
      if (keepDice[dice] == true) {
         keepDice[dice] = false; // If the dice is currently being kept, change its state to not being kept.
      } else {
         keepDice[dice] = true; // If the dice is currently not being kept, change its state to being kept.
      }
   }

   // This method simulates rolling the dice.
   public void RollDice() {
      // Loop through the dice array and roll all the dice that aren't being kept
      for (int j = 0; j < 5; j++) {
         if (!keepDice[j]) {
            dice[j].Roll(); // Roll each dice
         }
      }
   }

   public void DisplayValues() {

      clearConsole(); // Clear the console

      String resetColor = "\u001B[0m"; // ANSI escape code for reset (to revert back to default color and text style)
      String boldText = "\u001B[1m"; // ANSI escape code for bold text
      String yellowColor = "\u001B[33m"; // ANSI escape code for yellow color
      String lightBlueColor = "\u001B[94m"; // ANSI escape code for light blue color
      

      System.out.print("     __________________"); // Print the top border line
      for (Player player : players) {
         System.out.print("________"); // Print additional border lines for each player
      }
      System.out.println(""); // Move to the next line

      System.out.print("     |                |"); // Print the left border line
      for (Player player : players) {
         String playerName = player.name; // Get the name of each player
         
         // Determine the length of the player's name and prints the players name in bold yellow text and with a certain amount of spaces.
         if (playerName.length() == 2) {
            System.out.print(boldText + yellowColor + playerName + "     " + resetColor + "|");
         } else if (playerName.length() == 3) {
            System.out.print(boldText + yellowColor + playerName + "    " + resetColor + "|");
         } else if (playerName.length() == 4) {
            System.out.print(boldText + yellowColor + playerName + "   " + resetColor + "|");
         } else if (playerName.length() == 5) {
            System.out.print(boldText + yellowColor + playerName + "  " + resetColor + "|");
         } else if (playerName.length() == 6) {
            System.out.print(boldText + yellowColor + playerName + " " + resetColor + "|");
         }
      }

      System.out.println(""); // Print an empty line

      System.out.print("     |________________|"); // Print the upper border line for the score section
      for (Player player : players) {
         System.out.print("_______|"); // Print additional border lines for each player in the score section
      }
      System.out.println(""); // Move to the next line

      // Iterates through 16 different categories for scoring
      for (int i = 0; i < 16; i++) {
         int potentialValue = 0; // Variable to store the potential score value
         int values[] = new int[players.length]; // Array to store the score values for each player

         if(i < 6) { // for the first six categories get all the scores for that category
            for (int j = 0; j < players.length; j++) {
               values[j] = players[j].scoreboard.scores[i];
            }
         } else if (i > 7 && i < 15) {
            for (int j = 0; j < players.length; j++) {
               values[j] = players[j].scoreboard.scores[i - 2];
            }
         }

         // Determine the appropriate scores and potential value based on the current category and prints all category numbers with a light blue color
         switch(i) {
            // Cases 0-5 correspond to scoring categories for each dice value (Ones, Twos, Threes, Fours, Fives, Sixes)
            case 0:
               System.out.print(lightBlueColor + "(1)" + resetColor + "  |Ones            | ");
               potentialValue = players[1].scoreboard.countDice(dice, 1);
               break;
            case 1:
               System.out.print(lightBlueColor + "(2)" + resetColor + "  |Twos            | ");
               potentialValue = players[1].scoreboard.countDice(dice, 2);
               break;
            case 2:
               System.out.print(lightBlueColor + "(3)" + resetColor + "  |Threes          | ");
               potentialValue = players[1].scoreboard.countDice(dice, 3);
               break;
            case 3:
               System.out.print(lightBlueColor + "(4)" + resetColor + "  |Fours           | ");
               potentialValue = players[1].scoreboard.countDice(dice, 4);
               break;
            case 4:
               System.out.print(lightBlueColor + "(5)" + resetColor + "  |Fives           | ");
               potentialValue = players[1].scoreboard.countDice(dice, 5);
               break;
            case 5:
               System.out.print(lightBlueColor + "(6)" + resetColor + "  |Sixes           | ");
               potentialValue = players[1].scoreboard.countDice(dice, 6);
               break;
            // Cases 6-7 correspond to Sum and Bonus categories
            case 6:
               System.out.print("     |Sum             | ");
               potentialValue = 0;
               for (int j = 0; j < players.length; j++) {
                  values[j] = players[j].scoreboard.GetSum();
               }
               break;
            case 7:
               System.out.print("     |Bonus           | ");
               potentialValue = 0;
               for (int j = 0; j < players.length; j++) {
                  values[j] = players[j].scoreboard.bonus;
               }
               break;
            // Cases 8-14 correspond to various special categories (Three of a Kind, Four of a Kind, Full House, Small Straight, Large Straight, Chance, Yahtzee) 
            case 8:
               System.out.print(lightBlueColor + "(7)" + resetColor + "  |Three of a kind | ");
               potentialValue = players[1].scoreboard.scoreThreeOfAKind(dice);
               break;
            case 9:
               System.out.print(lightBlueColor + "(8)" + resetColor + "  |Four of a kind  | ");
               potentialValue = players[1].scoreboard.scoreFourOfAKind(dice);
               break;
            case 10:
               System.out.print(lightBlueColor + "(9)" + resetColor + "  |Full House      | ");
               potentialValue = players[1].scoreboard.scoreFullHouse(dice);
               break;
            case 11:
               System.out.print(lightBlueColor + "(10)" + resetColor + " |Small Straight  | ");
               potentialValue = players[1].scoreboard.scoreSmallStraight(dice);
               break;
            case 12:
               System.out.print(lightBlueColor + "(11)" + resetColor + " |Large Straight  | ");
               potentialValue = players[1].scoreboard.scoreLargeStraight(dice);
               break;
            case 13:
               System.out.print(lightBlueColor + "(12)" + resetColor + " |Chance          | ");
               potentialValue = players[1].scoreboard.scoreChance(dice);
               break;
            case 14:
               System.out.print(lightBlueColor + "(13)" + resetColor + " |Yahtzee         | ");
               potentialValue = players[1].scoreboard.scoreYahtzee(dice);
               break;
            // Case 15 corresponds to the Total category
            case 15:
               System.out.print("     |Total           | ");
               potentialValue = 0;
               for (int j = 0; j < players.length; j++) {
                  values[j] = players[j].scoreboard.getTotalScore();
               }
               break;
         }
         
         printValue(values, potentialValue); // Calls a function to print the score values and potential value
      }

      System.out.println(); // Print a space


      // Display the current player's turn and roll number
      if (turn < 3) {
         System.out.println(yellowColor + boldText + players[currentPlayersTurn].name + resetColor + "'s turn, roll: " + (turn + 1)); // Prints the players name in bold and yellow color text
      } else {
         System.out.println("Roll: 3");
      }

      // Display the dice positions on the table
      System.out.println("Dice On Table: \n");
      List<Integer> diceValues = new ArrayList<>(); // Create a new list to hold the values of the dice to print

      for (int j = 0; j < 5; j++) {
         if (!keepDice[j]) { // If the dice is not being kept, print its position and add its value to the list of dice values
            System.out.print("   " + lightBlueColor + "(" + (j + 1) + ")" + resetColor + "     "); // Prints the dice number (1-5) in a blue color
            diceValues.add(dice[j].getValue());
         }
      }

      System.out.println(); // Finish the line

      printDice(diceValues); // Prints out the inputted values as dice

      // Display all the dice positions in your hand like, Dice (3, 4)
      System.out.println("Dice In Hand: \n");
      diceValues = new ArrayList<>(); // Clear the list of values

      for (int j = 0; j < 5; j++) {
         if (keepDice[j]) { // If you're keeping the dice, print its position and add it to the list of dice values
            System.out.print("   " +lightBlueColor + "(" + (j + 1) + ")" + resetColor + "     "); // Prints the dice number (1-5) in a blue color
            diceValues.add(dice[j].getValue()); // Adds the dice value to the list of values
         }
      }
      System.out.println(); // Finish the line

      printDice(diceValues); // Prints out the inputted values as dice

   }


   private void printDice(List<Integer> diceValues) {
      // Create an array to hold the lines for each dice value
      String[] diceStringLines = new String[5];
      // Runs threw all the dice lines to initialize them to stop the word null from coming up
      for (int i = 0; i < diceStringLines.length; i++) {
         diceStringLines[i] = "";
      }

      // Generate the lines for each dice value
      for (int value : diceValues) {
         switch(value) {
            case 1:
               // Add lines for dice value 1
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "|       |  ";
               diceStringLines[2] += "|   *   |  ";
               diceStringLines[3] += "|       |  ";
               diceStringLines[4] += " -------   ";
            break;
            case 2:
               // Add lines for dice value 2
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "| *     |  ";
               diceStringLines[2] += "|       |  ";
               diceStringLines[3] += "|     * |  ";
               diceStringLines[4] += " -------   ";
            break;
            case 3:
               // Add lines for dice value 3
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "| *     |  ";
               diceStringLines[2] += "|   *   |  ";
               diceStringLines[3] += "|     * |  ";
               diceStringLines[4] += " -------   ";
            break;
            case 4:
               // Add lines for dice value 4
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "| *   * |  ";
               diceStringLines[2] += "|       |  ";
               diceStringLines[3] += "| *   * |  ";
               diceStringLines[4] += " -------   ";
            break;
            case 5:
               // Add lines for dice value 5
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "| *   * |  ";
               diceStringLines[2] += "|   *   |  ";
               diceStringLines[3] += "| *   * |  ";
               diceStringLines[4] += " -------   ";
            break;
            case 6:
               // Add lines for dice value 6
               diceStringLines[0] += " -------   ";
               diceStringLines[1] += "| *   * |  ";
               diceStringLines[2] += "| *   * |  ";
               diceStringLines[3] += "| *   * |  ";
               diceStringLines[4] += " -------   ";
            break;
         }
      }

      // Print the lines for each dice value
      for (String string : diceStringLines) {
         System.out.println(string);
      }
      System.out.println();
   }

   // A function which prints a value on the scoreboard, it takes in the player and ai players value for that section of the scoreboard and what the player could potentially get
   private void printValue(int[] scores, int potentialValue) { 
      String resetColor = "\u001B[0m"; // ANSI escape code for reset (to revert back to default color and text style)
      String pinkColor = "\u001B[95m"; // ANSI escape code for pink color

      // This checks the length of the first value, and then puts the value in with a certain amount of spaces around it to keep the scoreboard the same size
      for (int i = 0; i < scores.length; i++) {
         if(scores[i] >= 0 && scores[i] < 10) {
            System.out.print("  " + scores[i] + "  ");
         } else if(scores[i] >= 10 && scores[i] < 100) {
            System.out.print(" " + scores[i] + "  ");
         } else if(scores[i] > 100) {
            System.out.print(" " + scores[i] + " ");
         } else if (potentialValue > 0 && potentialValue < 10 && players[currentPlayersTurn].name == players[i].name && players[currentPlayersTurn].isHuman) {  // Depending on the amount of characters like 
            // If the player doesn't have a value for that category yet check if theres a potential value for the player and check if its the players turn
            System.out.print(pinkColor + " (" + potentialValue + ") " + resetColor); // Print the potential value in a pink color
         } else if (potentialValue >= 10 && potentialValue < 100 && players[currentPlayersTurn].name == players[i].name && players[currentPlayersTurn].isHuman){
            System.out.print(pinkColor + "(" + potentialValue + ") " + resetColor); // Print the potential value in a pink color
         } else {
            // If the player doesn't have a value or a (potential value/its bots turn/it isn't that players turn) then just leave the space empty
            System.out.print("     ");
         }
   
         // A spacer and wall for the next column
         System.out.print(" | " );
      }

      System.out.println(); // Finishes the line


      System.out.print("     |________________|"); // Finish the row of the scoreboard

      for (Player player : players) {
         System.out.print("_______|"); // Print additional border lines for each player in the score section
      }
      System.out.println(""); // Finishes the line
   } 

   private static void clearConsole() { // A function which clears the console
    System.out.print("\033\143"); // Runs a code which resets the console
   }
}