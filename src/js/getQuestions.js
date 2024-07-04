$(document).ready(function() {
    let proficiency = {
        easy: 1/3,
        medium: 1/3,
        difficult: 1/3
    };

    $('#start-quiz-btn').click(function() {
        showNextQuestion();
        $('#quiz-setup').hide();
        $('#quiz').show();
        $('#progress').show();
    });

    function showNextQuestion() {
        const difficulty = selectDifficulty();
        fetchQuestions(difficulty).then(displayQuestions);
    }

    function fetchQuestions(difficulty) {
        return $.ajax({
            url: '/api/questions',
            data: { difficulty: difficulty },
            method: 'GET'
        });
    }

    function displayQuestions(questions) {
        if (questions.length === 0) {
            $('#question-container').html('<p>No questions available.</p>');
            return;
        }

        const question = questions[Math.floor(Math.random() * questions.length)];

        const questionHtml = `
            <div class="question" data-difficulty="${question.difficulty}" data-answer="${question.answer}">
                <h3>${question.text}</h3>
                <ul class="options">
                    ${question.options.map(option => `
                        <li><label><input type="radio" name="question" value="${option}"> ${option}</label></li>
                    `).join('')}
                </ul>
                <button class="submit-answer-btn">Submit Answer</button>
            </div>
        `;

        $('#question-container').html(questionHtml);

        $('.submit-answer-btn').click(function() {
            const selectedAnswer = $('input[name="question"]:checked').val();
            const correctAnswer = $(this).closest('.question').data('answer');
            const difficulty = $(this).closest('.question').data('difficulty');

            updateBayesHypothesis(difficulty, selectedAnswer === correctAnswer);
            showNextQuestion();
        });
    }

    function selectDifficulty() {
        const random = Math.random();
        if (random < proficiency.easy) {
            return 'easy';
        } else if (random < proficiency.easy + proficiency.medium) {
            return 'medium';
        } else {
            return 'difficult';
        }
    }

    function updateBayesHypothesis(difficulty, correct) {
        const updateFactor = correct ? 1.1 : 0.9;
        proficiency[difficulty] *= updateFactor;

        const total = proficiency.easy + proficiency.medium + proficiency.difficult;
        proficiency.easy /= total;
        proficiency.medium /= total;
        proficiency.difficult /= total;

        $('#proficiency-level').text(`Estimated Skill Level: Easy (${(proficiency.easy * 100).toFixed(1)}%), Medium (${(proficiency.medium * 100).toFixed(1)}%), Hard (${(proficiency.difficult * 100).toFixed(1)}%)`);
    }
});
