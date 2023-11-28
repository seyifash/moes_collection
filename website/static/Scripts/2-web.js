$(document).ready(function() {
    $('.carry_all').on('click', function() {
        const capturedContent = $(this).clone(); // Clone the entire structure
        // Append the captured content to the new page
        const encodedContent = encodeURIComponent(capturedContent.html());

        // Navigate to the new page
        window.location.href = '/display_selects?content=' + encodedContent;
    });
});