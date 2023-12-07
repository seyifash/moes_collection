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
    
    //a variable to store the selected inches as well as gram value
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
    const addCartButton = $('.add-cart').prop('disabled', true).on('click', async function() {
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


        updateAddCartButton();
        updateCartOverlay();
        console.log("myid: ", orderId);
        const orderExists = await checkOrderExists(orderId);
        console.log("return", orderExists);
        // Rest of your logic using orderExists
        if (orderExists) {
            // If it exists, update the existing order
            updateServerOrders(inchesDictionary);
        } else {
            // If it doesn't exist, create a new order
            sendOrderToBack();
        }
        selectedInches = null;
        gramValue = null;

        }
    });
    let orderId;
    function sendOrderToBack () {
        const { key: latestInches, value: latestEntry } = getLatestEntry(inchesDictionary);
        const requestData = {
            latestEntry: latestEntry,
            latestInches: latestInches
        };
        $.ajax({
        url: '/display_cart/' + userId,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(requestData),
        success: function (response) {
            console.log('Inches Dictionary sent successfully');
            allOrder = response;
            if (allOrder && allOrder.id) {
                // Update the global variable with order.id
                orderId = allOrder.id;
                console.log('Order ID:', orderId);
            }
        },
        error: function (error) {
            console.error('Error sending data to server:', error);
        }
    });
    }

    function updateCartOverlay() {
        let proName = document.getElementById('cartname');
        let proPrice = document.getElementById('cartprice');
        let proInqty = document.getElementById('qty-cart-inches');
        let exPrice = document.getElementById('ex-price');
    
        // Clear existing content
        proName.textContent = '';
        proPrice.textContent = '';
        proInqty.innerHTML = '';
        exPrice.textContent = '';  // Assuming a default value if there's nothing in the dictionary
    
        for (let inches in inchesDictionary) {
            for (let grams in inchesDictionary[inches]) {
                let item = inchesDictionary[inches][grams];
    
                // Assuming you want to display information for the last item in the dictionary
                proName.textContent = item.productName;
                proPrice.textContent = '\u20A6' + item.productPrice;
    
                // Append quantity and inches information
                proInqty.innerHTML = '<span class="cartqty" id="cartqty">Qty: <b>'+ item.quantity + '</b></span>' +
                    '<span class="cart-inch" id="cart-inch"> inches: <b>' + inches + '</b></span>';
    
                // Update the total price
                exPrice.textContent = '\u20A6' + item.total;
            }
        }
    
        // Show the cart overlay
        document.getElementById('cart-overlay').style.display = 'block';
    
        // Hide the cart overlay after 4 seconds
        setTimeout(function () {
            document.getElementById('cart-overlay').style.display = 'none';
        }, 4000);
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
    

    async function updateServerOrders(inchesDictionary) {
        let orderDatas;
        for (const [productInches, value] of Object.entries(inchesDictionary)) { 
            // Iterate over the inner dictionary
            for (const [productGram, e] of Object.entries(value)) {
                const productName = e['productName'];
                const productPrice = e['productPrice'];
                const productQuantity = e['quantity'];
                const productTotal = e['total'];
                const seller_id = e['sellerId'];
        
                // Create the orderData object
                orderDatas = {
                    'productInches': productInches,
                    'productGram': productGram,
                    'productName': productName,
                    'productPrice': productPrice,
                    'productQuantity': productQuantity,
                    'productTotal': productTotal
                };
            }
            }
            console.log("oreders: ", orderDatas);
        try {
            const response = await fetch(`/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderDatas }),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error updating server orders:', error);
        }
    }

    async function checkOrderExists(orderId) {
        try {
            const response = await fetch(`/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const orderDats = await response.json();
                const responseProductInches = orderDats.productInches;
                console.log("my inch:", responseProductInches)
                
                const { key: latestInches, value: latestEntry } = getLatestEntry(inchesDictionary);
                console.log("my select:", latestInches);
                // Check if responseProductInches exists in inchesDictionary
                if (responseProductInches == latestInches) {
                    // If it exists, return false (order already exists)
                    console.log("they are the same");
                    return true;
                } else {
                    // If it doesn't exist, return true (order doesn't exist)
                    return false;
                }
            } else {
                // If the response is not successful, the order doesn't exist
                return false;
            }
        } catch (error) {
            console.error('Error checking if order exists:', error);
            return false;
        }
    }

    function getLatestEntry(dictionary) {
        const keys = Object.keys(dictionary);
        const latestKey = keys[keys.length - 1];
        const latestValue = dictionary[latestKey];
        return { key: latestKey, value: latestValue };
      }
      // Example usage
      const latestEntry = getLatestEntry(inchesDictionary);
      console.log(latestEntry);

});