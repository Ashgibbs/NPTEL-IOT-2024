// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Get References to HTML Elements ---
    const weekSelectorContainer = document.getElementById('week-selector');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const solutionContainer = document.getElementById('solution-container');
    const resultText = document.getElementById('result-text');
    const solutionText = document.getElementById('solution-text');
    const nextButton = document.getElementById('next-button');
    const homeButton = document.getElementById('home-button');

    // --- 2. App State Variables ---
    let allQuestions = {};      // Will hold all questions from JSON
    let currentQuiz = [];       // Array of questions for the selected week
    let currentQuestionIndex = 0; // The current question number (0-14)
    const TOTAL_WEEKS = 12;

    // --- 3. Fetch Questions and Initialize App ---
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            createWeekButtons();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            weekSelectorContainer.innerHTML = '<p>Error: Could not load questions.json. Please make sure the file exists and is in the same directory.</p>';
        });

    // --- 4. Create Week Selection Buttons ---
    function createWeekButtons() {
        const buttonWrapper = document.createElement('div');
        for (let i = 1; i <= TOTAL_WEEKS; i++) {
            const weekKey = `week${i}`;
            if (allQuestions[weekKey] && allQuestions[weekKey].length > 0) {
                const button = document.createElement('button');
                button.innerText = `Week ${i}`;
                // Add a click event to start the quiz for that week
                button.addEventListener('click', () => startQuiz(weekKey));
                buttonWrapper.appendChild(button);
            }
        }
        weekSelectorContainer.appendChild(buttonWrapper);
    }

    // --- 5. Start the Quiz ---
    function startQuiz(weekKey) {
        currentQuiz = allQuestions[weekKey];
        currentQuestionIndex = 0;
        quizTitle.innerText = `Week ${weekKey.replace('week', '')} Quiz`;
        
        // Show the quiz and hide the week selector
        quizContainer.classList.remove('hidden');
        weekSelectorContainer.classList.add('hidden');
        homeButton.classList.remove('hidden');

        displayQuestion();
    }

    // --- 6. Display a Question ---
    function displayQuestion() {
        // Reset the UI
        optionsContainer.innerHTML = '';
        solutionContainer.classList.add('hidden');
        nextButton.classList.add('hidden');

        // Get the current question object
        const question = currentQuiz[currentQuestionIndex];

        // Update UI elements
        questionText.innerText = question.question;
        questionNumber.innerText = currentQuestionIndex + 1;

        // Create a button for each option
        question.options.forEach(optionText => {
            const button = document.createElement('button');
            button.innerText = optionText;
            button.classList.add('option');
            button.addEventListener('click', () => checkAnswer(button, optionText, question));
            optionsContainer.appendChild(button);
        });
    }

    // --- 7. Check the Selected Answer ---
    function checkAnswer(selectedButton, selectedAnswer, question) {
        // Disable all option buttons to prevent multiple clicks
        Array.from(optionsContainer.children).forEach(button => {
            button.disabled = true;
            // Highlight the correct answer
            if (button.innerText === question.correctAnswer) {
                button.classList.add('correct');
            }
        });

        // Mark the user's choice and show the result
        if (selectedAnswer === question.correctAnswer) {
            resultText.innerText = "Correct!";
            resultText.style.color = "#155724"; // Green
        } else {
            selectedButton.classList.add('incorrect'); // Mark the wrong one
            resultText.innerText = "Incorrect";
            resultText.style.color = "#721c24"; // Red
        }

        // Show the solution
        solutionText.innerText = `Solution: ${question.solution}`;
        solutionContainer.classList.remove('hidden');

        // Show the "Next" or "Finish" button
        if (currentQuestionIndex < currentQuiz.length - 1) {
            nextButton.innerText = "Next Question";
            nextButton.classList.remove('hidden');
        } else {
            nextButton.innerText = "Finish Quiz";
            nextButton.classList.remove('hidden');
        }
    }

    // --- 8. Navigation Button Event Listeners ---
    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuiz.length - 1) {
            // Go to the next question
            currentQuestionIndex++;
            displayQuestion();
        } else {
            // Quiz is finished, go back home
            goHome();
        }
    });

    homeButton.addEventListener('click', goHome);

    function goHome() {
        // Hide quiz and show week selector
        quizContainer.classList.add('hidden');
        weekSelectorContainer.classList.remove('hidden');
        homeButton.classList.add('hidden');
    }
});