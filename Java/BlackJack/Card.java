public class Card {
    /* Variables */
    private String suitName;        //eg 'Diamond'
    private String cardName;            //eg 'King'
    private int cardRank;              //eg '10'
    private String suitColour;      //eg 'red'
    private int suitRank;           //eg '3'


    /* Constructor */
    public Card(int cardNum) {
        if (cardNum < 52) {
            suitRank = (cardNum / 13) + 1;
            switch (suitRank) {
                case 1:
                    suitName = "Spade";
                    suitColour = "Black";
                break;
                case 2:
                    suitName = "Club";
                    suitColour = "Black";
                break;
                case 3:
                    suitName = "Diamond";
                    suitColour = "Red";
                break;
            default:
                suitName = "Heart";
                suitColour = "Red";
            }

            cardRank = (cardNum % 13) + 2;
            if (cardRank < 10) {
                cardName = Integer.toString(cardRank);
            } else if (cardRank == 10) {
                cardName = "Ten";
            } else if (cardRank == 11) {
                cardName = "Jack";
            } else if (cardRank == 12) {
                cardName = "Queen";
            } else if (cardRank == 13) {
                cardName = "King";
            } else {
                cardName = "Ace";
            } 
    } else if (cardNum < 54) {
        if (cardNum == 52) {
          suitColour = "Colour";
          cardRank = 16;
        } else {
          suitColour = "Black and White";
          cardRank = 15;
        }
        suitName = "NIL";
        suitRank = 0;
        cardName = "Joker";
      } else {
        suitColour = "NIL";
        suitName = "NIL";
        suitRank = 0;
        cardName = "NULL";
        cardRank = 0;
      }
    }

    /* Methods */


    public String printCardVal() {
        
        if ((cardRank >= 2) && (cardRank <= 14)) {
            return cardName + " of " + suitName + "s";
          } else if (cardRank > 14) {
            return suitColour + " Joker";
          } else {
            return "Card does not exist";
          }
    }

    public int get_cardRank() {
        return cardRank;
     }
}
