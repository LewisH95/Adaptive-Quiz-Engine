document.addEventListener('DOMContentLoaded', function () {
    const startQuizButton = document.getElementById('start-quiz-btn');
    const questionBox = document.getElementById('question-container');
    const quizSetup = document.getElementById('quiz-setup');
    const quizSection = document.getElementById('quiz');
    let currentQuestion = null;
    let currentDifficulty = 'easy';
    const username = localStorage.getItem('username'); // username

    if (!username) {
        window.location.href = 'login.html'; // Redirect to login.html if username is not in the database
    }

    startQuizButton.addEventListener('click', () => {
        // Clear previous feedback from localStorage
        localStorage.removeItem('feedbackList');

        getProgress(username);
        startQuiz();
    });

    function startQuiz() {
        fetchQuestion()
            .then(data => {
                currentQuestion = data;
                displayQuestion(data);
                toggleSections();
            })
            .catch(error => console.error('Question could not be fetched: ', error));
    }

    function fetchQuestion() {
        return fetch(`http://localhost:8080/api/questionTest?difficulty=${currentDifficulty}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched question data:', data);
                return data;
            })
            .catch(error => console.error('Error fetching question:', error));
    }

    function toggleSections() {
        quizSetup.style.display = 'none';
        quizSection.style.display = 'block';
    }

    function displayQuestion(question) {
        questionBox.innerHTML = ''; // Clear previous content

        const questionText = document.createElement('p');
        questionText.textContent = question.questionText;
        questionBox.appendChild(questionText);

        if (question.choices) {
            question.choices.forEach(choice => {
                const choiceLabel = document.createElement('label');
                const choiceInput = document.createElement('input');
                choiceInput.type = 'checkbox';
                choiceInput.name = 'quiz-choice';
                choiceInput.value = choice;

                choiceLabel.appendChild(choiceInput);
                choiceLabel.appendChild(document.createTextNode(choice));
                questionBox.appendChild(choiceLabel);
                questionBox.appendChild(document.createElement('br'));
            });
        }

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.id = 'submit-quiz-btn';
        submitButton.addEventListener('click', submitAnswer);
        questionBox.appendChild(submitButton);
    }

    function submitAnswer() {
        const selectedAnswer = getSelectedChoice();
        if (selectedAnswer === null) {
            alert('Please select an answer before submitting!');
            return;
        }

        fetch(`http://localhost:8080/api/feedback?questionId=${currentQuestion.questionId}&userAnswer=${selectedAnswer}`)
            .then(response => response.text())
            .then(feedback => {
                alert(feedback);

                // Save feedback to localStorage
                saveFeedbackToLocalStorage(feedback);

                const isCorrect = feedback.startsWith('Correct:');

                fetch(`http://localhost:8080/api/updateProgress?userId=${username}&difficulty=${currentDifficulty}&correct=${isCorrect}`, {
                    method: 'POST'
                }).catch(error => console.error('Error updating progress:', error));

                fetch(`http://localhost:8080/api/updateDifficulty?correct=${isCorrect}&currentDifficulty=${currentDifficulty}`)
                    .then(response => response.text())
                    .then(newDifficulty => {
                        currentDifficulty = newDifficulty;
                        fetchQuestion().then(data => {
                            currentQuestion = data;
                            displayQuestion(data);
                            getProgress(username);
                        }).catch(error => console.error('Error fetching question:', error));
                    }).catch(error => console.error('Error updating difficulty:', error));
            }).catch(error => console.error('Error fetching feedback:', error));
    }

    function getSelectedChoice() {
        const choices = document.getElementsByName('quiz-choice');
        for (let i = 0; i < choices.length; i++) {
            if (choices[i].checked) {
                return choices[i].value;
            }
        }
        return null;
    }

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

    function saveFeedbackToLocalStorage(feedback) {
        const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackList.push(feedback);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
    }
});
