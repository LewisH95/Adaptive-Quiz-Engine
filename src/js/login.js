/**
 * login.js handles the user login functionality for the web application.
 * The script captures user input (username and password), sends it to the backend for authentication,
 * and manages the login process based on the response from the server.
 */
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        /*
         * Sends a POST request to the backend API to check the user's credentials.
         * If authentication is successful, stores the username in localStorage and redirects to the homepage.
         * If authentication fails, it displays an error message.
         */

        fetch('http://localhost:8080/api/users/loginCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(isAuthenticated => {
                if (isAuthenticated) {
                    localStorage.setItem('username', username);
                    window.location.href = '/html/homepage.html'; // Redirect to homepage
                } else {
                    alert('Invalid username or password. Please try again.');
                    loginError.textContent = 'Invalid username or password. Please try again.';
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                loginError.textContent = 'An error occurred during login. Please try again.';
            });
    });
});
