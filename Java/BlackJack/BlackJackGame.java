import java.io.BufferedReader;
import java.io.Console;
import java.io.InputStreamReader;
import java.io.IOException;

//####################################################
// Inner Class: "BlackJackGame"
// - - - - - - - - - - - - - - - - - - - - - - - - - -
public class BlackJackGame {

    private final Deck deck;
    private final Hand player;
    private final Hand dealer;
    private BufferedReader keyboard;
    private char input;
 
    // CONSTRUCTOR
    // ===========
    public BlackJackGame() {
        deck = new Deck(52);
        player = new Hand();
        dealer = new Hand();
        keyboard = new BufferedReader(new InputStreamReader(System.in));
    }
 
    // METHODS
    // =======
    public void playGame() throws IOException {
        System.out.println("Welcome to Blackjack!");
        System.out.println("=====================\n");
        deck.shuffle();
        initialDeal();
        System.out.println("DEALER");
        System.out.println(dealer.showHand(false));
        do {
           System.out.println("PLAYER");
           System.out.println(player.showHand(true));
           System.out.print("Hit/H/h or Stay/S/s: ");
           input = Character.toLowerCase(keyboard.readLine().charAt(0));
           if (input == 'h') {
              player.addCard(deck.deal());
           }
           System.out.println("");
        } while ((!player.busted()) && (input == 'h'));
        dealersTurn();
        showResults();
    }
 
    public void initialDeal() {
        player.addCard(deck.deal());
        player.addCard(deck.deal());
        dealer.addCard(deck.deal());
        dealer.addCard(deck.deal());
    }
 
    public void dealersTurn() {
        while (dealer.handValue() < 17) {
            dealer.addCard(deck.deal());
         }
    }
 
    public void showResults() {
        int playerScore = 0;
        int dealerScore = 0;
        if (dealer.busted()) {
           System.out.println("DEALER: Busted!");
        } else {
           dealerScore = dealer.handValue();
           System.out.println("DEALER: " + Integer.toString(dealerScore));
        }
        System.out.println(dealer.showHand(true));
        if (player.busted()) {
           System.out.println("PLAYER: Busted!");
        } else {
           playerScore = player.handValue();
           System.out.println("PLAYER: " + Integer.toString(playerScore));
        }
        System.out.println(player.showHand(true));
        if (dealerScore > playerScore) {
           System.out.println("Dealer wins!");
        } else if (playerScore > dealerScore) {
           System.out.println("Player wins!");
        } else {
           System.out.println("It's a draw!");
        }
    }
}