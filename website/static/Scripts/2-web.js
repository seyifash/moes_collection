$(document).ready(function() {
    $('.carry_all').on('click', function() {
        const capturedContent = $(this).clone(); // Clone the entire structure
        // Append the captured content to the new page
        const encodedContent = encodeURIComponent(capturedContent.html());

        // Navigate to the new page
        window.location.href = '/display_selects?content=' + encodedContent;
    });

});
// script.js

// Initialize a variable to store selected inches information
let selectedInches = null;

// Initialize a variable to store quantity
let quantity = 0;

// Function to handle inch selection
function handleInchSelection(inch) {
    // Update the selectedInches variable
    selectedInches = inch;

    // Enable or disable the add-cart button based on inch selection
    updateAddCartButton();
}

// Function to enable or disable the add-cart button based on inch selection
function updateAddCartButton() {
    const addCartButton = $('.add-cart');

    // Check if an inch is selected
    if (selectedInches !== null) {
        // Enable the add-cart button
        addCartButton.removeClass('disabled');

        // Set up click event for add-cart button
        addCartButton.click(function() {
            // Increment the quantity
            quantity++;

            // Perform the desired action with the selected information
            console.log('Selected Inches:', selectedInches);
            console.log('Quantity:', quantity);

            // Add your logic to store the product name, gram, price, etc.

            // Optionally, reset selectedInches and update add-cart button after adding to the cart
            selectedInches = null;
            updateAddCartButton();
        });
    } else {
        // Disable the add-cart button
        addCartButton.addClass('disabled');

        // Remove click event for add-cart button
        addCartButton.off('click');
    }
}
