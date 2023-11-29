package com.cardgamesrus.gofish;

import android.widget.ImageView;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Player {

    // M E M B E R     V A R I A B L E S
    private String     playerName;
    private List<Card> cardsInHand  = new ArrayList<Card>();
    private int        playerChoice = -1;
    private Card       cardChoice;
    private int        tricks       = 0;

    // C O N S T R U C T O R
    public Player() {/* Nothing required to construct */}

    // M E T H O D S
    //====================================GETTERS and SETTERS=======================================
    public String getName()                   { return playerName;         }
    public void   setName(String theName)     { playerName = theName;      }
    public int    getPlayerChoice()           { return playerChoice;       }
    public void   setPlayerChoice(int choice) { playerChoice = choice;     }
    public Card   getChoice()                 { return cardChoice;         }
    public int    getTricks()                 { return tricks;             }
    public int    getHandSize()               { return cardsInHand.size(); }

    //========================METHOD FOR ADDING A CARD TO THIS PLAYERS HAND=========================
    public void addCard(Card cardToAdd) {
        cardsInHand.add(cardToAdd);
        sortHand();
    }

    // This Method gets a list of the card images in the deck
    public ArrayList<ImageView> GetCardImages() {
        ArrayList<ImageView> cardImages = new ArrayList<ImageView>();
        for (Card c: cardsInHand) {
            cardImages.add(c.cardImage);
        }
        return cardImages;
    }

    //======THIS METHOD RETURNS AN ARRAYLIST CONTAINING ALL THE UNIQUE CARD VALUES (MINUS SUIT)=====
    public ArrayList<Integer> getUniqueVals() {
        ArrayList<Integer> options = new ArrayList<Integer>();
        int prev = -1;
        int i = 0;
        for (Card c: cardsInHand) {
            if (c.getCardRank() != prev) {
                options.add(c.getCardRank());
                prev = c.getCardRank();
                i++;
            }
        }
        return options;
    }
    //=============THIS METHOD SIMPLY SORTS THIS PLAYERS HAND OF CARDS BY CARD VALUE================
    public void sortHand() {
        for (int i = 0; i < cardsInHand.size(); i++) {
            for (int j = cardsInHand.size() - 1; j > i; j--) {
                if (cardsInHand.get(i).getCardRank() > cardsInHand.get(j).getCardRank()) {
                    Card tmp = cardsInHand.get(i);
                    cardsInHand.set(i,cardsInHand.get(j)) ;
                    cardsInHand.set(j,tmp);
                }
            }
        }
    }

    // Method updated the players card choice
    public void setCardChoice(int choice) {
        for (Card c: cardsInHand) {
            if (c.getCardRank() == choice) {
                cardChoice = c;
            }
        }
    }

    //=============THIS METHOD RETURNS THE NUMBER OF OCCURRENCES FOR THE REQUESTED CARD=============
    public int request(String req) {
        int totalReqs = 0;
        for (Card c: cardsInHand) if (c.printCardVal().equals(req)) totalReqs++;
        return totalReqs;
    }
    //==============THIS METHOD REMOVES ALL INSTANCES OF THE PASSED CARD FROM THE HAND==============
    public Card takeCard(Card cardToTake) {
        Card tempCard = new Card(1); // this won't be the card taken, just ensures no compile errors
        int i = 0;
        while (i < cardsInHand.size()) {
            if (cardsInHand.get(i).getCardRank() == cardToTake.getCardRank()) {
                tempCard = cardsInHand.get(i);
                cardsInHand.remove(i);
                i = cardsInHand.size();
            }
            i++;
        }
        return tempCard;
    }
    //==========================THIS METHOD SWEEPS THE HAND FOR ANY TRICKS==========================
    // If it finds any tricks it adds it to the list so the ui can be changed
    public ArrayList<Card>  sweepForTricks() {
        ArrayList<Card> cards = new ArrayList<Card>();
        if (cardsInHand.size() > 3) {
            for (int i = 0; i < cardsInHand.size() - 3; i++) {
                if (cardsInHand.get(i).getCardRank() == cardsInHand.get(i + 3).getCardRank()) {
                    for (int j = i; j <= i + 3; j++)
                    {
                        cards.add(cardsInHand.get(i));
                        cardsInHand.remove(i);
                    }
                    tricks++;
                    return cards;
                }
            }
        }

        return cards;
    }
    //=================THIS METHOD SIMPLY PICKS A RANDOM CARD FROM THIS PLAYERS HAND================
    public void pickRandomCard() {
        Random randInt = new Random();
        int r = randInt.nextInt();
        r = Math.abs(r);
        r = r % cardsInHand.size();
        cardChoice = cardsInHand.get(r);
    }
}