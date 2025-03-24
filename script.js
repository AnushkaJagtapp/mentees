// Global variables
let currentQuestion = 0;
const answers = [];
const questions = [
    "I feel optimistic about the future.",
    "I have trouble concentrating on tasks.",
    "I feel anxious or worried most of the time.",
    "I feel happy and content with my life.",
    "I have trouble sleeping at night.",
    "I feel supported by my friends and family.",
    "I feel overwhelmed by my responsibilities.",
    "I enjoy activities that I used to enjoy.",
    "I feel tired or lack energy most days.",
    "I feel confident in my abilities.",
    "I feel lonely or isolated.",
    "I feel like I have control over my life.",
    "I feel irritable or angry most of the time.",
    "I feel like I can cope with stress effectively.",
    "I feel like I have a purpose in life."
];

// Navigation functions
function startTest() {
    window.location.href = "questions.html";
}

function loadQuestion() {
    const questionDisplay = document.getElementById("question-display");
    const progress = document.getElementById("progress");
    
    // Update progress bar
    progress.style.width = `${(currentQuestion / questions.length) * 100}%`;
    
    // Create question HTML with properly structured buttons
    questionDisplay.innerHTML = `
        <div class="question-text">Question ${currentQuestion + 1} of ${questions.length}: ${questions[currentQuestion]}</div>
        <div class="answer-buttons-container">
            <div class="answer-buttons">
                <button class="answer-btn" data-value="1">Strongly Disagree</button>
                <button class="answer-btn" data-value="2">Disagree</button>
                <button class="answer-btn" data-value="3">No Opinion</button>
                <button class="answer-btn" data-value="4">Agree</button>
                <button class="answer-btn" data-value="5">Strongly Agree</button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectAnswer(parseInt(this.dataset.value));
        });
        
        // Highlight if already selected
        if (answers[currentQuestion] === parseInt(btn.dataset.value)) {
            btn.classList.add('selected');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    prevBtn.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Submit' : 'Next';
    
    // Add event listeners to nav buttons
    prevBtn.onclick = prevQuestion;
    nextBtn.onclick = nextQuestion;
}

function selectAnswer(value) {
    answers[currentQuestion] = value;
    
    // Update button styles
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.value) === value) {
            btn.classList.add('selected');
        }
    });
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (answers[currentQuestion] === undefined) {
        alert("You must answer the question first to proceed to the next one.");
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        calculateResults();
    }
}

function calculateResults() {
    // Reverse score for negative questions (2,3,5,7,9,11,13)
    const reversedQuestions = [1, 2, 4, 6, 8, 10, 12]; // zero-based index
    const processedAnswers = answers.map((answer, index) => {
        return reversedQuestions.includes(index) ? 6 - answer : answer;
    });
    
    const totalScore = processedAnswers.reduce((sum, value) => sum + value, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;
    const scaledScore = Math.round((percentage / 10) * 10) / 10; // Score from 1-10
    
    // Store results in localStorage to pass to result page
    localStorage.setItem('mentalHealthScore', scaledScore);
    window.location.href = "result.html";
}

function showResults() {
    const score = parseFloat(localStorage.getItem('mentalHealthScore'));
    const meterBar = document.getElementById("meterBar");
    const scoreNumber = document.getElementById("scoreNumber");
    const resultText = document.getElementById("resultText");
    const recommendations = document.getElementById("recommendations");
    
    // Calculate percentage for meter bar
    const percentage = (score / 10) * 100;
    meterBar.style.width = `${percentage}%`;
    
    // Set color based on score
    let color, healthStatus;
    if (score >= 8) {
        color = '#2ecc71'; // Green
        healthStatus = "Excellent Mental Health";
    } else if (score >= 6) {
        color = '#f1c40f'; // Yellow
        healthStatus = "Good Mental Health";
    } else if (score >= 4) {
        color = '#e67e22'; // Orange
        healthStatus = "Moderate Mental Health";
    } else {
        color = '#e74c3c'; // Red
        healthStatus = "Poor Mental Health";
    }
    
    meterBar.style.backgroundColor = color;
    scoreNumber.textContent = score;
    scoreNumber.style.color = color;
    resultText.textContent = healthStatus;
    resultText.style.backgroundColor = `${color}20`;
    
    // Provide recommendations
    let recommendationHTML = '<h3>Recommendations</h3><ul>';
    
    if (score >= 8) {
        recommendationHTML += `
            <li>Continue your healthy habits</li>
            <li>Practice gratitude daily</li>
            <li>Consider helping others with mental health</li>
        `;
    } else if (score >= 6) {
        recommendationHTML += `
            <li>Practice mindfulness or meditation</li>
            <li>Maintain regular sleep schedule</li>
            <li>Connect with friends/family regularly</li>
        `;
    } else if (score >= 4) {
        recommendationHTML += `
            <li>Consider talking to a mental health professional</li>
            <li>Establish a daily routine</li>
            <li>Engage in regular physical activity</li>
        `;
    } else {
        recommendationHTML += `
            <li>Seek professional help from a therapist</li>
            <li>Reach out to trusted friends/family</li>
            <li>Contact a mental health hotline if needed</li>
        `;
    }
    
    recommendationHTML += '</ul>';
    recommendations.innerHTML = recommendationHTML;
}

// Initialize appropriate page
if (window.location.pathname.endsWith("questions.html")) {
    document.addEventListener('DOMContentLoaded', loadQuestion);
} else if (window.location.pathname.endsWith("result.html")) {
    document.addEventListener('DOMContentLoaded', showResults);
}