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
