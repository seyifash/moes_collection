$(document).ready(function() {


    $('.carry_all').on('click', function() {
        // Extract information from the clicked carry_all div
        const sellerId = $(this).data('product-id');
        const imageSrc = $(this).find('.hair').attr('src');
        const productName = $(this).find('.content-sp:nth-child(1)').text().replace('Name: ', '');
        const productInches = $(this).find('.content-sp:nth-child(2)').text().replace('Inches: ', '');
        const productQuantity = $(this).find('.content-sp:nth-child(3)').text().replace('Gram: ', '');
        const productColor = $(this).find('.content-sp:nth-child(4)').text().replace('Colors: ', '');
        const productPrice = $(this).find('.content-sp:nth-child(5)').text().replace('Price: ', '');
        const productPricePerInch = $(this).find('.content-sp:nth-child(6)').text().replace('Price by Inch: ', '');
        const inchesAboveTwenty = $(this).find('.content-sp:nth-child(7)').text().replace('Price Inches Above Twenty: ', '');

        // Create a dictionary with the extracted information
        const productInfo = {
            'imageSrc': imageSrc,
            'productName': productName,
            'productInches': productInches,
            'productQuantity': productQuantity,
            'productColor': productColor,
            'productPrice': productPrice,
            'sellerId': sellerId,
            'productPricePerInch': productPricePerInch,
            'inchesAboveTwenty': inchesAboveTwenty
        };

        // Do something with the productInfo dictionary
        console.log(productInfo);
        console.log('sellerid:' , sellerId);


        // Send data as a POST request
        $.ajax({
            url: '/display_selects/' + userId,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({ content: productInfo }),
            success: function(response) {
                window.location.href = '/display_selects/' + userId
                console.log('sellerid:' , sellerId);
            },
            error: function(error) {
                console.error('Error sending data to server:', error);
            }
    });
});
    
    //a varaible to store the selected inches as well as gram value
    let selectedInches = null;
    let gramValue = null;

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

    $('#numberInput').on('keydown', function(event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.keyCode === 13) {
            // Trigger the click event of the corresponding button
            $('.the-butt').click();
        }
    });

    $('.the-butt').on('click', function() {
        // Read the value from the input field
        gramValue = $('#numberInput').val();
        console.log(gramValue)
        $('#numberInput').val('');
        // Update the Add to Cart button status
        updateAddCartButton();
    });

    // Set up click event for add-cart button
    const addCartButton = $('.add-cart').prop('disabled', true).on('click', function() {
        // Get product name and price from the span tags
        const productName = $('.price_name').text().trim(); 
        // product price
        const productPriceText = $('.price').text().trim().replace(/\s+/g, ' ');
        const productPriceMatch = productPriceText.match(/(\d+(\.\d+)?)/);
        const productPrice = productPriceMatch ? parseInt(productPriceMatch[1]) : 0;
        // price below 20
        const productPricePerInchText = $('.price_per_inch').text().trim().replace(/\s+/g, ' ');
        const priceInch = productPricePerInchText.match(/(\d+(\.\d+)?)/);
        const productPricePerInch = priceInch ? parseInt(priceInch[1]) : 0;
        // inches above twenty
        const aboveTwentyText = $('.inche_Above_Twenty').text().trim().replace(/\s+/g, ' ');
        const aboveTwentyMatch = aboveTwentyText.match(/(\d+(\.\d+)?)/);
        const inchesAboveTwenty = aboveTwentyMatch ? parseInt(aboveTwentyMatch[1]) : 0; 
        let sellerId = $('.carry_not').data('seller-id');

        // Check if both inch and gram are selected
        if (selectedInches !== null && gramValue !== null) {
            if (!inchesDictionary[selectedInches][gramValue]) {
                inchesDictionary[selectedInches][gramValue] = {
                    quantity: 0,
                    productName: productName,
                    productPrice: productPrice,
                    total: 0,
                    sellerId: sellerId
                };
            }
    
            // Increment the quantity for the selected inch and gram
        inchesDictionary[selectedInches][gramValue].quantity++;
        quants = inchesDictionary[selectedInches][gramValue].quantity;
        price = inchesDictionary[selectedInches][gramValue].productPrice;
        if (selectedInches >= 8 && selectedInches <= 20) {
            const pry1 = selectedInches - 8;
            const pry2 = pry1 / 2;
            const pry3 = productPricePerInch * pry2;
            const tPry = price + pry3;
            inchesDictionary[selectedInches][gramValue].total = quants * tPry;
        } else if (selectedInches >= 20) {
           const pry1 = selectedInches - 8;
           const pry2 = pry1 / 2;
            const pry3 = inchesAboveTwenty * pry2;
            const tPry = price + pry3;
            inchesDictionary[selectedInches][gramValue].total = quants * tPry;
        } else {
        inchesDictionary[selectedInches][gramValue].total = quants * price;
        }
        
        console.log('Inches Dictionary:', inchesDictionary);
        console.log('sellerid:' , sellerId);

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
            url: '/display_cart/' + userId,
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            data:   JSON.stringify({ inchesDictionary: inchesDictionary }),
            success: function (response) {
                // Handle the response as needed
                console.log('Inches Dictionary sent successfully');
                window.location.href = '/display_cart/' + userId;
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