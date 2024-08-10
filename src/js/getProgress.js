/**
 * getProgress.js is responsible for fetching and displaying the user's quiz progress.
 * It checks if the user is logged in by verifying the existence of a username in the localStorage.
 * If the username exists, it fetches the user's progress from the backend from the MongoDb Atlas database and displays it on the page.
 * If no username is found, the user is redirected to the login page.
 */

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    if (username) {
        // Fetch and display user progress
        getProgress(username);
    } else {
        // Redirect to login if no username found
        window.location.href = 'login.html';
    }
});
/**
 * This fetches the user's quiz progress from the backend and displays it.
 * The progress is shown for different difficulty levels (easy, medium, hard).
 *
 * @param {string} username - The username of the logged-in user.
 */
function getProgress(username) {
    fetch(`http://localhost:8080/api/users/username/${username}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('easy-score').textContent = `Easy: ${data.easyScore || 0}`;
            document.getElementById('medium-score').textContent = `Medium: ${data.mediumScore || 0}`;
            document.getElementById('hard-score').textContent = `Hard: ${data.hardScore || 0}`;
        })
        .catch(error => {
            console.error('Cannot fetch progress:', error);
            document.getElementById('easy-score').textContent = 'Unable to load progress';
            document.getElementById('medium-score').textContent = 'Unable to load progress';
            document.getElementById('hard-score').textContent = 'Unable to load progress';
        });
}
