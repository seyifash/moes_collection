$(document).ready(function() {
    $('.carry_all').on('click', function() {
        const capturedContent = $(this).clone(); // Clone the entire structure
        // Append the captured content to the new page
        const encodedContent = encodeURIComponent(capturedContent.html());

        // Navigate to the new page
        window.location.href = '/display_selects?content=' + encodedContent;
    });
    let selectedInches = null;

    // Initialize a variable to store quantity
    let quantity = 0;
    const inchesDictionary = {};


    // Function to handle inch selection
    $('.inche').on('click', function() {
        // Update the selectedInches variable
        selectedInches = $(this).data('inches');

        // Enable or disable the add-cart button based on inch selection
        updateAddCartButton();
    });

    // Set up click event for add-cart button
        const addCartButton = $('.add-cart').prop('disabled', true).on('click', function() {
            // store the selected inch in an object
            if (selectedInches !== null) {
            // Increment the quantity for the selected inch, The key is the selected inch while the value is the quanity
            if (inchesDictionary[selectedInches]) {
            // Increment selected quantity whenever the add-cart class is clicked on  
                inchesDictionary[selectedInches]++;
            } else {
                inchesDictionary[selectedInches] = 1;
            }
        }
            console.log('Inches Dictionary:', inchesDictionary);

        // Add your logic to store the product name, gram, price, etc.
        // Optionally, reset selectedInches and update add-cart button after adding to the cart
        updateAddCartButton();
    });

    // Function to enable or disable the add-cart button based on inch selection
    function updateAddCartButton() {
        // Check if an inch is selected
        if (selectedInches !== null) {
            // Enable the add-cart button
            addCartButton.prop('disabled', false);
        } else {
            // Disable the add-cart button
            addCartButton.prop('disabled', true);
        }
    }
});