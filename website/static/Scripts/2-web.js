document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class 'carry_all'
    var carryAllDivs = document.querySelectorAll('.carry_all');

    // Attach click event to each 'carry_all' div
    carryAllDivs.forEach(function (div) {
        div.addEventListener('click', function () {
            // Get the data-href attribute value
            var href = div.getAttribute('data-href');

            // Navigate to the specified URL
            window.location.href = href;
        });
    });
});