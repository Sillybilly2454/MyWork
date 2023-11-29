package com.cardgamesrus.gofish;

import android.animation.ObjectAnimator;
import android.content.res.Resources;
import android.media.Image;
import android.os.Bundle;
import android.os.Debug;
import android.os.Handler;
import android.os.Looper;

import android.os.SystemClock;
import android.text.style.UpdateLayout;
import android.transition.ChangeTransform;
import android.transition.Transition;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

import com.cardgamesrus.gofish.databinding.FragmentGameBinding;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


public class GameFragment extends Fragment {

    // Binding to the layout for this fragment
    private FragmentGameBinding binding;

    // Reference to the GoFishGame class to manage the game logic
    private GoFishGame game;

    // Variables for various UI elements

    // UI For Bots and player
    private LinearLayout[] playerHands;
    private LinearLayout[] playerTrickLayouts;
    private ImageButton[] playerButtons;
    private TextView[] playerNameTexts;

    // UI for Player
    private ImageButton deckButton;
    private ImageButton goFishButton;
    private Button giveCardsButton;
    private TextView messageText;
    private LinearLayout numOfEnemyLayout;
    private LinearLayout chooseCardWanted;
    private TextView chooseCardPrompt;
    private LinearLayout chooseCardWantedLayout1;
    private LinearLayout chooseCardWantedLayout2;
    private Button[] cardChoices;


    // This method is called when the fragment's view is created
    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        // Inflate the fragment's layout using binding
        binding = FragmentGameBinding.inflate(inflater, container, false);


        // Initialize UI elements by binding to layout components

        messageText = binding.messageBubble;
        numOfEnemyLayout = binding.numOfEnemysChoices;

        cardChoices = new Button[13];
        cardChoices[0] = binding.choose2;
        cardChoices[1] = binding.choose3;
        cardChoices[2] = binding.choose4;
        cardChoices[3] = binding.choose5;
        cardChoices[4] = binding.choose6;
        cardChoices[5] = binding.choose7;
        cardChoices[6] = binding.choose8;
        cardChoices[7] = binding.choose9;
        cardChoices[8] = binding.choose10;
        cardChoices[9] = binding.chooseJ;
        cardChoices[10] = binding.chooseQ;
        cardChoices[11] = binding.chooseK;
        cardChoices[12] = binding.chooseA;

        chooseCardPrompt = binding.chooseCardPrompt;
        chooseCardWanted = binding.chooseCardWanted;
        chooseCardWantedLayout1 = binding.chooseCardWantedLayout1;
        chooseCardWantedLayout2 = binding.chooseCardWantedLayout2;


        deckButton = binding.cardDeckButton;
        goFishButton = binding.goFishButton;
        giveCardsButton = binding.giveCardsButton;


        // Players UI Binding
        playerButtons = new ImageButton[4];
        playerButtons[0] = binding.playerButton;
        playerButtons[1] = binding.johnButton;
        playerButtons[2] = binding.anneButton;
        playerButtons[3] = binding.billButton;

        playerNameTexts = new TextView[4];
        playerNameTexts[0] = binding.playerNameText;
        playerNameTexts[1] = binding.johnNameText;
        playerNameTexts[2] = binding.anneNameText;
        playerNameTexts[3] = binding.billNameText;

        playerHands = new LinearLayout[4];
        playerHands[0] = binding.playerHand;
        playerHands[1] = binding.johnHand;
        playerHands[2] = binding.anneHand;
        playerHands[3] = binding.billHand;

        playerTrickLayouts = new LinearLayout[4];
        playerTrickLayouts[0] = binding.playerTricks;
        playerTrickLayouts[1] = binding.johnTricks;
        playerTrickLayouts[2] = binding.anneTricks;
        playerTrickLayouts[3] = binding.billTricks;

