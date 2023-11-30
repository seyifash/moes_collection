$(document).ready(function() {
    $('.carry_all').on('click', function() {
        const capturedContent = $(this).clone(); // Clone the entire structure
        // Append the captured content to the new page
        const encodedContent = encodeURIComponent(capturedContent.html());

        // Navigate to the new page
        window.location.href = '/display_selects?content=' + encodedContent;
    });
    
    //a varaible to store the selected inches as well as gram value
    let selectedInches = null;
    gramValue = null;

    // Initialize an object variable to store quantity and inches 
    const inchesDictionary = {};
   
    // Function to handle inch selection
    $('.inche').on('click', function() {
        // Update the selectedInches variable
        selectedInches = $(this).data('inches');
        if (!inchesDictionary[selectedInches]) {
            inchesDictionary[selectedInches] = {};
        }
        // Enable or disable the add-cart button based on inch selection
        updateAddCartButton();
    });

    $('.the-butt').on('click', function() {
        // Read the value from the input field
        gramValue = $('#numberInput').val();
        
        $('#numberInput').val('');
        // Update the Add to Cart button status
        updateAddCartButton();
    });

    // Set up click event for add-cart button
    const addCartButton = $('.add-cart').prop('disabled', true).on('click', function() {
        // Get product name and price from the span tags
        const productName = $('.price_name').text().trim(); 
        const productPriceText = $('.price').text().trim().replace(/\s+/g, ' ');
        const productPriceMatch = productPriceText.match(/(\d+(\.\d+)?)/);
        const productPrice = productPriceMatch ? parseInt(productPriceMatch[1]) : 0;

        // Check if both inch and gram are selected
        if (selectedInches !== null && gramValue !== null) {
            if (!inchesDictionary[selectedInches][gramValue]) {
                inchesDictionary[selectedInches][gramValue] = {
                    quantity: 0,
                    productName: productName,
                    productPrice: productPrice,
                    total: 0
                };
            }
    
            // Increment the quantity for the selected inch and gram
        inchesDictionary[selectedInches][gramValue].quantity++;
        quants = inchesDictionary[selectedInches][gramValue].quantity;
        price = inchesDictionary[selectedInches][gramValue].productPrice;
        inchesDictionary[selectedInches][gramValue].total = quants * price;

        console.log('Inches Dictionary:', inchesDictionary);

        // Add your logic to store the product name, price, etc.

        //update add-cart button after adding to the cart
        selectedInches = null;
        gramValue= null;
        updateAddCartButton();
        sendInchesDictionary();
    }
    });

    function sendInchesDictionary() {
        $.ajax({
            url: '/display_cart',
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            data:   JSON.stringify({ inchesDictionary: inchesDictionary }),
            success: function (response) {
                // Handle the response as needed
                console.log('Inches Dictionary sent successfully');
                window.location.href = '/display_cart';
            },
            error: function (error) {
                console.error('Error sending data to server:', error);
            }
        });
    }

    // Function to enable or disable the add-cart button based on inch selection
    function updateAddCartButton() {
        // Check if an inch is selected
        if (selectedInches !== null && gramValue !== null) {
            // Enable the add-cart button
            addCartButton.prop('disabled', false);
        } else {
            // Disable the add-cart button
            addCartButton.prop('disabled', true);
        }
    }
    
});