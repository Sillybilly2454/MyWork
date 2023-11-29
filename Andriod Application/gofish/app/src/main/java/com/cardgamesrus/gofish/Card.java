package com.cardgamesrus.gofish;

import android.widget.ImageView;

public class Card {

    // M E M B E R     V A R I A B L E S
    private final String suitName;
    private final String cardName;
    private final int    cardRank;

    // Stores the image attached this card, created when card is drawn
    public ImageView cardImage;

    // C O N S T R U C T O R
    public Card(int cardNum) {
        int suitRank = (cardNum / 13) + 1;

        // Depending on the rank assigns a suitName
        switch (suitRank) {
            case 1:
                suitName = "Spade";
                break;
            case 2:
                suitName = "Club";
                break;
            case 3:
                suitName = "Diamond";
                break;
            default:
                suitName = "Heart";
        }

        // Assigns the card rank depending on the cardNumber (2-14)
        cardRank = (cardNum % 13) + 2;

        // Assign the card a name based on the rank.
        if (cardRank == 2) {
            cardName = "Two";
        } else if (cardRank == 3) {
            cardName = "Three";
        } else if (cardRank == 4) {
            cardName = "Four";
        } else if (cardRank == 5) {
            cardName = "Five";
        } else if (cardRank == 6) {
            cardName = "Six";
        } else if (cardRank == 7) {
            cardName = "Seven";
        } else if (cardRank == 8) {
            cardName = "Eight";
        } else if (cardRank == 9) {
            cardName = "Nine";
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
    }

    // M E T H O D S
    //====================================GETTERS and SETTERS=======================================
    public int    getCardRank()    { return cardRank;                           }
    public String printCardVal()   { return cardName;                           }


    // ====================================Functions================================================

    // Gets the name and suit name combined
    public String printCard() {
        if ((cardRank >= 2) && (cardRank <= 14)) {
            return cardName.toLowerCase() + suitName.toLowerCase();
        } else {
            return "invalid";
        }
    }
}