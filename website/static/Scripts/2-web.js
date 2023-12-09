$(document).ready(function() {


    $('.carry_all').on('click', function() {
        // Extract information from the clicked carry_all div
        const sellerId = $(this).data('product-seller-id');
        const productId = $(this).data('product-id');
        console.log(userId);
        console.log(productId);
        window.location.href = `/display_selects/${userId}/${productId}`;
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

    //on click function
    $('#numberInput').on('keydown', function(event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.keyCode === 13) {
            // Trigger the click event of the corresponding button
            $('.the-butt').click();
        }
    });


    // onclick function
    $('.the-butt').on('click', function() {
        // Read the value from the input field
        gramValue = $('#numberInput').val();
        console.log(gramValue)
        $('#numberInput').val('');
        // Update the Add to Cart button status
        updateAddCartButton();
    });


    //function
    // Set up click event for add-cart button
    const addCartButton = $('.add-cart').prop('disabled', true).on('click', async function() {

        // Get the product id and the sellers id
        let product_id = $('#capturedContent').data('product-id1');
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
        let seller_id = $('.carry_not').data('seller-id');

        // Check if both inch and gram are selected
        if (selectedInches !== null && gramValue !== null) {
            if (!inchesDictionary[selectedInches][gramValue]) {
                inchesDictionary[selectedInches][gramValue] = {
                    quantity: 0,
                    productName: productName,
                    productPrice: productPrice,
                    total: 0,
                    seller_id: seller_id,
                    product_id: product_id
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
        console.log('sellerid:' , seller_id);
        console.log('product_id: ', product_id)


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


    //funtion 2

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


    // funtion 
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
    

    // on click function
    $('.order-div').on('click', '.box-plus, .box-minus',  function () {
        event.stopPropagation();

            let productElement = $(this).siblings('.box-quant');
            let orderDiv = $(this).closest('.order-div');

            let orderIds = orderDiv.data('order-id');
            let subbText = orderDiv.find(`.subb[data-order-ids="${orderIds}"]`);
            let text = orderDiv.find(`.sub[data-order-ids="${orderIds}"]`);


            console.log('subbText:', subbText.text());
            console.log('Text:', text.text());
            var totalPriceWithoutSymbol = subbText.text().replace(/₦/g, '');
            let textWithoutSymbol = text.text().replace(/₦/g, '');
            console.log('totalPriceWithoutSymbol:', totalPriceWithoutSymbol);
            console.log('textWithoutSymbol:', textWithoutSymbol);

            let aggPrice = parseInt(totalPriceWithoutSymbol, 10);
            let productInt = parseInt(productElement.text(), 10);
            let direction = $(this).hasClass('box-plus') ? 1 : -1;
            let productQuantity = Math.max(productInt + direction, 0);

            productElement.text(productQuantity);

            let tempPrice = aggPrice / productInt;
            productTotal = tempPrice * productQuantity;

            subbText.text('₦' + productTotal);
            text.text('₦' + productTotal);

            console.log('productQuantity:', productQuantity);
            console.log('totalPrice:', productTotal );
            console.log('orderIds:', orderIds);

            let orderId = $(this).closest('.order-div').data('order-id');
            console.log('orderId:', orderId);
            $.ajax({
                url: '/orders/' + orderId,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ productQuantity: productQuantity, productTotal: productTotal }),
                success: function (data) {
                    // Handle success if needed
                    console.log('Quantity updated successfully');
                },
                error: function (error) {
                    // Handle error if needed
                    console.error('Error updating quantity:', error);
                }
            });

        });

    // function to delete order
    $('.order-div').on('click', '.cancel-order', function (event) {
        // Stop event propagation to prevent multiple triggers
        event.stopPropagation();

        // Find the closest parent with the data-order-ids attribute
        var orderId = $(this).closest('.order-div').data('order-id');
    
        // Make an AJAX request to delete the order
        $.ajax({
            url: '/orders/' + orderId,
            method: 'DELETE',
            success: function (data) {
                console.log('Order canceled successfully');
                removeOrderDiv(orderId);
            },
            error: function (error) {
                // Handle error if needed
                console.error('Error canceling order:', error);
            }
        });
       
    });

    //another functtion 

    function removeOrderDiv(orderId) {
        // Find the corresponding order-div using the data attribute

        var orderDiv = $('.order-div[data-order-id="' + orderId + '"]');
        
        // Remove the order-div from the DOM
        orderDiv.remove();
    }

    // funtion
    
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

    
    // function
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
                if (responseProductInches == latestInches) {
                    console.log("they are the same");
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking if order exists:', error);
            return false;
        }
    }


    // function
    function getLatestEntry(dictionary) {
        const keys = Object.keys(dictionary);
        const latestKey = keys[keys.length - 1];
        const latestValue = dictionary[latestKey];
        return { key: latestKey, value: latestValue };
        }

});