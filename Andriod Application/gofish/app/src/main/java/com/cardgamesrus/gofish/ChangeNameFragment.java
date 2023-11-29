package com.cardgamesrus.gofish;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;

import com.cardgamesrus.gofish.databinding.FragmentChangenameBinding;

// This class represents the ChangeNameFragment, which allows users to change their name in the app.
public class ChangeNameFragment extends Fragment {

    // Binding to the layout for this fragment
    private FragmentChangenameBinding binding;

    // Holds a reference to the name input field
    private EditText nameInputField;

    // Called when the view for this fragment is created
    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState
    ) {
        // Inflate the fragment's layout using binding
        binding = FragmentChangenameBinding.inflate(inflater, container, false);

        // Initialize the nameInputField with the corresponding view from the layout
        nameInputField = binding.nameInput;

        // Get a reference to the MainActivity to interact with app data
        MainActivity mainActivity = (MainActivity) getActivity();

        // Set the text of the name input field to the current user's name
        nameInputField.setText(mainActivity.GetName());

        // Return the root view of the fragment
        return binding.getRoot();
    }

    // Called when the view is created and ready for user interaction
    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Set a click listener for the changeButton in the layout
        binding.changeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Get a reference to the MainActivity to interact with app data
                MainActivity mainActivity = (MainActivity) getActivity();

                // Change the name in the app's data based on the input field's text
                mainActivity.ChangeName(nameInputField.getText().toString());

                // Navigate to the MainMenuFragment using the navigation controller
                NavHostFragment.findNavController(ChangeNameFragment.this)
                        .navigate(R.id.action_ChangeNameFragment_to_MainMenuFragment);
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
