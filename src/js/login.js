document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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
                    loginError.textContent = 'Invalid username or password. Please try again.';
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                loginError.textContent = 'An error occurred during login. Please try again.';
            });
    });
});
