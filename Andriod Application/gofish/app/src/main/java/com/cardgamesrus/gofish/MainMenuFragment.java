package com.cardgamesrus.gofish;

import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

import com.cardgamesrus.gofish.databinding.FragmentMainmenuBinding;

// This class represents the MainMenuFragment, which is the main menu of the app and is where users navigate between all the fragments.
public class MainMenuFragment extends Fragment {

    // Binding to the layout for this fragment
    private FragmentMainmenuBinding binding;

    // Called when the view for this fragment is created
    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState
    ) {
        binding = FragmentMainmenuBinding.inflate(inflater, container, false);

        // Tries to update switch incase data has already been loaded
        UpdateSwitch();

        // Get a reference to the MainActivity
        MainActivity mainActivity = (MainActivity) getActivity();

        // Saves this fragment to the activity so it can be accessed later
        mainActivity.mainMenuFragment = this;

        // Return the root view of the fragment
        return binding.getRoot();
    }

    // Called by the Main activity after the data has been loaded
    public void UpdateSwitch() {
        // Get a reference to the MainActivity
        MainActivity mainActivity = (MainActivity) getActivity();
        // Enables/disables the switch depending on the saved data
        binding.musicSwitch.setChecked(mainActivity.GetMusicOn());
    }

    // Called when the view is created and ready for user interaction
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Set a click listener for the "winsButton" in the layout
        binding.winsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Navigate to the WinsFragment using the navigation controller
                NavHostFragment.findNavController(MainMenuFragment.this)
                        .navigate(R.id.action_MainMenuFragment_to_WinsFragment);
            }
        });

        // Set a click listener for the "playButton" in the layout
        binding.playButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Navigate to the GameFragment using the navigation controller
                NavHostFragment.findNavController(MainMenuFragment.this)
                        .navigate(R.id.action_MainMenuFragment_to_GameFragment);
            }
        });

        // Set a click listener for the "instructionsButton" in the layout
        binding.instructionsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Navigate to the InstructionsFragment using the navigation controller
                NavHostFragment.findNavController(MainMenuFragment.this)
                        .navigate(R.id.action_MainMenuFragment_to_InstructionsFragment);
            }
        });

        // Set a click listener for the "changeNameButton" in the layout
        binding.changeNameButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Get a reference to the MainActivity to interact with app data
                MainActivity mainActivity = (MainActivity) getActivity();

                // Check if it's allowed to change the name to avoid spamming
                if (mainActivity.CanChangeName()) {
                    // Navigate to the ChangeNameFragment using the navigation controller
                    NavHostFragment.findNavController(MainMenuFragment.this)
                            .navigate(R.id.action_MainMenuFragment_to_ChangeNameFragment);
                }
            }
        });

        // Set a click listener for the "resetDataButton" in the layout
        binding.resetDataButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Get a reference to the MainActivity to reset app data
                MainActivity mainActivity = (MainActivity) getActivity();
                mainActivity.ResetData();
            }
        });


        binding.musicSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // Get a reference to the MainActivity to enable/disable app music
                MainActivity mainActivity = (MainActivity) getActivity();
                mainActivity.IsMusicOn(isChecked);
            }
        });
    }

    // Called when the view is being destroyed
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        // Release the binding to avoid memory leaks
        binding = null;
    }
}