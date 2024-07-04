document.addEventListener('DOMContentLoaded', () => {
    fetchFeedback();
});

function fetchFeedback() {
    fetch('/api/feedback') // REPLACE WITH ENDPOINT
        .then(response => response.json())
        .then(data => {
            // easy: 'You did well in the easy questions.', medium: 'You can improve in medium questions.', hard: 'Strive to improve in hard questions.' }
            document.getElementById('feedback-message').textContent = `
                Easy Questions: ${data.easy}
                Medium Questions: ${data.medium}
                Hard Questions: ${data.hard}
            `;
        })
        .catch(error => {
            console.error('Cannot fetch feedback:', error);
            document.getElementById('feedback-message').textContent = 'There is an error loading your feedback, try again later';
        });
}
