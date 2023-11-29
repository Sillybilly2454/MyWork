import java.util.Scanner;

public class Player {
    public Scoreboard scoreboard;  // A reference to the scoreboard object for the player
    public Boolean isHuman;  // An indicator for whether the player is human or not
    public int botDifficulty;  // An integer representing the difficulty level of the player if it is a bot
    private Scanner scanner;  // A scanner object used for reading user input
    public String name;  // The name of the player

    private YahtzeeGame game;  // A reference to the Yahtzee game object

    // Constructor for the Player class
    public Player(String _name, boolean _isHuman, int _botDifficulty, YahtzeeGame _game) {
        scoreboard = new Scoreboard();  // Create a new scoreboard for the player
        name = _name;  // Set the name of the player
        isHuman = _isHuman;  // Set whether the player is human or not

        if(_botDifficulty > 0) {
            botDifficulty = _botDifficulty;  // Set the bot difficulty level if it is greater than 0
        }

        game = _game;  // Set the Yahtzee game object for the player
    }

    // Function that runs the players turn
    public void Turn(Die[] dice) {
        String redColor = "\u001B[31m"; // ANSI escape code for red color
        String resetColor = "\u001B[0m"; // ANSI escape code for reset (to revert back to default color and text style)
        String lightBlueColor = "\u001B[94m"; // ANSI escape code for light blue color


        boolean hasJoker = false;  // A boolean to indicate whether the player has obtained a joker
        if(isHuman) { // Checks if the player is human
            scanner = new Scanner(System.in); // Initialize the Scanner object to read user input
            boolean skipToPickingCategory = false;  // A boolean to indicate whether the player can skip rolling the dice and directly proceed to picking a category
    
            // Iterate for each player's turn, up to a maximum of 3 turns or until the player obtains a joker
            for (game.turn = 0; game.turn < 3 && hasJoker == false; game.turn++) {
                if (!skipToPickingCategory) {
                    game.RollDice(); // Roll the dice
                }
                game.DisplayValues(); // Display the dice values to the player    

                // Check if the player has already had a yahtzee and there is a category that he could choose.
                if(scoreboard.scoreYahtzee(dice) > 50 && (!scoreboard.isCategoryUsed(scoreboard.scores[8]) || !scoreboard.isCategoryUsed(scoreboard.scores[9]) || !scoreboard.isCategoryUsed(scoreboard.scores[10]))) {
                    hasJoker = true; // The player got a joker
                    break; // Skip to choosing the category
                }
                
                // Choose which dice to keep or put back
                if (game.turn != 2) { // Check if the current turn is not equal to 2
                    while (true) { 
                        // Prompt the user to select an action and makes all the command brackets a light blue Color
                        System.out.println("Select which dice you want to keep or put back " + lightBlueColor + "(1-5)" + resetColor + " one at a time, or enter " + lightBlueColor + "(c)" + resetColor + " to choose a category, or enter " + lightBlueColor + "(r)" + resetColor + " to roll");
                        
                        // Get the player's input from the scanner
                        String input = scanner.nextLine();
                        
                        if (input.equalsIgnoreCase("c")) { // Check if the input is "c" (case-insensitive)
                            skipToPickingCategory = true; // Set the skipToPickingCategory boolean to true
                            game.turn = 2; // Set the turn to 2
                            game.DisplayValues();
                            break; // Exit the loop
                        } else if (input.equalsIgnoreCase("r")) { // Check if the input is "r" (case-insensitive)
                            break; // Exit the loop
                        }
                        
                        try {
                            int index = -1;
                            index = Integer.parseInt(input) - 1; // Parse the input as an integer and subtract 1 to get the index of the corresponding dice
                            
                            if (index >= 0 && index <= 4) { // Check if the index is within the valid range
                                game.keepOrPutBackDice(index); // Call the keepOrPutBackDice method to update the keepDice array
                                game.DisplayValues(); // Updates the display
                            } else {
                                game.DisplayValues(); // Updates the display
                                System.out.println(redColor + "Invalid input, try again" + resetColor); // Print an error message for invalid input with the color red
                            }
                        } catch (Exception e) {
                            game.DisplayValues(); // Updates the display
                            System.out.println(redColor + "Invalid input, try again" + resetColor); // Print an error message for invalid input with the color red
                        }
                    }
                    
                }
            }
            
            int forcedCategoryToChoose = -1; // Stores the category that the player is forced to choose
            // Checks if the player rolled a Yahtzee and gives them points if they did
            if(scoreboard.scoreYahtzee(dice) > 50) {
                scoreboard.ChooseCategory(13, dice); // Force the player to choose the Yahtzee category (index 13) and assign points
                // I use dice 1's value because all the dice will be the same if they have a yahtzee so it doesn't matter which dice is used
                if (!scoreboard.isCategoryUsed(scoreboard.scores[dice[1].getValue() - 1])) { // Check if the category corresponding to the value of dice[1] is unused in the scoreboard       
                    forcedCategoryToChoose = dice[1].getValue(); // If the category is unused, store the value of dice[1] as the forced category to choose
                }                
            }

            while(true) {
                // Player chooses a category to score the dice in
                System.out.println("Pick a category " + lightBlueColor + "(1-13)" + resetColor); // Print brackets to light blue
                String response = scanner.nextLine(); // Get the players input
                int index;
                try { // Try to convert the players choose from string to int then if within choose range choose that category
                    index = Integer.parseInt(response); // Convert input to an int
        
                    if(forcedCategoryToChoose == -1) { // If no forced category is present
                        if(index >= 0 && index <= 13) {
                            // If the category is valid, the score is added to the scoreboard and displayed
                            if(scoreboard.ChooseCategory(index, dice)) { 
                                game.DisplayValues(); // Updates the display
                                break; // Category chosen so break out of the choosing loop
                            } else {
                                // If the category has already been scored, the player is prompted to choose again
                                game.DisplayValues(); // Updates the display
                                System.out.println(redColor + "Failed to choose that category please try again" + resetColor); // Makes the line of text red
                            }
                        } else {
                            game.DisplayValues();
                            System.out.println(redColor + "Number is not within category range, choose again" + resetColor); // Makes the line of text red
                        }
                    } else { // If there is a forced category
                        if(index == forcedCategoryToChoose) {
                            scoreboard.ChooseCategory(index, dice); // The player is forced to choose the forced category
                            game.DisplayValues(); // Updates the display
                            break; // Category chosen so break out of the choosing loop
                        } else {
                            game.DisplayValues(); // Updates the display
                            System.out.println(redColor + "You cant choose that category, you must choose category " + forcedCategoryToChoose + resetColor); // If it fails, inform the player and repeat until they choose a valid category, Makes the line of text red
                        }
                    }
        
                } catch (Exception e) { // If it fails tell the player and then repeat until they choose a valid category
                    game.DisplayValues(); // Updates the display
                    System.out.println(redColor + "Invalid Character choose again" + resetColor); // Makes the line of text red
                } 
            }
            // Put all the dice back on the table
            for (int i = 0; i < game.keepDice.length; i++) {
                game.keepDice[i] = false;
            }
        } else { // If the player isn't a human run the ai's code        
            // This loop runs for 3 turns or until the bot gets a joker
            for (game.turn = 0; game.turn < 3 && hasJoker == false; game.turn++) {
        
                game.RollDice(); // Roll the dice
                
                game.DisplayValues(); // Display the values of the dice
            
                int[] count = new int[6]; // Declare an array of integers to hold the counts of dice values
                int maxCount = 0; // variable to hold the maximum frequency of any dice value
                int maxCountValue = 0; // variable to hold the dice value with the maximum frequency
                int hasThreeOfAKind = -1; // sets it to -1 which is false any other number is the dice value.
                int[] hasPair = {-1, -1}; // sets both to -1, which is false, and will hold the values of the two pairs if they exist.

                // Count the frequency of each dice value and get the value and number of which dice has the highest frequency
                for (Die d : dice) {
                    int value = d.getValue();
                    count[value - 1]++;
                    if (count[value - 1] > maxCount) {
                        maxCount = count[value - 1];
                        maxCountValue = value;
                    }
                }

                // Check for three of a kind and pairs
                for (int i = 0; i < count.length; i++) {
                    if (count[i] >= 3) {
                        hasThreeOfAKind = i + 1;
                    } else if (count[i] == 2) {
                        if (hasPair[0] == -1) { // first pair found
                            hasPair[0] = i + 1;
                        } else { // second pair found
                            hasPair[1] = i + 1;
                        }
                    }
                }

               
                if (scoreboard.scoreYahtzee(dice) > 50) { // Check if the score for Yahtzee using the current dice is greater than 50
                    hasJoker = true; // If the score is greater than 50, set the variable hasJoker to true
                    break; // Exit the loop and skip to choosing category's
                }
                
                
            
                // If this is not the last turn, choose the best category to go for based on the current dice values
                if(game.turn != 2) {
                    switch(bestCategoriesToGoFor(dice)) { // Gets the best category to aim for based on bot difficulty and dice, then run the case related to the best category
                        case 1: 
                            // Category 1: Ones
                            // Keep dice with a value of 1 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                game.DisplayValues(); // Display the values of the dice
                                if(dice[f].getValue() == 1 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 1 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 2: 
                            // Category 2: Twos
                            // Keep dice with a value of 2 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if(dice[f].getValue() == 2 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 2 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 3: 
                            // Category 3: Threes
                            // Keep dice with a value of 3 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if(dice[f].getValue() == 3 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 3 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 4: 
                            // Category 4: Fours
                            // Keep dice with a value of 4 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if(dice[f].getValue() == 4 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 4 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 5:  
                            // Category 5: Fives
                            // Keep dice with a value of 5 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if(dice[f].getValue() == 5 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 5 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 6: 
                            // Category 6: Sixes
                            // Keep dice with a value of 6 and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if(dice[f].getValue() == 6 && game.keepDice[f] == false) {
                                    AiWait();
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != 6 && game.keepDice[f] == true) {
                                    AiWait();
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 7: 
                            // Category 7: 3 of a kind
                            // Keep dice with the maximum count value and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if (dice[f].getValue() == maxCountValue && game.keepDice[f] == false) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != maxCountValue && game.keepDice[f] == true) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 8: 
                            // Category 8: 4 of a kind
                            // Keep dice with the maximum count value and un-keep the rest and wait between moving a dice to make it look more human and only moves the dice if necessary
                            for (int f = 0; f < dice.length; f++) {
                                if (dice[f].getValue() == maxCountValue && game.keepDice[f] == false) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != maxCountValue && game.keepDice[f] == true) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Display the updated dice values
                            }
                        break; // Go to the next roll
                        case 9:
                            // Category 9: Full House
                            int maxNumber = -1; // A reference to the first highest max number
                            int maxNumber2 = -1; // A reference to the second highest max number
                            
                            // Iterate over the dice array
                            for (int i = 0; i < dice.length; i++) {
                                int value = dice[i].getValue(); // Get the value of the current dice
                                
                                // Check if the value is greater than the current maximum number
                                // Also, ensure that it's not equal to certain excluded values
                                if (value > maxNumber && value != hasThreeOfAKind && value != hasPair[0] && value != hasPair[1]) {
                                    maxNumber2 = maxNumber; // Update the second maximum number with the previous maximum
                                    maxNumber = value; // Update the maximum number with the new value
                                }
                            }

                            // Check if there is a three of a kind without any pairs, or a pair without a three of a kind
                            if ((hasThreeOfAKind > -1 && hasPair[0] == -1 && hasPair[1] == -1) || (hasPair[0] > -1 && hasPair[1] == -1 && hasThreeOfAKind == -1) || (hasPair[0] == -1 && hasPair[1] > -1 && hasThreeOfAKind == -1)) { // only have a three and no pairs, only one pair and no three.
                                maxNumber2 = -1; // Reset the maximum number 2 value if it only needs one number
                            } else if (hasThreeOfAKind == -1 && hasPair[0] == -1 && hasPair[1] == -1) { // If doesn't have anything
                                // Using both the max Number values so leave them alone
                            } else {
                                maxNumber = -1; // Reset the maximum number value if other combinations are present
                                maxNumber2 = -1; // Reset the maximum number 2 value if other combinations are present
                            }
                        
                            // Check if you already have a full house; if so, break out so it can choose the category
                            if (hasThreeOfAKind != -1 && (hasPair[0] != -1 || hasPair[1] != -1)) {
                                game.turn = 3; // End the turns to skip to the category selection
                                break; // Breaks out to choose a category
                            }

                            // Count the occurrences of each dice value in the hand that are kept
                            count = new int[6];
                            for (int f = 0; f < dice.length; f++) {
                                if(game.keepDice[f] == true) {
                                    count[dice[f].getValue()-1]++;
                                }
                            }
                    
                            // Keep dice that match the full house pattern or the maximum count value, reroll the others
                            for (int i = 0; i < dice.length; i++) {
                                int value = dice[i].getValue(); // Get a reference to the value

                                // Check if the current value matches the conditions to be kept:
                                // - Matches the value of the three of a kind and the count is less than 3
                                // - Matches the value of one of the pairs and the count is less than 2
                                // - Matches the one of the max numbers values
                                // - The dice is not being kept from before
                                if (((value == hasThreeOfAKind && count[dice[i].getValue()-1] < 3) || 
                                    (value == hasPair[0] && count[dice[i].getValue()-1] < 2) || 
                                    (value == hasPair[1] && count[dice[i].getValue()-1] < 2) || 
                                    value == maxNumber || value == maxNumber2) && !game.keepDice[i]) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[i] = true; // Keep the dice
                                    count[dice[i].getValue()-1]++; // Increase the count for the dice value
                                    game.DisplayValues(); // Display the updated dice values
                                }
                                // Check if the current value matches the conditions to be rerolled:
                                // - Does not match the value of the three of a kind and the count is greater than 3
                                // - Does not match the value of any of the pairs and the count is greater than 2
                                // - Does not match any of the max numbers values
                                // - The dice is still being kept from before
                                else if (((value != hasThreeOfAKind && count[dice[i].getValue()-1] > 3) && 
                                            (value != hasPair[0] && count[dice[i].getValue()-1] > 2) && 
                                            (value != hasPair[1] && count[dice[i].getValue()-1] > 2) && 
                                            value != maxNumber && value != maxNumber2) && game.keepDice[i]) {
                                    AiWait(); // Wait for a bit
                                    game.keepDice[i] = false; // UnKeep the dice
                                    count[dice[i].getValue()-1]--; // Decrease the count for the dice value
                                    game.DisplayValues(); // Display the updated dice values
                                }
                            }
                        break; // Go to the next roll
                        case 10: 
                            // Category 10: Small Straight
                            int levelOfStraight; // holds what level of straight the bots aiming for 0 is 1-4, 1 is 2-5, and 2 is 3-6

                            // Determine the level of straight to aim for based on the counts of certain dice values
                            if (count[3] > 0 && count[2] > 0) { // Aim for the middle values (4, 3) first as then you could get a higher or lower straight
                                levelOfStraight = 1;
                            } else if (count[5] > 0 && count[4] > 0) { // Then aim for a larger straight
                                levelOfStraight = 2;
                            } else { // Otherwise just aim for a smaller straight
                                levelOfStraight = 0;
                            }
                            
                            // Check if you already have a small straight. if so, break out so it can choose the category
                            if ((count[0] >= 1 && count[1] >= 1 && count[2] >= 1 && count[3] >= 1) || (count[1] >= 1 && count[2] >= 1 && count[3] >= 1 && count[4] >= 1) || (count[2] >= 1 && count[3] >= 1 && count[4] >= 1 && count[5] >= 1)) {
                                game.turn = 3; // End the turns to skip to the category selection
                                break; // Breaks out to choose a category
                            }
                            
                            count = new int[6]; // Clear the count array
                            // Keep count of dice values that are being kept
                            for (int f = 0; f < dice.length; f++) {
                                if (game.keepDice[f] == true) {
                                    count[dice[f].getValue()-1]++; 
                                }
                            }
                            
                            if (levelOfStraight == 0) { // If you have a smaller straight
                                // Iterate over each dice
                                for (int f = 0; f < dice.length; f++) {
                                    // Check if dice value is between 1 and 4 (inclusive), and the dice is not marked for keeping, and there are no existing dice with the same value
                                    if (dice[f].getValue() >= 1 && dice[f].getValue() <= 4 && game.keepDice[f] == false && count[dice[f].getValue()-1] == 0) {
                                        AiWait();
                                        // Mark the dice for keeping
                                        game.keepDice[f] = true;
                                        // Increment the count for that dice value
                                        count[dice[f].getValue()-1]++;
                                    } else if ((dice[f].getValue() > 4 || count[dice[f].getValue()-1] > 1) && game.keepDice[f] == true) {
                                        AiWait();
                                        // Un-mark the dice for keeping
                                        game.keepDice[f] = false;
                                        // Decrement the count for that dice value
                                        count[dice[f].getValue()-1]--;
                                    }
                                    game.DisplayValues(); // Update the display
                                }
                            } else if (levelOfStraight == 1) { // If you have a middle straight
                                // Iterate over each dice
                                for (int f = 0; f < dice.length; f++) {
                                    // Check if dice value is between 2 and 5 (inclusive), and the dice is not marked for keeping, and there are no existing dice with the same value
                                    if (dice[f].getValue() >= 2 && dice[f].getValue() <= 5 && game.keepDice[f] == false && count[dice[f].getValue()-1] == 0) {
                                        AiWait();
                                        // Mark the dice for keeping
                                        game.keepDice[f] = true;
                                        // Increment the count for that dice value
                                        count[dice[f].getValue()-1]++;
                                    } else if ((dice[f].getValue() < 2 || dice[f].getValue() > 5 || count[dice[f].getValue()-1] > 1) && game.keepDice[f] == true) {
                                        AiWait();
                                        // Un-mark the dice for keeping
                                        game.keepDice[f] = false;
                                        // Decrement the count for that dice value
                                        count[dice[f].getValue()-1]--;
                                    }
                                    game.DisplayValues(); // Update the display
                                }
                            } else if (levelOfStraight == 2) { // If you have a larger straight
                                // Iterate over each dice
                                for (int f = 0; f < dice.length; f++) {
                                    // Check if dice value is between 3 and 6 (inclusive), and the dice is not marked for keeping, and there are no existing dice with the same value
                                    if (dice[f].getValue() >= 3 && dice[f].getValue() <= 6 && game.keepDice[f] == false && count[dice[f].getValue()-1] == 0) {
                                        AiWait();
                                        // Mark the dice for keeping
                                        game.keepDice[f] = true;
                                        // Increment the count for that dice value
                                        count[dice[f].getValue()-1]++;
                                    } else if ((dice[f].getValue() < 3 || count[dice[f].getValue()-1] > 1) && game.keepDice[f] == true) {
                                        AiWait();
                                        // Un-mark the dice for keeping
                                        game.keepDice[f] = false;
                                        // Decrement the count for that dice value
                                        count[dice[f].getValue()-1]--;
                                    }
                                    game.DisplayValues(); // Update the display
                                }
                            }
                        break; // Go to the next roll
                        case 11: 
                            // Category 11: High Straight
                            boolean highStraight; // holds whether the bots aiming for a lower or higher straight, false is 1-5, true is 2-6

                            // Check if a high straight (5, 6) is possible based on the dice counts
                            if (count[4] > 0 && count[5] > 0) {
                                highStraight = true;
                            } else { // other wise just go for a low straight
                                highStraight = false;
                            }

                            // Check if you already have a high straight. if so, break out and choose the category
                            if ((count[0] >= 1 && count[1] >= 1 && count[2] >= 1 && count[3] >= 1 && count[4] >= 1) || (count[1] >= 1 && count[2] >= 1 && count[3] >= 1 && count[4] >= 1 && count[5] >= 1)) {
                                game.turn = 3; // End the turns to skip to the category selection
                                break; // Breaks out to choose a category
                            }
                            
                            count = new int[6]; // Clear the count array
                            // Keep count of dice values that are being kept
                            for (int f = 0; f < dice.length; f++) {
                                if (game.keepDice[f] == true) {
                                    count[dice[f].getValue()-1]++;
                                }
                            }
                            
                            if (highStraight) { // If you have a higher straight
                                // Iterate over each dice
                                for (int f = 0; f < dice.length; f++) {
                                    // Check if dice value is greater than 1, not marked for keeping, and there are no existing dice with the same value
                                    if (dice[f].getValue() > 1 && game.keepDice[f] == false && count[dice[f].getValue()-1] == 0) {
                                            AiWait();
                                            // Mark the dice for keeping
                                            game.keepDice[f] = true;
                                            // Increment the count for that dice value
                                            count[dice[f].getValue()-1]++;
                                    } else if ((dice[f].getValue() == 1 || count[dice[f].getValue()-1] > 1) && game.keepDice[f] == true) {
                                            AiWait();
                                            // Un-mark the dice for keeping
                                            game.keepDice[f] = false;
                                            // Decrement the count for that dice value
                                            count[dice[f].getValue()-1]--;
                                    }
                                    game.DisplayValues(); // Update the display
                                }
                            } else { // If you have a lower straight
                                // Iterate over each dice
                                for (int f = 0; f < dice.length; f++) {
                                    // Check if dice value is less than 6, not marked for keeping, and there are no existing dice with the same value
                                    if (dice[f].getValue() < 6 && game.keepDice[f] == false && count[dice[f].getValue()-1] == 0) {
                                        AiWait();
                                        // Mark the dice for keeping
                                        game.keepDice[f] = true;
                                        // Increment the count for that dice value
                                        count[dice[f].getValue()-1]++;
                                    } else if ((dice[f].getValue() == 6 || count[dice[f].getValue()-1] > 1) && game.keepDice[f] == true) {
                                        AiWait();
                                        // Un-mark the dice for keeping
                                        game.keepDice[f] = false;
                                        // Decrement the count for that dice value
                                        count[dice[f].getValue()-1]--;
                                    }
                                    game.DisplayValues(); // Update the display
                                }
                            }   
                        break; // Go to the next roll
                        case 12: 
                            // Category 12: Chance
                            for (int f = 0; f < dice.length; f++) {
                                // Check if dice value is greater than or equal to 4 and not marked for keeping
                                if (dice[f].getValue() >= 4 && game.keepDice[f] == false) {
                                    AiWait();
                                    // Mark the dice for keeping
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() < 4 && game.keepDice[f] == true) {
                                    AiWait();
                                    // Un-mark the dice for keeping
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                        case 13:  
                            // Category 13: Yahtzee                 
                            for (int f = 0; f < dice.length; f++) {
                                // Check if the dice value is equal to the maximum count value and not marked for keeping
                                if (dice[f].getValue() == maxCountValue && game.keepDice[f] == false) {
                                    AiWait();
                                    // Mark the dice for keeping
                                    game.keepDice[f] = true;
                                } else if (dice[f].getValue() != maxCountValue && game.keepDice[f] == true) {
                                    AiWait();
                                    // Un-mark the dice for keeping
                                    game.keepDice[f] = false;
                                }
                                game.DisplayValues(); // Update the display
                            }
                        break; // Go to the next roll
                    }
                }
                AiWait(); // Wait a bit
            }

            if(hasJoker == true) { // if they have a joker give them the 100 extra yahtzee points
                scoreboard.ChooseCategory(13, dice);
                AiWait(); // Wait a bit
            }

            if (hasJoker == true && !scoreboard.isCategoryUsed(scoreboard.scores[dice[1].getValue() - 1])) { // Checks if the required category has been used yet. Etc have a joker and its 1's then check if the 1's category has been used.
                scoreboard.ChooseCategory(dice[1].getValue(), dice); // Choose the required category
            } else {
                scoreboard.ChooseCategory(bestCategoriesToGoFor(dice), dice); // If its already used then choose the best category
            }
            
            game.DisplayValues(); // Update the display
            
            for (int i = 0; i < game.keepDice.length; i++) {
                game.keepDice[i] = false; // remove all dice from hand
            }
        }
    }

    public void AiWait() { // A function that is called every time before the ai wants to make a move so the player can see what is happening 
        try { // Try because sometimes it fails
            Thread.sleep(1000); // 1 seconds = 1000 milliseconds
        } catch (InterruptedException e) {
        }
    }

    // This method takes an array of Dice objects and returns the best category to go for. Used to tell the ai what it should aim for
    public int bestCategoriesToGoFor(Die[] diceValues) {
        
        // Calculate the scores for each category based on the given Dice values.
        int[] calculatedScores = scoreboard.calculateScores(diceValues);

        // Initialize variables for the best score and best move.
        int bestScore = -1;
        int bestMove = -1;
        // Check the botDifficulty level to determine how to choose the best category.
        if(botDifficulty == 1) { // Normal
            // Loop through the scores array and find the best category to go for based on scores
            for (int i = 0; i < calculatedScores.length; i++) {
                if (calculatedScores[i] > bestScore && !scoreboard.isCategoryUsed(scoreboard.scores[i])) {
                    // Decrease the score for the "Chance" category so it isn't always chosen at the start.
                    calculatedScores[11] /= 2;
                    // Update the best score and best move.
                    bestScore = calculatedScores[i];
                    bestMove = i;
                }
            }
            return bestMove + 1; // Return the bestMove + 1 because the array goes from 0-12 and we want 1-13

        } else if(botDifficulty == 2) { // Hard

            int[] freq = new int[7]; // array to hold the frequency of each dice value
            int maxFreq = 0; // variable to hold the maximum frequency of any dice value
            int maxFreqValue = 0; // variable to hold the dice value with the maximum frequency
            int maxFreqWithTheLowestValue = 0; // variable to hold the dice value with the maximum frequency
            int[] hasPair = {-1, -1}; // sets both to -1, which is false, and will hold the values of the two pairs if they exist.

            // Count the frequency of each dice value
            for (Die d : diceValues) {
                int value = d.getValue(); // Get the value of the current die
                freq[value]++; // Increment the frequency count for the current value
            
                // Update the maximum frequency and its corresponding value if its frequency is higher
                if (freq[value] > maxFreq) {
                    maxFreq = freq[value];
                    maxFreqValue = value;
                }
            
                // Update the maximum frequency with the lowest value if its frequency is the same as the max frequency and the value is less than the maximum frequency value
                if (freq[value] == maxFreq && value < maxFreqValue) {
                    maxFreqWithTheLowestValue = value;
                }
            }

            // Check for three of a kind and pairs
            for (int i = 0; i < freq.length; i++) {
                if (freq[i] == 2) {
                    if (hasPair[0] == -1) { // first pair found
                        hasPair[0] = i + 1;
                    } else { // second pair found
                        hasPair[1] = i + 1;
                    }
                }
            }            

            if (scoreboard.scoreYahtzee(diceValues) > 0 && !scoreboard.isCategoryUsed(scoreboard.scores[12])) {
                return 13; // Return category number 13 (Yahtzee) if AI can score a Yahtzee and Yahtzee category is available
            }
            
            if (scoreboard.scoreSmallStraight(diceValues) > 0) { // If the ai has a small straight
                if (game.turn < 2) { // If it's the first or second turn
                    //If the category is unused choose it
                    if (!scoreboard.isCategoryUsed(scoreboard.scores[10])) {
                        return 11; 
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[9])) {
                        return 10;
                    }
                } else { // It's the third turn or later
                    //If the category is unused choose it
                    if (scoreboard.scoreLargeStraight(diceValues) > 0 && !scoreboard.isCategoryUsed(scoreboard.scores[10])) {
                        return 11;
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[9])) {
                        return 10; 
                    }
                }
            }

            if (scoreboard.scoreFullHouse(diceValues) > 0 && !scoreboard.isCategoryUsed(scoreboard.scores[8])) { // If AI can score a Full House and Full House category is available
                return 9;
            }
            
            if (scoreboard.scoreThreeOfAKind(diceValues) > 0 && maxFreqValue > 3 && (!scoreboard.isCategoryUsed(scoreboard.scores[8]) || !scoreboard.isCategoryUsed(scoreboard.scores[7]) || !scoreboard.isCategoryUsed(scoreboard.scores[6]))) { // If the ai has a three of a kind and the three of a kind's value is greater than 3 and either three of a kind, four of a kind, or full house is unused.
                if (game.turn < 2) { // If it's the first or second turn
                    //If the category is unused choose it
                    if (!scoreboard.isCategoryUsed(scoreboard.scores[7])) {
                        return 8;
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[8])) {
                        return 9;
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[6])) {
                        return 7;
                    }
                } else { // It's the third turn or later
                    // If the category is unused and you have it, choose the category
                    if (scoreboard.scoreFullHouse(diceValues) > 0 && !scoreboard.isCategoryUsed(scoreboard.scores[8])) {
                        return 9;
                    } else if (scoreboard.scoreFourOfAKind(diceValues) > 0 && !scoreboard.isCategoryUsed(scoreboard.scores[7])) {
                        return 8; 
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[6])) {
                        return 7;
                    } else if (!scoreboard.isCategoryUsed(scoreboard.scores[maxFreqValue - 1])) {
                        return maxFreqValue; // Return the category corresponding to the maximum frequency value if it is available
                    }
                }
            }

            if (hasPair[0] > -1 && hasPair[1] > -1 && game.turn < 2 && !scoreboard.isCategoryUsed(scoreboard.scores[8]) && (!scoreboard.isCategoryUsed(scoreboard.scores[hasPair[0] - 1]) || !scoreboard.isCategoryUsed(scoreboard.scores[hasPair[1] - 1]))) {
                return 9; // Return category number 9 (Full House) if the AI player has a pair, it's the first or second turn, Full House category is available, and there are available categories for both pairs
            }
            
            if (((freq[1] >= 1 && freq[2] >= 1 && freq[3] >= 1) || (freq[2] >= 1 && freq[3] >= 1 && freq[4] >= 1) || (freq[3] >= 1 && freq[4] >= 1 && freq[5] >= 1) || (freq[4] >= 1 && freq[5] >= 1 && freq[6] >= 1)) && game.turn < 2 && !scoreboard.isCategoryUsed(scoreboard.scores[9])) {
                return 10; // Return category number 10 (Small Straight) if there is a small straight combination, it's the first or second turn, and Small Straight category is available
            }
            
            if (maxFreq > 1 && !scoreboard.isCategoryUsed(scoreboard.scores[maxFreqValue - 1])) {
                if (maxFreqValue > 3) {
                    return maxFreqValue; // Return the category corresponding to the maximum frequency value if it's greater than 3 and the category is available
                } else {
                    if(game.turn > 1 && !scoreboard.isCategoryUsed(scoreboard.scores[11]) && maxFreq < 3 && maxFreqValue > 4) {
                        return 12; // If its the third turn or later and the chance category is unused and if the frequency of the max value is less than three and the value of the max frequency is greater than 4
                    }
                    if (maxFreqWithTheLowestValue == maxFreqValue) {
                        return maxFreqWithTheLowestValue; // Return the category corresponding to the maximum frequency with the lowest value if it's equal to the maximum frequency value and the category is available
                    } else {
                        return maxFreqValue; // Return the category corresponding to the maximum frequency value if the above conditions are not met
                    }
                }
            } else if (maxFreq < 3 && game.turn > 1 && scoreboard.scores[11] == -1) {
                return 12; // Return category number 12 (Chance) if the maximum frequency is less than 3, it's the third turn or later, and Chance category is available
            }
            
            // Backup incase it cant find any category
            calculatedScores[11] /= 2; // Reduce the score of the Large Straight category by half to consider it as a backup move
            for (int i = 0; i < calculatedScores.length; i++) {
                if (calculatedScores[i] > bestScore && !scoreboard.isCategoryUsed(scoreboard.scores[i])) {
                    // Update the best score and best move.
                    bestScore = calculatedScores[i];
                    bestMove = i;
                }
            }
            return bestMove + 1; // Return the bestMove + 1 because the array goes from 0-12 and we want 1-13
        }
        return bestMove; // Returns the default -1 which means it didn't find the best category but this should never happen
    }

}