        return binding.getRoot();
    }

    // This method is called after the view has been created
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Create the new game and initialize it
        game = new GoFishGame();

        // Set up click listeners for UI elements
        SetupListeners();

        // Tell the game to start
        game.SetupNewGame();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        // Release the binding object to prevent memory leaks
        binding = null;
    }

    // Sets up click listeners for various buttons and views
    private void SetupListeners() {
        // Click listener for the back button, navigates to the main menu
        binding.backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Navigate back to the main menu when the back button is clicked
                NavHostFragment.findNavController(GameFragment.this)
                        .navigate(R.id.action_GameFragment_to_MainMenuFragment);
            }
        });

        // Click listeners for buttons to choose the number of enemies
        binding.oneEnemy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Trigger the game's logic to choose 1 enemy player
                game.ChooseNumPlayers(1);
            }
        });
        binding.twoEnemy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Trigger the game's logic to choose 2 enemy players
                game.ChooseNumPlayers(2);
            }
        });
        binding.threeEnemy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Trigger the game's logic to choose 3 enemy players
                game.ChooseNumPlayers(3);
            }
        });

        // Runs threw playerButtons (except player 0(user))
        for (int l = 1; l < 4; l++) {
            final int playerNum = l;

            // Show players's cards when the button is clicked
            playerButtons[playerNum].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    game.DisplayPlayersCardsChoices(playerNum);
                }
            });
        }

        // Click listeners for player card choices
        for (int l = 0; l < cardChoices.length; l++) {
            int cardNumber = l + 2;
            cardChoices[l].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    // Trigger the game's logic to choose a specific card
                    game.ChooseCard(cardNumber);
                }
            });
        }

        // Click listener for the deck button to pick up cards from the deck
        deckButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (game.canPlayer0PickupFromDeck) {
                    // If the player can pick up cards from the deck, do so
                    game.canPlayer0PickupFromDeck = false;
                    game.PickupFromDeck();
                } else {
                    // Cant pickup from deck so invalid input
                    game.InvaildInput();
                }
            }
        });

        // Click listener for the button to give cards to other players
        giveCardsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (game.canPlayer0GiveCards) {
                    // If the player can give cards to others, proceed to do so
                    game.canPlayer0GiveCards = false;
                    game.GiveCards();
                } else {
                    // Cant give cards right now so invalid input
                    game.InvaildInput();
                }
            }
        });

        // Click listener for the "Go Fish" button
        goFishButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Execute the "Go Fish" action when the button is clicked
                game.CallGoFish();
            }
        });

        // Click listener to close the player's card choices view
        binding.closeChooseCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Hide the view for choosing cards when the close button is clicked
                game.HidePlayersCardsChoices();
            }
        });
    }



    // ############################ I N N E R    C L A S S: "GoFishGame" ###########################
    public class GoFishGame {

        // M E M B E R     V A R I A B L E S
        private final   Deck            deck; // The game's deck of cards
        private         Player          players[]; // Array to store all players
        private         GameState       game; // The current game state
        private         boolean         gameContinues = true; // Flag to track if the game is still ongoing
        private         boolean         anotherTurn; // Flag to indicate if a player gets another turn
        private         boolean         canPlayer0PickupFromDeck = false; // Flag to allow player 0 to pick up from the deck
        private         boolean         canPlayer0SayGoFish = false; // Flag to indicate if a player can call "Go Fish"
        private         boolean         canPlayer0GiveCards = false; // Flag to enable a player to give cards to others
        private         boolean         canPlayer0AskForCards = false; // Flag to enable a player to ask for cards from others
        private         int             playerChoice; // Stores the player's choice
        private         Card            cardChoice; // Stores the card chosen by the player
        private         int             occurrences; // Stores the count of occurrences of a card in a player's hand
        private         int             i, j; // temporary Integer variables for use in the program
        private         String          x; // temporary String variable for use in the program

        private         int            delayTime = 1500; // Delay time in milliseconds for actions

        // C O N S T R U C T O R
        public GoFishGame() {
            // Initialize the deck with 52 cards
            deck = new Deck(52);
        }

        //Sets up the UI elements for starting a new game
        public void SetupNewGame() {
            messageText.setText("How many players would you like to play against (1 - 3)?");
            numOfEnemyLayout.setVisibility(View.VISIBLE);

            // Hide UI elements for AI players (John, Anne, Bill)
            for (int k = 0; k < 4; k++) {
                playerButtons[k].setVisibility(View.INVISIBLE);
                playerHands[k].setVisibility(View.INVISIBLE);
                playerTrickLayouts[k].setVisibility(View.INVISIBLE);
                playerNameTexts[k].setVisibility(View.INVISIBLE);
            }

            chooseCardWanted.setVisibility(View.INVISIBLE); // Hide card selection UI
            deckButton.setVisibility(View.INVISIBLE); // Hide deck button
            goFishButton.setVisibility(View.INVISIBLE); // Hide "Go Fish" button
            giveCardsButton.setVisibility(View.INVISIBLE); // Hide "Give Cards" button

            // Get the player's name from the main activity
            MainActivity mainActivity = (MainActivity) getActivity();
            x = mainActivity.GetName();
        }

        // Function for choosing the number of players the user is playing against
        public void ChooseNumPlayers(int numEnemyPlayers) {
            messageText.setText("");

            // Hide the layout related to the number of enemy players
            numOfEnemyLayout.setVisibility(View.INVISIBLE);

            // Set the number of enemy players and create a game state
            i = numEnemyPlayers;
            game = new GameState(i + 1, x);

            // Create an array of players
            players = new Player[game.getNumPlayers()];

            // Initialize player names
            for (i = 0; i < game.getNumPlayers(); i++) {
                players[i] = new Player();
                players[i].setName(game.getName(i));
            }

            // Show the UI elements for enemy players based on the chosen number
            for (int k = 0; k <= numEnemyPlayers; k++) {
                playerButtons[k].setVisibility(View.VISIBLE);
                playerHands[k].setVisibility(View.VISIBLE);
                playerTrickLayouts[k].setVisibility(View.VISIBLE);
                playerNameTexts[k].setVisibility(View.VISIBLE);
            }

            // Set the player's name in the UI
            binding.playerNameText.setText(players[0].getName());

            // Show other game control buttons
            deckButton.setVisibility(View.VISIBLE);


            // Shuffle the deck and perform the initial card deal
            deck.shuffle();

            j = 0;

            initialDeal();
        }


        // Current Player pickups from the deck
        public void PickupFromDeck() {
            // Check if there are cards left in the deck to draw from
            if (deck.deckSize() > 0) {
                messageText.setText("   -- A card is collected from the deck --");

                // Draw a card for the current player
                DrawCard(game.getCurrentPlayer(), 1500);

                // Wait until after draw card animation finished
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // Check if the drawn card gave the player a trick
                        ArrayList<Card> cardTricks = players[game.getCurrentPlayer()].sweepForTricks();

                        // If the player got one or more tricks from the drawn card(s)
                        if (cardTricks.size() > 0) {
                            String cardRank = "";

                            // Run threw all the card tricks and remove the card images attached
                            for (int l = 0; l < cardTricks.size(); l++) {
                                Card card = cardTricks.get(l);
                                if(l == 0) {
                                    cardRank = card.printCardVal();
                                }

                                LinearLayout parentLayout = (LinearLayout) card.cardImage.getParent();

                                // Remove the card from the UI
                                parentLayout.removeView(card.cardImage);
                                card.cardImage = null;
                            }

                            // Register the new trick for the current player
                            NewTrick(game.getCurrentPlayer());

                            messageText.setText("   -- The fishing expedition has resulted in a new trick of " + cardRank + "'s !!! --");

                            // Check if the current player is out of cards
                            while (checkIfOutOfCards(game.getCurrentPlayer())){/* keep checking */}

                            // Update the game status and allow for another turn
                            game.updateStatus(game.getCurrentPlayer(), players[game.getCurrentPlayer()].getHandSize());
                            anotherTurn = true;
                        }

                        // Delay the setup for the next turn
                        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                SetupNextTurn();
                            }
                        }, delayTime);
                    }
                }, 1700);
            } else {
                messageText.setText("   -- The deck is empty so no fishing is possible --");
                // Delay the setup for the next turn
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        SetupNextTurn();
                    }
                }, delayTime);
            }
        }

        private void BounceCard(ImageView cardImage) {
            // Create an ObjectAnimator to animate the card's translationY property
            ObjectAnimator animator = ObjectAnimator.ofFloat(cardImage, "translationY", 0f, -50f, 0f); // You can adjust the -100f value to control the height

            // Set the duration of the animation (in milliseconds)
            animator.setDuration(500); // You can adjust the duration as needed
            animator.start();
        }




        // Function for the ai's turn
        private void AiTurn() {
            // Check through the knowledge construct for a matching card option
            List<Integer> options = players[game.getCurrentPlayer()].getUniqueVals();
            i = 0;
            int[] results = {-1, -1};

            // Iterate through the possible card options
            while (i < options.size()) {
                results = game.checkKnowledge(options.get(i));

                // If a match is found in the knowledge construct
                if (results[0] != -1) {
                    players[game.getCurrentPlayer()].setCardChoice(options.get(i));
                    i = options.size(); // Exit the loop
                }
                i++;
            }

            // If the knowledge construct has a match, set a target player
            if (results[0] != -1) {
                players[game.getCurrentPlayer()].setPlayerChoice(results[0]);
            } else {
                // If no match is found, pick a random card and player
                players[game.getCurrentPlayer()].pickRandomCard();
                pickRandomPlayer();
            }

            // Get the chosen player and card
            playerChoice = players[game.getCurrentPlayer()].getPlayerChoice();
            cardChoice = players[game.getCurrentPlayer()].getChoice();

            // Display a message asking the chosen player for a card
            messageText.setText(players[game.getCurrentPlayer()].getName().toUpperCase() + ": \"" + players[playerChoice].getName() + ", do you have any " + cardChoice.printCardVal() + "s?\"");

            // Update the game knowledge with the request
            game.updateKnowledge(game.getCurrentPlayer(), cardChoice.getCardRank(), true);

            // Check how many of the requested cards the chosen player has
            occurrences = players[playerChoice].request(cardChoice.printCardVal());

            // Delay before card-checking
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    CheckCards();
                }
            }, delayTime);
        }

        public void Occurrences() {
            // If the binding is null then return to stop game crash
            if(binding == null) {
                return;
            }

            // Checks if finished giving all the cards
            if(i <= occurrences) {
                // Take a card from the player's hand and store it in a temporary variable
                Card tempCard = players[playerChoice].takeCard(cardChoice);

                // Get the ImageView of the card
                ImageView cardView = tempCard.cardImage;

                // Hides the card value from the players
                cardView.setImageResource(R.drawable.back);

                // Get references to layout elements
                LinearLayout sourceLayout = playerHands[playerChoice];
                LinearLayout targetLayout = playerHands[game.getCurrentPlayer()];

                // Gets the root of the fragment
                ConstraintLayout rootLayout = binding.getRoot();

                // Calculate the center location of the source layout
                float[] sourceLocation = new float[2];
                sourceLocation[0] = sourceLayout.getX() + sourceLayout.getWidth() / 2;
                sourceLocation[1] = sourceLayout.getY() + sourceLayout.getHeight() / 2;

                // Calculate the center location of the target layout
                float[] targetLocation = new float[2];
                targetLocation[0] = targetLayout.getX() + targetLayout.getWidth() / 2;
                targetLocation[1] = targetLayout.getY() + targetLayout.getHeight() / 2;

                // Calculate the change in X and Y coordinates between source and target locations
                float deltaX = targetLocation[0] - sourceLocation[0];
                float deltaY = targetLocation[1] - sourceLocation[1];

                // Remove the card view from the source layout
                sourceLayout.removeView(cardView);

                // Add the card view to the root layout
                rootLayout.addView(cardView);

                // Set layout parameters for the card view
                Resources resources = getResources();
                int pixelsInDp = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 70, resources.getDisplayMetrics());
                LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                        pixelsInDp,  // Height
                        pixelsInDp   // Width
                );
                cardView.setLayoutParams(layoutParams);

                // Reset the rotation of the card
                cardView.setRotation(0);

                // Makes the card start at the same spot where the cards coming from
                cardView.setX(sourceLocation[0]);
                cardView.setY(sourceLocation[1]);

                // Use an animation to move the card view to the targets location over 1.5 seconds
                cardView.animate()
                        .xBy(deltaX)
                        .yBy(deltaY)
                        .setDuration(1500)
                        .withEndAction(new Runnable() {
                            @Override
                            public void run() {
                                // Destroys old card image to stop weird placement glitches
                                cardView.setImageDrawable(null);

                                // Creates the new card image
                                ImageView newImage = new ImageView(getContext());
                                tempCard.cardImage = newImage;


                                // If the player the card is going into is the player then display the actual card, if its a bot just hide it by using the back of the card
                                if (game.getCurrentPlayer() == 0) {
                                    newImage.setImageResource(getCard(tempCard));
                                } else {
                                    newImage.setImageResource(R.drawable.back);
                                }


                                // Convert dp to pixels for width and margin
                                int widthInDp = 50;
                                int widthInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, widthInDp, resources.getDisplayMetrics());
                                int marginInPixels;

                                // Adjust the margin based on whether its going in player 0's hand (the user) or bots
                                if (game.getCurrentPlayer() == 0) {
                                    marginInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, -35, resources.getDisplayMetrics());
                                } else {
                                    marginInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, -40, resources.getDisplayMetrics());
                                }

                                LinearLayout.LayoutParams layoutParams;

                                // Adjust the card's layout for displaying in the player's hand (rotation, margin, size)
                                if (game.getCurrentPlayer() == 1 || game.getCurrentPlayer() == 3) {
                                    // Change rotation
                                    newImage.setRotation(90);

                                    // Change the layout params
                                    layoutParams = new LinearLayout.LayoutParams(
                                            LinearLayout.LayoutParams.MATCH_PARENT,  // Height
                                            widthInPixels // Width
                                    );

                                    // Adjust the margin
                                    if (game.getCurrentPlayer() == 1) {
                                        layoutParams.topMargin = marginInPixels;
                                    } else {
                                        layoutParams.bottomMargin = marginInPixels;
                                    }
                                } else {
                                    // Change rotation
                                    newImage.setRotation(0);

                                    // Change the layout params
                                    layoutParams = new LinearLayout.LayoutParams(
                                            widthInPixels, // Height
                                            LinearLayout.LayoutParams.MATCH_PARENT  // Width
                                    );

                                    // Adjust the margin
                                    if (game.getCurrentPlayer() == 2) {
                                        layoutParams.rightMargin = marginInPixels;
                                    } else {
                                        layoutParams.leftMargin = marginInPixels;
                                    }
                                }

                                // Set layout parameters for the new card and add it to the player's hand
                                newImage.setLayoutParams(layoutParams);
                                rootLayout.removeView(newImage);
                                targetLayout.addView(newImage);

                                // Adds the card to there hand
                                players[game.getCurrentPlayer()].addCard(tempCard);

                                // Sort the player's hand
                                SortHand(game.getCurrentPlayer());

                                // If its the player getting the card make it bounce
                                if(game.getCurrentPlayer() == 0)
                                    BounceCard(newImage);

                                // Give the next card
                                i++;
                                Occurrences();
                            }
                        })
                        .start();
            } else {
                // This code is run after all cards are given


                // Check if the opponent is out of cards
                while (checkIfOutOfCards(playerChoice)) {}

                // Update the game status for both the player and opponent
                game.updateStatus(playerChoice, players[playerChoice].getHandSize());
                game.updateStatus(game.getCurrentPlayer(), players[game.getCurrentPlayer()].getHandSize());

                // Update the game knowledge to indicate the exchange of cards
                game.updateKnowledge(playerChoice, cardChoice.getCardRank(), false);

                // Check if the addition of these cards results in a trick
                ArrayList<Card> cardTricks = players[game.getCurrentPlayer()].sweepForTricks();

                // Check if the addition of these cards results in a trick
                if (cardTricks.size() > 0) {
                    String cardRank = "";

                    // Run threw all the card tricks and remove the card images attached
                    for (int l = 0; l < cardTricks.size(); l++) {
                        Card card = cardTricks.get(l);
                        if(l == 0) {
                            cardRank = card.printCardVal();
                        }


                        LinearLayout parentLayout = (LinearLayout) card.cardImage.getParent();
                        parentLayout.removeView(card.cardImage);
                        card.cardImage = null;
                    }

                    // Register a new trick
                    NewTrick(game.getCurrentPlayer());

                    // Display a message indicating the new trick
                    messageText.setText("   -- This addition has resulted in a new trick of " + cardRank + "'s !!! --");

                    // Update the game knowledge to indicate the trick
                    game.updateKnowledge(game.getCurrentPlayer(), cardChoice.getCardRank(), false);

                    // Check if the opponent is out of cards
                    while (checkIfOutOfCards(game.getCurrentPlayer())) {
                        // Keep checking
                    }

                    // Update the game status for the current player
                    game.updateStatus(game.getCurrentPlayer(), players[game.getCurrentPlayer()].getHandSize());
                }

                // Set a flag for another turn
                anotherTurn = true;

                // Delay before setting up the next turn
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        SetupNextTurn();
                    }
                }, delayTime);
            }
        }

        // Function is used to give cards to the player asking
        public void GiveCards() {
            // Display a message indicating the exchange of cards
            messageText.setText("   " + players[playerChoice].getName().toUpperCase() +
                    ": \"Yes I do " + players[game.getCurrentPlayer()].getName() +
                    ", have my " + int2Str(occurrences) + " " + cardChoice.printCardVal());
            if (occurrences > 1) messageText.append(("s"));
            messageText.append(".");

            // Remove cards from the opponent and add them to the player
            i = 1;
            Occurrences();
        }

        // Function checks if they have the cards requested
        private void CheckCards() {
            // Check if the target opponent has instances of the requested card
            if (occurrences > 0) {
                // If the opponent does have the requested card

                if (playerChoice != 0) {
                    // If the player being asked is an ai just give the cards
                    GiveCards();
                } else {
                    // If it's the player's turn, allow them to give cards
                    canPlayer0GiveCards = true;

                    // If its the player display assistance text
                    messageText.append("\n *Click the give cards button*");
                }
            } else {
                // If the opponent does not have the requested card

                // Automatically display response if its either the users turn or the person being asked is a bot
                if (game.getCurrentPlayer() == 0 || playerChoice != 0) {
                    messageText.setText("   " + players[playerChoice].getName().toUpperCase() +
                            ": \"Sorry " + players[game.getCurrentPlayer()].getName() +
                            ", I don't...go fish.\"");
                }

                if (game.getCurrentPlayer() != 0) { // Check if it's not the user's turn
                    if (playerChoice == 0) { // Player needs to say "go fish," so wait for their input
                        canPlayer0SayGoFish = true;

                        // If its the player display assistance text
                        messageText.append("\n *Click the gofish button*");
                    } else {
                        // If it's an AI player's turn, delay the pickup from the deck
                        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                PickupFromDeck();
                            }
                        }, delayTime);
                    }
                } else { // If it's the player's turn

                    // Check if there are no cards left in the deck
                    if (deck.deckSize() == 0) {
                        // If the deck is empty, just pickup automatically
                        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                PickupFromDeck();
                            }
                        }, delayTime);
                    } else {
                        // Enable the player to draw from the deck and wait for their input
                        canPlayer0PickupFromDeck = true;

                        // If its the player display assistance text
                        messageText.append("\n *Click the deck button*");
                    }
                }
            }
        }

        // Function manages the next players turn and checks if the games over
        private void SetupNextTurn() {
            // Determine who gets the next turn (if it's possible to have one)
            i = 0;
            for (Player p : players) {
                if (p.getHandSize() != 0) {
                    i++;
                }
            }
            gameContinues = false;

            // Check if there are players with remaining cards
            if (i > 0) {

                // If there are then the game continues
                gameContinues = true;

                // If the current player dosent get another go or the current player has no cards left go to the next player
                if (anotherTurn == false || players[game.getCurrentPlayer()].getHandSize() == 0) {
                    game.advancePlayer();

                    // Ensure that the next player has cards to play
                    while (players[game.getCurrentPlayer()].getHandSize() == 0) {
                        game.advancePlayer();
                    }
                }
            }

            // Disables the extra turn
            anotherTurn = false;

            // If the games still going
            if (gameContinues == true) {
                // Display a message indicating the current player's turn
                messageText.setText("It's " + players[game.getCurrentPlayer()].getName() + "'s turn!");

                // If its the player display assistance text
                if(game.getCurrentPlayer() == 0) {
                    canPlayer0AskForCards = true;
                    messageText.append("\n *Click on a players head*");
                    return;
                }

                // If the current player is not the human player (Player 0), schedule AI turn
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AiTurn();
                    }
                }, delayTime);
            } else {
                // If the game is over, print the winner
                printWinner();
            }
        }

        // Function for the user to call go fish
        public void CallGoFish() {
            // Check if the player (Player 0) is allowed to say "go fish"
            if (canPlayer0SayGoFish) {
                canPlayer0SayGoFish = false;

                // Display a message indicating that the player is saying "go fish"
                messageText.setText("   " + players[playerChoice].getName().toUpperCase() +
                        ": \"Sorry " + players[game.getCurrentPlayer()].getName() +
                        ", I don't...go fish.\"");

                // Schedule the pickup from the deck after a delay
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        PickupFromDeck();
                    }
                }, delayTime);
            } else {
                InvaildInput();
            }
        }

        // Called when user clicks on a player's head to display card choices.
        public void DisplayPlayersCardsChoices(int playerNum) {
            // Make sure the player is allowed to ask for cards
            if(canPlayer0AskForCards == false) {
                // Display invalid input message and return
                InvaildInput();
                return;
            }

            // Hide the layout
            chooseCardWanted.setVisibility(View.INVISIBLE);

            // Check if it's not the player's (Player 0) turn or if Player 0 can pick from the deck
            if (game.getCurrentPlayer() != 0 || canPlayer0PickupFromDeck) {
                // Display invalid input message and return
                InvaildInput();
                return;
            }

            // Check if the selected player is eligible to take a card from
            int[] eligibles = game.eligibleTargets(0);
            boolean isEligible = false;
            for (int player : eligibles) {
                if (player == playerNum) {
                    isEligible = true;
                }
            }

            if (!isEligible) {
                // If they arent eligible display invalid input message and return
                InvaildInput();
                return;
            }

            // Set the selected player as the target
            players[0].setPlayerChoice(playerNum);

            // Set the prompt for choosing a card to ask for
            chooseCardPrompt.setText("What card do you want to ask " + players[playerNum].getName() + " for?");

            // Get the unique card values that the player has
            List<Integer> uniqueCardVals = players[0].getUniqueVals();

            int numberOfChoicesSoFar = 0;

            // Loop through the available card choices
            for (int l = 0; l < cardChoices.length; l++) {
                cardChoices[l].setVisibility(View.GONE);

                // Check if the player has the card
                if (uniqueCardVals.contains(l + 2)) {
                    // Enable the choice
                    cardChoices[l].setVisibility(View.VISIBLE);
                    numberOfChoicesSoFar++;

                    // Check if the card is already in a layout and remove it
                    if (cardChoices[l].getParent() != null) {
                        ((LinearLayout) cardChoices[l].getParent()).removeView(cardChoices[l]);
                    }

                    // Add the card to one of the two layout containers based on the number of choices so far
                    if (numberOfChoicesSoFar < 7) {
                        chooseCardWantedLayout1.addView(cardChoices[l]);
                    } else {
                        chooseCardWantedLayout2.addView(cardChoices[l]);
                    }
                }
            }

            // Show the layout
            chooseCardWanted.setVisibility(View.VISIBLE);
        }


        // Hide the layout when the player is done making a selection.
        public void HidePlayersCardsChoices() {
            chooseCardWanted.setVisibility(View.INVISIBLE);
        }

        // Function is called when the player chooses a card to ask for from another player.
        public void ChooseCard(int cardNum) {
            // Hide the layout
            HidePlayersCardsChoices();

            // Player just went so make sure they cant ask again
            canPlayer0AskForCards = false;

            // Set the chosen card as the player's card choice
            players[0].setCardChoice(cardNum);

            // Ask the chosen player for the chosen card and check how many they have
            playerChoice = players[game.getCurrentPlayer()].getPlayerChoice();
            cardChoice = players[game.getCurrentPlayer()].getChoice();

            // Display a message indicating the request to the chosen player
            messageText.setText(players[game.getCurrentPlayer()].getName().toUpperCase() + ": \"" + players[playerChoice].getName() + ", do you have any " + cardChoice.printCardVal() + "s?\"");

            // Update the game knowledge to indicate the request
            game.updateKnowledge(game.getCurrentPlayer(), cardChoice.getCardRank(), true);

            // Calculate the number of occurrences of the requested card in the chosen player's hand
            occurrences = players[playerChoice].request(cardChoice.printCardVal());

            // Delay before card-checking
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    CheckCards();
                }
            }, delayTime);
        }


        // Holds the last time that they clicked an invalid input
        private long lastInvaildInputTime = 0;

        // Function is called whenever the user does an invalid input, so it displays this to the user
        public void InvaildInput() {
            // Get the current time to determine if it's too soon to reset data
            long currentTime = SystemClock.elapsedRealtime();

            // Check if the last invaild input was less than 2 seconds ago
            if (currentTime - lastInvaildInputTime < 2000) {
                // Too soon, don't show the toast, and exit the method
                return;
            }

            // Display a Toast to alert the user that the data has been reset
            Toast.makeText(getActivity(), "You cannot do this right now", Toast.LENGTH_SHORT).show();

            // Update the last reset time to prevent rapid resets
            lastInvaildInputTime = currentTime;
        }


        // Get the resource identifier for the card image based on the card's attributes.
        private int getCard(Card cardToFind) {
            // Construct the resource identifier using the card's attributes
            return getResources().getIdentifier(getContext().getPackageName() + ":drawable/" + cardToFind.printCard(), null, null);
        }


        // Draw a card from the deck and display it to the specified player.
        private void DrawCard(int playerNum, int drawTime) {
            // If the binding is null then return to stop game crash
            if(binding == null) {
                return;
            }


            // Deal a card from the deck
            Card card = deck.deal();

            // If there are no more cards in the deck, hide the deck button
            if (deck.deckSize() == 0) {
                deckButton.setVisibility(View.INVISIBLE);
            }

            // Create a new ImageView for the card and save it to the card for later reference
            ImageView newCard = new ImageView(getContext());
            card.cardImage = newCard;

            // Hides the card value from the players
            newCard.setImageResource(R.drawable.back);

            // Get references to layout elements
            LinearLayout targetLayout = playerHands[playerNum];

            // Gets the root of the fragment
            ConstraintLayout rootLayout = binding.getRoot();

            // Get the location of the source
            float[] sourceLocation = new float[2];
            sourceLocation[0] = binding.cardDeckButton.getX();
            sourceLocation[1] = binding.cardDeckButton.getY();

            // Calculate the center location of the target layout
            float[] targetLocation = new float[2];
            targetLocation[0] = targetLayout.getX() + targetLayout.getWidth() / 2;
            targetLocation[1] = targetLayout.getY() + targetLayout.getHeight() / 2;

            // Calculate the change in X and Y coordinates between source and target locations
            float[] deltaPosition = new float[2];
            deltaPosition[0] = targetLocation[0] - sourceLocation[0];
            deltaPosition[1] = targetLocation[1] - sourceLocation[1];

            // Add the card view to the root layout
            rootLayout.addView(newCard);

            // Set layout parameters for the card view and adjusts the rotation
            Resources resources = getResources();
            int pixelsInDp = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 70, resources.getDisplayMetrics());
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                    pixelsInDp,  // Height
                    pixelsInDp // Width
            );
            newCard.setLayoutParams(layoutParams);
            newCard.setRotation(0);

            // Makes the card start at the same spot where the cards coming from
            newCard.setX(sourceLocation[0]);
            newCard.setY(sourceLocation[1]);

            // Use an animation to move the card view to the targets location over the draw time
            newCard.animate()
                    .xBy(deltaPosition[0])
                    .yBy(deltaPosition[1])
                    .setDuration(drawTime) // Adjust the duration as needed
                    .withEndAction(new Runnable() {
                        @Override
                        public void run() {

                            // Destroys old card image to stop weird placement glitches
                            newCard.setImageDrawable(null);

                            // Creates the new card image
                            ImageView newerCard = new ImageView(getContext());
                            card.cardImage = newerCard;


                            // Show the user's card, or show the card back for other players
                            if (playerNum == 0) {
                                newerCard.setImageResource(getCard(card));
                            } else {
                                newerCard.setImageResource(R.drawable.back);
                            }

                            // Convert dp to pixels for width and margin
                            Resources resources = getResources();
                            int widthInDp = 50;
                            int widthInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, widthInDp, resources.getDisplayMetrics());
                            int marginInPixels;

                            // Set layout parameters for the new card
                            LinearLayout.LayoutParams layoutParams;

                            // Adjust the margin based on whether its going in player 0's hand (the user) or bots
                            if (playerNum == 0) {
                                marginInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, -35, resources.getDisplayMetrics());
                            } else {
                                marginInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, -40, resources.getDisplayMetrics());
                            }

                            // Adjust the card's layout for displaying in the player's hand (rotation, margin, size)
                            if (playerNum == 1 || playerNum == 3) {
                                // Change rotation
                                newerCard.setRotation(90);

                                // Change the layout params
                                layoutParams = new LinearLayout.LayoutParams(
                                        LinearLayout.LayoutParams.MATCH_PARENT,  // Height
                                        widthInPixels // Width
                                );

                                // Adjust the margin
                                if (playerNum  == 1) {
                                    layoutParams.topMargin = marginInPixels;
                                } else {
                                    layoutParams.bottomMargin = marginInPixels;
                                }
                            } else {
                                // Change the layout params
                                layoutParams = new LinearLayout.LayoutParams(
                                        widthInPixels, // Height
                                        LinearLayout.LayoutParams.MATCH_PARENT  // Width
                                );

                                // Adjust the margin
                                if (playerNum  == 2) {
                                    layoutParams.rightMargin = marginInPixels;
                                } else {
                                    layoutParams.leftMargin = marginInPixels;
                                }
                            }

                            // Set layout parameters for the new card and add it to the player's hand
                            newerCard.setLayoutParams(layoutParams);
                            playerHands[playerNum].addView(newerCard);
                            players[playerNum].addCard(card);

                            // Sort the player's hand
                            SortHand(playerNum);

                            // If its the player getting the card make it bounce
                            if(playerNum == 0)
                                BounceCard(newerCard);
                        }
                    })
                    .start();
        }

        // Sort and display a player's hand by removing existing card views and adding them back in a sorted order.
        private void SortHand(int playerNum) {
            // Remove all existing card views from the player's hand
            playerHands[playerNum].removeAllViews();

            // Get the card images in the player's hand
            ArrayList<ImageView> cardImages = players[playerNum].GetCardImages();

            // Add the card images back to the player's hand, sorted
            for (ImageView image : cardImages) {
                playerHands[playerNum].addView(image);
            }
        }


        // Add a new card to a player's trick layout when they have collected a new trick.
        private void NewTrick(int playerNum) {
            // Create a new ImageView for the trick card
            ImageView newCard = new ImageView(getContext());

            // Set the image resource for the trick card (usually a card back)
            newCard.setImageResource(R.drawable.back);

            Resources resources = getResources();
            int widthInDp = 30;
            int leftMarginInDp = -20;

            // Convert dp to pixels for width and margin
            int widthInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, widthInDp, resources.getDisplayMetrics());
            int marginInPixels = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, leftMarginInDp, resources.getDisplayMetrics());

            // Set layout parameters for the new trick card
            LinearLayout.LayoutParams layoutParams;

            if (playerNum == 1 || playerNum == 3) {
                // Change rotation
                newCard.setRotation(90);

                // Change the layout params
                layoutParams = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,  // Height
                        widthInPixels // Width
                );

                // Set the bottom margin
                layoutParams.bottomMargin = marginInPixels;
            } else {
                // Change the layout params
                layoutParams = new LinearLayout.LayoutParams(
                        widthInPixels, // Height
                        LinearLayout.LayoutParams.MATCH_PARENT  // Width
                );

                // Adjust the margin
                if (playerNum == 2) {
                    layoutParams.rightMargin = marginInPixels;
                } else {
                    layoutParams.leftMargin = marginInPixels;
                }
            }

            // Set layout parameters for the new trick card and add it to the player's trick layout
            newCard.setLayoutParams(layoutParams);
            playerTrickLayouts[playerNum].addView(newCard);
        }


        //==================DEALS OUT THE INITIAL CARDS TO ALL PLAYERS IN THE GAME==================
        private void initialDeal() {
            // Checks to see if the player has less than 7 cards
            if(players[j].getHandSize() < 7) {
                // Draws a card from the deck with a draw speed of 700 milliseconds
                DrawCard(j, 700);

                // Goes to the next player
                j++;

                // Check if we have cycled through all players
                if (j >= game.getNumPlayers()) {
                    // If we have, reset to the first player
                    j = 0;
                }

                // Delays the code to make sure the last drawn card has finished moving
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // Recursive call to continue dealing cards
                        initialDeal();
                    }
                }, 650);

                // Don't run the finished code
                return;
            }

            // SWEEP EACH PLAYERS HAND FOR ANY TRICKS
            for (j = 0; j < game.getNumPlayers(); j++) {

                // Check if the drawn card gave the player a trick
                ArrayList<Card> cardTricks = players[j].sweepForTricks();

                // Check if the addition of these cards results in a trick
                if (cardTricks.size() > 0) {
                    String cardRank = "";

                    // Run threw all the card tricks and remove the card images attached
                    for (int l = 0; l < cardTricks.size(); l++) {
                        Card card = cardTricks.get(l);
                        if(l == 0) {
                            cardRank = card.printCardVal();
                        }

                        LinearLayout parentLayout = (LinearLayout) card.cardImage.getParent();
                        parentLayout.removeView(card.cardImage);
                        card.cardImage = null;
                    }

                    messageText.setText(players[j].getName() + " got a new trick of " + cardRank + "'s !!! --");

                    // Register the new trick for the current player
                    NewTrick(j);

                    // Update the game status and allow for another turn
                    game.updateStatus(j, players[j].getHandSize());
                }
            }

            // Enables buttons for the player
            goFishButton.setVisibility(View.VISIBLE);
            giveCardsButton.setVisibility(View.VISIBLE);

            // Randomly select the first player
            messageText.setText("Okay " + players[0].getName() + ", I've randomly chosen ");
            Random randInt = new Random();
            int r = randInt.nextInt();
            r = Math.abs(r);
            game.setCurrentPlayer(r % game.getNumPlayers());

            // Prepare for the first turn
            if (game.getCurrentPlayer() == 0) {
                messageText.append("you ");
            } else {
                messageText.append("\"" + players[game.getCurrentPlayer()].getName() + "\" ");
            }
            messageText.append("to go first.");

            // If its the player display assistance text
            if (game.getCurrentPlayer() == 0) {
                canPlayer0AskForCards = true;
                messageText.append("\n *Click on a players head*");
            }


            // If the current player is not the human player (player 0), simulate AI turn after a delay
            if (game.getCurrentPlayer() != 0) {
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        AiTurn();
                    }
                }, delayTime);
            }
        }

        //=====================CONVERTS INTEGERS 1, 2, 3 TO THEIR WORD EQUIVALENT===================
        private String int2Str(int n) {
            switch (n) {
                case 1 : return "one";
                case 2 : return "two";
                default : return "three";
            }
        }

        //===================GIVE PLAYER A NEW HAND IF THEY HAVE RUN OUT OF CARDS===================
        private boolean checkIfOutOfCards(int playerNum) {
            boolean trickCheck = false;

            // If the player is out of cards, try to deal more.
            if (players[playerNum].getHandSize() == 0) {

                int loops = 7;
                // Adjust the number of cards to deal based on the remaining cards in the deck.
                if (deck.deckSize() < 7) {
                    loops = deck.deckSize();
                }

                if (loops > 0) {
                    messageText.setText(players[playerNum].getName() + " ran out of cards picking some up");
                }

                // Deal cards to the player.
                for (i = 1; i <= loops; i++) {
                    DrawCard(playerNum, 1500);
                }


                // Check if the drawn card(s) resulted in any tricks.
                ArrayList<Card> cardTricks = players[playerNum].sweepForTricks();

                // Check if the addition of these cards results in a trick.
                if (cardTricks.size() > 0) {
                    String cardRank = "";

                    // Run threw all the card tricks and remove the card images attached
                    for (int l = 0; l < cardTricks.size(); l++) {
                        Card card = cardTricks.get(l);
                        if(l == 0) {
                            cardRank = card.printCardVal();
                        }

                        LinearLayout parentLayout = (LinearLayout) card.cardImage.getParent();
                        parentLayout.removeView(card.cardImage);
                        card.cardImage = null;
                    }

                    // Update the message text to indicate the player got a new trick.
                    messageText.setText(players[playerNum].getName() + " gota new trick of " + cardRank + "'s !!! --");

                    // Register the new trick for the current player.
                    NewTrick(playerNum);

                    // Indicate a trick occurred.
                    trickCheck = true;
                }
            }
            return trickCheck; // Return whether a trick occurred during this process.
        }






        //=====PICK A RANDOM PLAYER IN THE GAME THAT ISN'T YOU AND HAS CARDS LEFT IN THEIR HAND=====
        private void pickRandomPlayer() {
            // Get the current player's index.
            i = game.getCurrentPlayer();

            // Loop until a suitable random player is found
            while ((i == game.getCurrentPlayer()) || (players[i].getHandSize() == 0)) {
                // Generate a random integer
                Random randInt = new Random();
                i = randInt.nextInt();
                i = Math.abs(i);
                i = i % game.getNumPlayers();
            }

            // Set the selected player as the choice for the current player.
            players[game.getCurrentPlayer()].setPlayerChoice(i);
        }

        //===========================PRINT OUT THE RESULT OF THE GAME===============================
        private void printWinner() {
            int winScore = -1;
            String winner = "";

            // Find the player(s) with the most tricks.
            for (Player p : players) {
                if (p.getTricks() > winScore) {
                    winScore = p.getTricks(); // Update the highest tricks count.
                }
            }

            // Get a reference to the MainActivity.
            MainActivity mainActivity = (MainActivity) getActivity();

            int numberOfWinners = 0;

            // Iterate through the players to find the winner(s).
            for (int p = 0; p < players.length; p++) {
                if (players[p].getTricks() == winScore) {
                    numberOfWinners++;
                    if(winner != "") {
                        winner = winner + "and ";
                    }
                    winner = winner + players[p].getName(); // Add the name of the winner(s) to the 'winner' string.



                    mainActivity.AddWin(p); // Update the win count for each winner in the MainActivity.
                }
            }

            // Determine the message to display based on the number of winners.
            if (numberOfWinners > 1) {
                messageText.setText("The winners are:" + winner + "!!!");
            } else {
                messageText.setText("The winner is:" + winner + "!!!");
            }
        }
    }
}



/*
TODO: Make things move to location not tp
TODO: Ask sir If i need to comment xml files - "wouldnt hurt"
 */