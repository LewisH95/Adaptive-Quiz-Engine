/**
 * getFeedback.js is responsible for displaying user feedback in the web application.
 * It listens for the DOM content to be fully loaded, retrieves feedback data from localStorage list feedbackList,
 * and then displays it on the page. If no feedback is available, it informs the user.
 */
document.addEventListener('DOMContentLoaded', function () {
    const feedbackContainer = document.getElementById('feedback-container');

    displayFeedback();

    function displayFeedback() {
        // Get feedback list from localStorage
        const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];

        if (feedbackList.length === 0) {
            feedbackContainer.innerHTML = '<p>No feedback available.</p>';
        } else {
            const feedbackListHtml = feedbackList.map(feedback => `<p>${feedback}</p>`).join('');
            feedbackContainer.innerHTML = feedbackListHtml;
        }
    }
});
