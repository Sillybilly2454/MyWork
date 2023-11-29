import java.util.ArrayList;
import java.util.List;


public class Hand {

    // MEMBER VARIABLES
    // ================
    private List<Card> cardsInHand = new ArrayList<Card>();
 
    // CONSTRUCTOR
    // ===========
    public Hand() {
       // content here ...
    }
 
    // METHODS
    // =======
    public void addCard(Card cardToAdd) {
        cardsInHand.add(cardToAdd);
    }
 
    public String showHand(boolean cardOne) {
        String theHand = " [ ...hidden... ]\n";
        if (cardOne == true) {
           theHand = " [ " + cardsInHand.get(0).printCardVal() + " ]\n";
        }
        for (int i = 1; i < cardsInHand.size(); ++i) {
           theHand=theHand+" [ "+cardsInHand.get(i).printCardVal()+" ]\n";
        }
        return theHand;
    }
 
    public int handValue() {
        int handTotal = 0;
        int aceCount = 0;
        for (int i = 0; i < cardsInHand.size(); ++i) {
            if (cardsInHand.get(i).get_cardRank() <= 10) {
                handTotal = handTotal + cardsInHand.get(i).get_cardRank();
             } else if (cardsInHand.get(i).get_cardRank() <= 13) {
              handTotal = handTotal + 10;
           } else {
              handTotal = handTotal + 11;
              aceCount = aceCount + 1;
           }
        }
        while ((handTotal > 21) && (aceCount > 0)) {
           handTotal = handTotal - 10;
           aceCount = aceCount - 1;
        }
        return handTotal;
    }
 
    public boolean busted() {
       if(handValue() > 21) {
        return true;
       } else {
        return false;
       }
    }
 }