package com.cardgamesrus.gofish;

import android.content.Context;
import android.content.SharedPreferences;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Debug;
import android.os.SystemClock;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.cardgamesrus.gofish.databinding.ActivityMainBinding;

import java.util.List;

// This class represents the main activity of the app.
public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;

    // Binding to the layout for this fragment
    private ActivityMainBinding binding;

    // User's name
    private String name = new String();

    // Array to store wins for different players
    private int[] wins = new int[4];

    // Name of the SharedPreferences file
    private String sharedPrefsName = "GoFishData";

    // Stores whether the music is on or off
    private boolean musicOn = false;

    // Holds the music player for the background
    private MediaPlayer backgroundMusic;

    // Holds the MainMenu Fragment so a function within can be called
    public MainMenuFragment mainMenuFragment;

    // Get the number of wins for a specific player
    public int GetWins(int playerNum) {
        return wins[playerNum];
    }

    // Increment the number of wins for a specific player
    public void AddWin(int index) {
        wins[index]++;

        // Saves the new data
        SaveData();
    }

    // Get the user's name
    public String GetName() {
        return name;
    }

    // Gets whether the music is on or off
    public boolean GetMusicOn() {
        return musicOn;
    }

    // Holds the last time that the name was changed
    private long lastChangedNameTime = 0;

    // Used to prevent Toast spamming when changing the name
    public Boolean CanChangeName() {
        // Get the current time to determine if it's too soon to open the change name menu
        long currentTime = SystemClock.elapsedRealtime();

        // Check if the last change was less than 2 seconds ago
        if (currentTime - lastChangedNameTime < 2000) {
            // Too soon, don't show the toast, and exit the method
            return false;
        }

        return true;
    }

    // Change the user's name and save it
    public void ChangeName(String newName) {
        // Check to make sure they entered at least 1 character and at most 13 characters
        if (newName.length() > 0 && newName.length() <= 13) {
            Toast.makeText(this, "Saved Name", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "Invalid Name Using Default", Toast.LENGTH_SHORT).show();

            // They didn't enter anything or entered too much, so use the default name
            newName = "Player";
        }

        // Changes the name to the new name
        name = newName;

        // Update the last changed name time
        lastChangedNameTime = SystemClock.elapsedRealtime();

        // Saves the new data
        SaveData();
    }


    // Used to set if the music is on
    public void IsMusicOn(boolean b) {
        musicOn = b;

        if(musicOn) {
            // If the music is enabled

            // Starts playing the audio
            backgroundMusic.start();
        } else if(backgroundMusic.isPlaying()) {
            // The music is disabled and is playing

            // Stops playing the audio
            backgroundMusic.pause();
        }

        // Saves the new data
        SaveData();
    }


    // Load user data from SharedPreferences
    public void LoadData() {
        // Get SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences(sharedPrefsName, Context.MODE_PRIVATE);

        // Tries to get all the data and assign it to the variables for later use. If Cant find uses the default values.
        name = sharedPreferences.getString("name", "Player");
        wins[0] = sharedPreferences.getInt("playerWins", 0);
        wins[1] = sharedPreferences.getInt("johnWins", 0);
        wins[2] = sharedPreferences.getInt("anneWins", 0);
        wins[3] = sharedPreferences.getInt("billWins", 0);
        IsMusicOn(sharedPreferences.getBoolean("musicOn", true));

        if(mainMenuFragment != null)
            mainMenuFragment.UpdateSwitch();
    }

    // Save user data to SharedPreferences
    public void SaveData() {
        // Get SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences(sharedPrefsName, Context.MODE_PRIVATE);

        // Stores the data to the sharedPrefs
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("name", name);
        editor.putInt("playerWins", wins[0]);
        editor.putInt("johnWins", wins[1]);
        editor.putInt("anneWins", wins[2]);
        editor.putInt("billWins", wins[3]);
        editor.putBoolean("musicOn", musicOn);
        editor.apply();
    }


    // Holds the last time that the data was reset
    private long lastResetTime = 0;

    // Reset user data and prevent Toast spamming
    public void ResetData() {
        // Get the current time to determine if it's too soon to reset data
        long currentTime = SystemClock.elapsedRealtime();

        // Check if the last reset was less than 2 seconds ago
        if (currentTime - lastResetTime < 2000) {
            // Too soon, don't show the toast, and exit the method
            return;
        }

        // Access the SharedPreferences to remove user data
        SharedPreferences sharedPreferences = getSharedPreferences(sharedPrefsName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        // Remove user-specific data keys from SharedPreferences
        editor.remove("name");
        editor.remove("playerWins");
        editor.remove("johnWins");
        editor.remove("anneWins");
        editor.remove("billWins");
        editor.remove("musicOn");
        editor.apply();

        // Reload the user data after resetting it
        LoadData();

        // Display a Toast to alert the user that the data has been reset
        Toast.makeText(this, "Reset Data", Toast.LENGTH_SHORT).show();

        // Update the last reset time to prevent rapid resets
        lastResetTime = currentTime;
    }

    // Called when the activity is created
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Inflate the layout and bind it to the 'binding' variable
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());



        // Audio Reference:
        // AlexiAction (2022) Abstract World [song], Pixabay, accessed 6 November 2023. https://pixabay.com/music/beats-abstract-world-127012/
        
        // Creates the new media player
        backgroundMusic = MediaPlayer.create(this, R.raw.backgroundmusic);
        // Makes it loop
        backgroundMusic.setLooping(true);

        // Set the app's toolbar as the action bar
        setSupportActionBar(binding.toolbar);

        // Initialize navigation controller and configure the app bar
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        appBarConfiguration = new AppBarConfiguration.Builder(navController.getGraph()).build();

        // Set up the action bar to work with the navigation controller
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);

        // Load user data from SharedPreferences
        LoadData();
    }


    // Called when the user presses the Up button in the action bar
    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }
}