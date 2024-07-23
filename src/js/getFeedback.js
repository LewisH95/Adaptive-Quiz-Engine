document.addEventListener('DOMContentLoaded', function () {
    function getFeedback() {
        const urlParams = new URLSearchParams(window.location.search);
        const questionIds = urlParams.getAll('questionIds'); // Array of question IDs
        const userAnswers = urlParams.getAll('userAnswers'); // Array of user answers

        // Ensure both arrays are of the same length
        if (questionIds.length !== userAnswers.length) {
            console.error('Mismatch between question IDs and user answers.');
            document.getElementById('feedback-box').textContent = 'Error: Mismatch between question IDs and user answers.';
            return;
        }

        // Properly encode the parameters
        const encodedQuestionIds = encodeURIComponent(questionIds.join(','));
        const encodedUserAnswers = encodeURIComponent(userAnswers.join(','));

        // Fetch the feedback data
        fetch(`http://localhost:8080/api/feedback/multiple?questionIds=${encodedQuestionIds}&userAnswers=${encodedUserAnswers}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(feedbacks => {
                const feedbackBox = document.getElementById('feedback-box');
                feedbackBox.innerHTML = ''; // Clear previous content

                Object.keys(feedbacks).forEach(questionId => {
                    const feedbackElement = document.createElement('p');
                    feedbackElement.textContent = `Question ID ${questionId}: ${feedbacks[questionId]}`;
                    feedbackBox.appendChild(feedbackElement);
                });
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
                document.getElementById('feedback-box').textContent = 'Error fetching feedback.';
            });
    }

    getFeedback();
});
