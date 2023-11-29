package com.cardgamesrus.gofish;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

import com.cardgamesrus.gofish.databinding.FragmentWinsBinding;

// This class represents the WinsFragment, which allows users to view the wins for each player and bots in the app.
public class WinsFragment extends Fragment {

    // Declare a binding object for the WinsFragment layout
    private FragmentWinsBinding binding;

    // Declare TextViews to display player wins
    private TextView playerWinsText;
    private TextView johnWinsText;
    private TextView anneWinsText;
    private TextView billWinsText;

    // This method is called when the fragment's view is created
    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        // Inflate the fragment's layout using binding
        binding = FragmentWinsBinding.inflate(inflater, container, false);

        // Initialize TextViews
        playerWinsText = binding.playerWinsValueText;
        johnWinsText = binding.johnWinsValueText;
        anneWinsText = binding.anneWinsValueText;
        billWinsText = binding.billWinsValueText;

        // Get a reference to the MainActivity to interact with app data
        MainActivity mainActivity = (MainActivity) getActivity();

        // Set text for each player's wins using the data from the MainActivity
        playerWinsText.setText(Integer.toString(mainActivity.GetWins(0)));
        johnWinsText.setText(Integer.toString(mainActivity.GetWins(1)));
        anneWinsText.setText(Integer.toString(mainActivity.GetWins(2)));
        billWinsText.setText(Integer.toString(mainActivity.GetWins(3)));

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
                NavHostFragment.findNavController(WinsFragment.this)
                        .navigate(R.id.action_WinsFragment_to_MainMenuFragment);
            }
        });
    }

    // This method is called when the view is being destroyed
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        // Release the binding object to prevent memory leaks
        binding = null;
    }
}