package com.cardgamesrus.gofish;

import java.util.Random;

public class Deck {

    // M E M B E R     V A R I A B L E S
    private final Card cards[];
    private       int  topCard;
    private final int  numCards;

    // C O N S T R U C T O R
    public Deck(int deckSize) {
        numCards = deckSize;
        cards = new Card[numCards];
        for (int i = 0; i < numCards; i++) cards[i] = new Card(i);
        topCard = deckSize - 1;
    }

    // M E T H O D S
    //==========================THIS METHOD SIMPLY SHUFFLES THE DECK================================
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
    //====================THIS METHOD SIMPLY PICKS A RANDOM CARD IN THE DECK========================
    private int randomCard() {
        Random randInt = new Random();
        int r = randInt.nextInt();
        r = Math.abs(r);
        return r % numCards;
    }
    //=================THIS METHOD DEALS A CARD FROM THE TOP OF THE DECK============================
    public Card deal() {
        topCard--;
        return cards[topCard + 1];
    }
    //========================THIS METHOD SIMPLY GETS THE DECKSIZE==================================
    public int deckSize() { return topCard + 1;	}
}