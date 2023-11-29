import java.util.Random;

public class Deck {
    
    // MEMBER VARIABLES
   // ================
   private final Card cards[];
   private int topCard;
   private final int numCards;

   // CONSTRUCTOR
   // ===========
   public Deck(int deckSize) {
    numCards = deckSize;
    cards = new Card[numCards];
    for (int i = 0; i < numCards; i++) {
       cards[i] = new Card(i);
    }
    topCard = deckSize - 1;
   }

   // METHODS
   // =======
   public void shuffle() {
    int i, j, k;
    Card temp;
    for (i = 0; i < 1000; i++) {
       j = randomCard();
       k = randomCard();
       temp = cards[j];
       cards[j] = cards[k];
       cards[k] = temp;
    }
   }

   public Card deal() {
    topCard--;
    return cards[topCard + 1];
   }

   private int randomCard() {
    Random randInt = new Random();
    int r = randInt.nextInt();
    r = Math.abs(r);
    return r % numCards;
   }
}
