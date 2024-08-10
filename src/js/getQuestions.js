document.addEventListener('DOMContentLoaded', function () {
    const startQuizButton = document.getElementById('start-quiz-btn');
    const questionBox = document.getElementById('question-container');
    const quizSetup = document.getElementById('quiz-setup');
    const quizSection = document.getElementById('quiz');
    let currentQuestion = null;
    let currentDifficulty = 'easy';
    const username = localStorage.getItem('username'); // username

    if (!username) {
        window.location.href = 'login.html'; // Redirect to loginPage.html if username is not in the database
    }

    /**
     * Handles the start quiz button click event.
     * Resets the algorithm, clears previous feedback, and starts the quiz.
     */

    startQuizButton.addEventListener('click', () => {
        // Clear previous feedback from localStorage
        localStorage.removeItem('feedbackList');

        resetAlgorithm()
            .then(() => {
                getProgress(username);
                startQuiz();
            })
            .catch(error => console.error("Unable to reset the algorithm:", error));


    });

    /**
     * resetAlgorithm makes a request to reset the user's progress and streaks on the backend.
     *
     * @returns {Promise} - Resolves if the algorithm reset is successful.
     */
    function resetAlgorithm() {
        return fetch("http://localhost:8080/api/resetStreaks", {
            method: "POST"
        })
    }
    /**
     * Starts the quiz by fetching the first question and displaying it.
     */
    function startQuiz() {
        fetchQuestion()
            .then(data => {
                currentQuestion = data;
                displayQuestion(data);
                toggleSections();
            })
            .catch(error => console.error('Question could not be fetched: ', error));
    }
    /**
     * Fetches a question from the backend based on the current difficulty level.
     *
     * @returns {Promise<Object>} - The fetched question object.
     */
    function fetchQuestion() {
        return fetch(`http://localhost:8080/api/getQuestion?difficulty=${currentDifficulty}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched question data:', data);
                return data;
            })
            .catch(error => console.error('Error fetching question:', error));
    }
    /**
     * Toggles the display sections to show the quiz interface and hide the setup interface.
     */
    function toggleSections() {
        quizSetup.style.display = 'none';
        quizSection.style.display = 'block';
    }
    /**
     * Displays the fetched question and its choices in the quiz container.
     *
     * @param {Object} question - The question object to be displayed.
     */
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
    /**
     * Submits the user's selected answer and processes the feedback.
     * Updates the quiz difficulty and progress based on the user's performance.
     */
    function submitAnswer() {
        const selectedAnswer = getSelectedChoice();

        if (selectedAnswer === null) {
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
    /**
     * Retrieves the selected answer from the list of choices.
     *
     * @returns {string|null} - The selected answer or null if no valid choice is selected.
     */
    function getSelectedChoice() {
        const choices = document.getElementsByName('quiz-choice');
        let choice;
        let numberOfSelections = 0;

        for (let i = 0; i < choices.length; i++) {
            if (choices[i].checked) {
                numberOfSelections ++;
                choice = choices[i].value;
            }
        }

        if (numberOfSelections > 1 || numberOfSelections === 0 || numberOfSelections === null) {
            alert('Please select one answer before submitting!');
            choice = null;
        }

        return choice;
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
    /**
     * Saves the feedback for the user's answer to local storage.
     *
     * @param {string} feedback - The feedback text to be saved.
     */
    function saveFeedbackToLocalStorage(feedback) {
        const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackList.push(feedback);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
    }
});
