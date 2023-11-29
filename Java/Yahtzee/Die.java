import java.util.Random;

public class Die {
    private int dieValue; // holds the dice Value
    
    // This method randomly rolls the dice and sets the die value
    public void Roll() {
        dieValue = new Random().nextInt(6) + 1;// Creates a new random number between 0-5 and then + 1, so its 1-6
    }

    // This method returns the value of the die
    public int getValue() {
        return dieValue;
    }
}