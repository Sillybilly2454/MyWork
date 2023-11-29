import java.io.IOException;
import java.util.Scanner;

public class BlackJack {

   // MEMBER VARIABLES
   // ================
   private BlackJackGame game;
   private Scanner scanner;

   // CONSTRUCTOR
   // ===========
   public BlackJack() {
      scanner = new Scanner(System.in);
   }

   // METHODS
   // =======
   public void NewGame() throws IOException {
      game = new BlackJackGame();
      game.playGame();
   }

   public static void main(String[] args) throws IOException {
      BlackJack blackJack = new BlackJack();
      while (true) {
         System.out.println("Do you want to play a new game of Blackjack? (y/n)");
         String response = blackJack.scanner.nextLine();
         if (response.equalsIgnoreCase("y")) {
            blackJack.NewGame();
         } else {
            break;
         }
      }
      System.out.println("Thanks for playing!");
   }
}