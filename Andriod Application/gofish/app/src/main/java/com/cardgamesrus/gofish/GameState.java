package com.cardgamesrus.gofish;

public class GameState {

    // M E M B E R     V A R I A B L E S
    private String  playerNames[];
    private int     cardStatus[];
    private int     currentPlayer          = -1;
    private int     totalNumberOfPlayers;
    private boolean knowledge[][]          =
            {{false,false,false,false,false,false,false,false,false,false,false,false,false},
             {false,false,false,false,false,false,false,false,false,false,false,false,false},
             {false,false,false,false,false,false,false,false,false,false,false,false,false},
             {false,false,false,false,false,false,false,false,false,false,false,false,false}};

    // C O N S T R U C T O R
    public GameState(int numPlayers, String playerName) {
        String possibleOppositionNames[] = {"John","Anne","Bill"};
        playerNames = new String[numPlayers];
        cardStatus = new int[numPlayers];
        playerNames[0] = playerName;
        cardStatus[0] = 7;
        for (int i = 1; i < numPlayers; i++) {
            playerNames[i] = possibleOppositionNames[i - 1];
            cardStatus[i] = 7;
        }
        totalNumberOfPlayers = numPlayers;
    }

    // M E T H O D S
    //====================================GETTERS and SETTERS=======================================
    public int     getNumPlayers()                          { return totalNumberOfPlayers;         }
    public String  getName(int playerReference)             { return playerNames[playerReference]; }
    public int     getCurrentPlayer()                       { return currentPlayer;                }
    public void    setCurrentPlayer(int playerReference)    { currentPlayer = playerReference;     }
    public void    updateStatus(int pRef, int numCards)     { cardStatus[pRef] = numCards;         }
    public void    updateKnowledge(int p, int c, boolean v) { knowledge[p][c - 2] = v;             }

    //====================GENERATE AN ARRAY CONTAINING THE PLAYERS WITH CARDS=======================
    public int[] eligibleTargets(int player) {
        int targetCount = 0;
        int eligibles[];
        for (int i = 0; i < cardStatus.length; i++) {
            if ((i != player) && (cardStatus[i] > 0)) targetCount++;
        }
        eligibles = new int[targetCount];
        int j = 0;
        for (int i = 0; i < cardStatus.length; i++) {
            if ((i != player) && (cardStatus[i] > 0)) {
                eligibles[j] = i;
                j++;
            }
        }
        return eligibles;
    }

    //===========================MOVE TO THE NEXT VALID PLAYER IN THE GAME==========================
    public void advancePlayer() {
        if ((currentPlayer + 1) == totalNumberOfPlayers) currentPlayer = 0;
        else currentPlayer++;
    }

    //============THIS METHOD RETURNS THE INFO FOR THE REQUESTED CARD IF SOMEONE HAS IT=============
    public int[] checkKnowledge(Integer cardVal) {
        int results[] = {-1,-1};
        int i = 0, j = 0;

        j = cardVal -2;

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        while ((results[0] == -1) && (i < totalNumberOfPlayers)) {
            if (i != currentPlayer) {
                if (knowledge[i][j] == true) {
                    results[0] = i;
                    results[1] = j;
                }
            }
            i++;
        }
        return results;
    }
}