package com.cardgamesrus.gofish;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.cardgamesrus.gofish.databinding.ActivityMainBinding;

// This class represents the splash activity of the app, it runs when the application first open.
public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the content view to the splash screen layout
        setContentView(R.layout.activity_splash);

        // Create a Handler to post a delayed action
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // Start the main game activity here
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent); // Start the MainActivity

                // Apply a fade-in animation
                overridePendingTransition(R.anim.fade_in, 0);

                // Finish the splash activity to prevent it from going back when pressing back
                finish();
            }
        }, 2000);  // Delay for 2000 milliseconds (2 seconds)
    }
}