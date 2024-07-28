// toDo: I guess this needs deleting.
document.addEventListener("DOMContentLoaded", function () {
    const quizButton = document.getElementById("quiz-button");
    quizButton.addEventListener("click", fetchHelloWorld);

    function fetchHelloWorld() {
        fetch('/api/hello')
            .then(response => response.text())
            .then(data => {
                alert(data);
            })
            .catch(error => console.error('Error fetching hello world:', error));
    }
});
