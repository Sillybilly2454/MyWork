import java.util.Arrays;

public class Scoreboard {
    public int[] scores = new int[13]; // A reference to all the players scores
    public int bonus = -1; // A reference to the bonus variable and sets to -1 for unused

    public Scoreboard() {
        Arrays.fill(scores, -1); // Sets all the category to -1 which means the category hasn't been used yet.
    }

    public boolean ChooseCategory(int choice, Die[] dice) { // A function which try's to choose the category and assign points, if it succeeds then return true otherwise if it fails returns false.
        switch(choice) { 
            case 1:
                // Check if category "ones" is already used
                if(isCategoryUsed(scores[0])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "ones"
                scores[0] = countDice(dice, 1);
                break;
            case 2:
                // Check if category "twos" is already used
                if(isCategoryUsed(scores[1])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "twos"
                scores[1] = countDice(dice, 2);
                break;
            case 3:
                // Check if category "threes" is already used
                if(isCategoryUsed(scores[2])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "threes"
                scores[2] = countDice(dice, 3);
                break;
            case 4:
                // Check if category "fours" is already used
                if(isCategoryUsed(scores[3])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "fours"
                scores[3] = countDice(dice, 4);
                break;
            case 5:
                // Check if category "fives" is already used
                if(isCategoryUsed(scores[4])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "fives"
                scores[4] = countDice(dice, 5);
                break;
            case 6:
                // Check if category "sixes" is already used
                if(isCategoryUsed(scores[5])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "sixes"
                scores[5] = countDice(dice, 6);
                break;
            case 7:
                // Check if category "threeOfAKind" is already used
                if(isCategoryUsed(scores[6])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "threeOfAKind"
                scores[6] = scoreThreeOfAKind(dice);
                break;
            case 8:
                // Check if category "fourOfAKind" is already used
                if(isCategoryUsed(scores[7])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "fourOfAKind"
                scores[7] = scoreFourOfAKind(dice);
                break;
            case 9:
                // Check if category "fullHouse" is already used
                if(isCategoryUsed(scores[8])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "fullHouse"
                scores[8] = scoreFullHouse(dice);
                break;
            case 10:
                // Check if category "smallStraight" is already used
                if(isCategoryUsed(scores[9])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "smallStraight"
                scores[9] = scoreSmallStraight(dice);
                break;
            case 11:
                // Check if category "largeStraight" is already used
                if(isCategoryUsed(scores[10])) {
                    return false; // Category is already used, cannot choose it again
                }
                // Calculate the score for category "largeStraight"
                scores[10] = scoreLargeStraight(dice);
                break;
            case 12:
                // Check if category "chance" is already used
                if(isCategoryUsed(scores[11])) {
                    return false;  // Category is already used, cannot choose it again
                }
                // Calculate the score for category "chance"
                scores[11] = scoreChance(dice);
                break;
            case 13:
                // Check if yahtzee has already been scored
                if(scores[12] == 0) {
                    return false; // Yahtzee has not been scored, cannot choose it again
                }
                // Calculate the score for the yahtzee category
                if(scoreYahtzee(dice) == 0) {
                    scores[12] = 0; // No yahtzee, set score to 0
                } else if(scoreYahtzee(dice) == 50) {
                    scores[12] = 50; // Yahtzee score is 50
                } else {
                    scores[12] += 100; // Yahtzee score is increased by 100
                }
                break;
            default:
                return false; // Invalid category choice
        }
    
        // Update bonus score if necessary, if the bonus isn't used, and categories 1-6 are used
        if(!isCategoryUsed(bonus) && isCategoryUsed(scores[0]) && isCategoryUsed(scores[1]) && isCategoryUsed(scores[2]) && isCategoryUsed(scores[3]) && isCategoryUsed(scores[4]) && isCategoryUsed(scores[5])) {
            if(GetSum() >= 63) {
                bonus = 35; // Set bonus to 35 if sum of individual category scores is 63 or greater
            } else {
                bonus = 0; // Set bonus to 0 if sum of individual category scores is less than 63
            }
        }
        
        return true; // Category selection and scoring was successful
    }

    public int getTotalScore() { // Gets and returns the total score
        int totalScore = 0;
        // Add the score to the total score for each category if the category is been used 
        if (isCategoryUsed(scores[0])) {
            totalScore += scores[0];
        }
        if (isCategoryUsed(scores[1])) {
            totalScore += scores[1];
        }
        if (isCategoryUsed(scores[2])) {
            totalScore += scores[2];
        }
        if (isCategoryUsed(scores[3])) {
            totalScore += scores[3];
        }
        if (isCategoryUsed(scores[4])) {
            totalScore += scores[4];
        }
        if (isCategoryUsed(scores[5])) {
            totalScore += scores[5];
        }
        if (isCategoryUsed(scores[6])) {
            totalScore += scores[6];
        }
        if (isCategoryUsed(scores[7])) {
            totalScore += scores[7];
        }
        if (isCategoryUsed(scores[8])) {
            totalScore += scores[8];
        }
        if (isCategoryUsed(scores[9])) {
            totalScore += scores[9];
        }
        if (isCategoryUsed(scores[10])) {
            totalScore += scores[10];
        }
        if (isCategoryUsed(scores[11])) {
            totalScore += scores[11];
        }
        if (isCategoryUsed(scores[12])) {
            totalScore += scores[12];
        }
        if (isCategoryUsed(bonus)) {
            totalScore += bonus;
        }
        return totalScore; // Return the total score
    }

    public int GetSum() { // Gets the total of the first 6 categories
        int sum = 0;
        // Calculate the sum of scores for each category that has been used
        if (isCategoryUsed(scores[0])) {
            sum += scores[0];
        }
        if (isCategoryUsed(scores[1])) {
            sum += scores[1];
        }
        if (isCategoryUsed(scores[2])) {
            sum += scores[2];
        }
        if (isCategoryUsed(scores[3])) {
            sum += scores[3];
        }
        if (isCategoryUsed(scores[4])) {
            sum += scores[4];
        }
        if (isCategoryUsed(scores[5])) {
            sum += scores[5];
        }
        return sum; // Return the calculated sum
    }

    public boolean isCategoryUsed(int value) { // A function used to check if the category is used
        if(value > -1) {
            return true; // Category is used if the value is greater than -1
        } else {
            return false; // Category is not used if the value is -1 or less
        }
    }

    public int countDice(Die[] dice, int value) { 
        int sum = 0; // Initialize the sum variable to 0
        for (int i = 0; i < dice.length; i++) { // Iterate over each element in the dice array
            if (dice[i].getValue() == value) { // Check if the value of the current die matches the given value
                sum += value; // Add the value of the matching die to the sum
            }
        }
        return sum; // Return the sum of matching dice values
    }    

    public int scoreThreeOfAKind(Die[] dice) {
        int sum = 0; // Initialize the sum variable to 0
        
        int[] counts = new int[6]; // Keep count of dice values (assuming 6-sided dice)
        
        // Count the occurrences of each dice value
        for (int i = 0; i < dice.length; i++) {
            counts[dice[i].getValue() - 1]++; // Increment the count for the corresponding dice value
        }
        
        boolean hasThreeOfAKind = false; // variable to track if three of a kind is found
        
        // Check if there is at least one value with three or more occurrences
        for (int i = 0; i < counts.length; i++) {
            if (counts[i] >= 3) {
                hasThreeOfAKind = true; // Set the variable to true if three or more occurrences are found
                break; // Exit the loop since we only need to find one three of a kind
            }
        }
        
        if (!hasThreeOfAKind) {
            return 0; // No three of a kind found, return 0
        } else {
            // Calculate the sum of all dice values
            for (int i = 0; i < dice.length; i++) {
                sum += dice[i].getValue(); // Add the value of each dice to the sum
            }
        }
        
        return sum; // Return the sum of all dice values
    }    
    

    public int scoreFourOfAKind(Die[] dice) {
        int fourOfAKindSum = 0; // Initialize the sum variable for four of a kind to 0
        
        int[] counts = new int[6]; // Keep count of dice values (assuming 6-sided dice)
        
        // Count the occurrences of each dice value
        for (int i = 0; i < dice.length; i++) {
            counts[dice[i].getValue() - 1]++; // Increment the count for the corresponding dice value
        }
        
        boolean hasFourOfAKind = false; // variable to track if four of a kind is found
        
        // Check if there is at least one value with four or more occurrences
        for (int i = 0; i < counts.length; i++) {
            if (counts[i] >= 4) {
                hasFourOfAKind = true; // Set the variable to true if four or more occurrences are found
                break; // Exit the loop since we only need to find one four of a kind
            }
        }
        
        if (!hasFourOfAKind) {
            return 0; // No four of a kind found, return 0
        } else {
            // Calculate the sum of all dice values
            for (int i = 0; i < dice.length; i++) {
                fourOfAKindSum += dice[i].getValue(); // Add the value of each dice to the sum
            }
        }
        
        return fourOfAKindSum; // Return the sum of all dice values
    }    


    public int scoreFullHouse(Die[] dice) {
        if (scoreYahtzee(dice) > 50) {
            return 25; // Special case: Yahtzee scored, return 25
        }
    
        int[] counts = new int[6]; // Keep count of dice values (assuming 6-sided dice)
        for (int i = 0; i < dice.length; i++) {
            counts[dice[i].getValue() - 1]++; // Increment the count for the corresponding dice value
        }
    
        boolean hasThreeOfAKindFH = false; // variable to track if there is a three of a kind
        boolean hasPairFH = false; // variable to track if there is a pair
    
        // Check if there is at least one value with three occurrences and one value with two occurrences
        for (int i = 0; i < counts.length; i++) {
            if (counts[i] == 3) {
                hasThreeOfAKindFH = true; // Set the variable to true if three occurrences are found
            }
            if (counts[i] == 2) {
                hasPairFH = true; // Set the variable to true if two occurrences are found
            }
        }
    
        if (!hasThreeOfAKindFH || !hasPairFH) {
            return 0; // No full house found, return 0
        } else {
            return 25; // Full house scored, return 25
        }
    }    

    public int scoreSmallStraight(Die[] dice) {
        if(scoreYahtzee(dice) > 50) {
            return 30; // Special case: Yahtzee scored, return 30
        }
        
        int[] counts = new int[6]; // Keep count of dice values
        for (int i = 0; i < dice.length; i++) {
            counts[dice[i].getValue()-1]++;
        }
        
        // Check if there is a small straight (sequence of four consecutive dice values)
        if ((counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1) ||
            (counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1) ||
            (counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1)) {
            return 30; // Small straight scored, return 30
        } else {
            return 0; // No small straight found, return 0
        }
    }

    public int scoreLargeStraight(Die[] dice) {
        if(scoreYahtzee(dice) > 50) {
            return 40; // Special case: Yahtzee scored, return 40
        }
    
        int[] counts = new int[6]; // Keep count of dice values
        for (int i = 0; i < dice.length; i++) {
            counts[dice[i].getValue()-1]++;
        }
        
        // Check if there is a large straight (sequence of five consecutive dice values)
        if ((counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1) ||
            (counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1)) {
            return 40; // Large straight scored, return 40
        } else {
            return 0; // No large straight found, return 0
        }
    }

    public int scoreChance(Die[] dice) {
        int sum = 0;
        
        // Calculate the sum of all dice values
        for (int i = 0; i < dice.length; i++) {
            sum += dice[i].getValue();
        }
        
        return sum; // Return the sum as the score for the "Chance" category
    }

    public int scoreYahtzee(Die[] dice) {
        boolean isYahtzee = true; // variable to track if it's a Yahtzee
    
        // Check if all dice have the same value
        for (int i = 1; i < dice.length; i++) {
            if (dice[i].getValue() != dice[0].getValue()) {
                isYahtzee = false; // Set the variable to false if any value is different
                break; // Exit the loop since we only need to find one difference
            }
        }
    
        if (!isYahtzee) {
            return 0; // If not a Yahtzee, return 0
        }
    
        if (scores[12] < 0) {
            return 50; // If yahtzee variable is negative, return 50 (first Yahtzee scored)
        } else {
            return 100; // If yahtzee variable is non-negative, return 100 (additional Yahtzee scored)
        }
    }    

    //Ai Stuff

    public int[] calculateScores(Die[] diceValues) {
        int[] _scores = new int[13]; // Array to store scores for each category
        
        // Calculate the score for each category
        _scores[0] = countDice(diceValues, 1); // Score for Ones
        _scores[1] = countDice(diceValues, 2); // Score for Twos
        _scores[2] = countDice(diceValues, 3); // Score for Threes
        _scores[3] = countDice(diceValues, 4); // Score for Fours
        _scores[4] = countDice(diceValues, 5); // Score for Fives
        _scores[5] = countDice(diceValues, 6); // Score for Sixes
        _scores[6] = scoreThreeOfAKind(diceValues); // Score for Three of a Kind
        _scores[7] = scoreFourOfAKind(diceValues); // Score for Four of a Kind
        _scores[8] = scoreFullHouse(diceValues); // Score for Full House
        _scores[9] = scoreSmallStraight(diceValues); // Score for Small Straight
        _scores[10] = scoreLargeStraight(diceValues); // Score for Large Straight
        _scores[11] = scoreChance(diceValues); // Score for Chance
        _scores[12] = scoreYahtzee(diceValues); // Score for Yahtzee
    
        return _scores; // Return the scores array
    }
}
