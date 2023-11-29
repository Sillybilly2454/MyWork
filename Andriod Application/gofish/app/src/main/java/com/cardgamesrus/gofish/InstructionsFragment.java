package com.cardgamesrus.gofish;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

import com.cardgamesrus.gofish.databinding.FragmentInstructionsBinding;
import com.cardgamesrus.gofish.databinding.FragmentWinsBinding;

// This class represents the WinsFragment, which allows users to view the wins for each player and bots in the app.
public class InstructionsFragment extends Fragment {

    // Declare a binding object for the WinsFragment layout
    private FragmentInstructionsBinding binding;


    // This method is called when the fragment's view is created
    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        // Inflate the fragment's layout using binding
        binding = FragmentInstructionsBinding.inflate(inflater, container, false);

        // Return the root view of the fragment's layout
        return binding.getRoot();
    }

    // This method is called after the view has been created
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Set a click listener for the back button
        binding.backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Navigate to the MainMenuFragment when the button is clicked
                NavHostFragment.findNavController(InstructionsFragment.this)
                        .navigate(R.id.action_InstructionsFragment_to_MainMenuFragment);
            }
        });

        // Set a click listener to open display the rules
        binding.rulesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Hide all menus
                closeAllMenus();

                // Show the rules menu
                binding.rulesView.setVisibility(View.VISIBLE);
            }
        });

        // Set a click listener to open display the rules
        binding.infoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Hide all menus
                closeAllMenus();

                // Show the info menu
                binding.infoView.setVisibility(View.VISIBLE);
            }
        });

        // Hide all menus
        closeAllMenus();
    }

    // Function is called to hide all the menus
    private void closeAllMenus() {
        binding.rulesView.setVisibility(View.INVISIBLE);
        binding.infoView.setVisibility(View.INVISIBLE);

    }

    // This method is called when the view is being destroyed
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        // Release the binding object to prevent memory leaks
        binding = null;
    }
}