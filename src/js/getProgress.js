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
