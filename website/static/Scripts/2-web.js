$(document).ready(function() {
    $('.carry_all').on('click', function() {
        var capturedContent = $(this).clone(); // Clone the entire structure

        // Append the captured content to the new page
        $('#capturedContent').empty().append(capturedContent);

        // Navigate to the new page
        window.location.href = '../../templates/display.html';
    });
});