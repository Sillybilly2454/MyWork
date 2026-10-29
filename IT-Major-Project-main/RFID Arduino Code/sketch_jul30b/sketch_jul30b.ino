#include <SPI.h>
#include <MFRC522.h>

// Pin Definitions
#define SS_PIN 5 // Slave Select Pin
#define RST_PIN 4 // Reset Pin
const int buzzer = 15; // Buzzer Pin

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(115200); // Initialize serial communications with the PC
  SPI.begin(18, 19, 23); // Initialize SPI with ESP32 pins: SCK=18, MISO=19, MOSI=23
  mfrc522.PCD_Init(); // Initialize the MFRC522 reader
  
  pinMode(buzzer, OUTPUT); // Set buzzer pin as output
  tone(buzzer, 1000); // Play a short beep when the system starts
  delay(100);
  noTone(buzzer); // Stop the beep
}

void loop() {
  // Check for a new card
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return; // Exit if no card is detected
  }

  // Attempt to read the card's UID
  if (!mfrc522.PICC_ReadCardSerial()) {
    return; // Exit if reading UID fails
  }

  // Sound a beep when a card is detected
  tone(buzzer, 1000);
  delay(100);
  noTone(buzzer);

  // Convert UID to a hexadecimal string and print it
  String rfid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    rfid += String(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println(rfid); // Output the UID to the serial monitor

  // Stop communication with the card and clear encryption
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}