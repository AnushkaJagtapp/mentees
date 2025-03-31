// ===== GLOBAL VARIABLES =====
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

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the appropriate page
    if (window.location.pathname.endsWith("questions.html")) {
        loadQuestion();
        setupEventListeners();
    } 
    else if (window.location.pathname.endsWith("result.html")) {
        showResults();
    }
    else if (window.location.pathname.endsWith("index.html")) {
        setupAuthButtons();
    }
});

// ===== AUTHENTICATION HANDLERS =====
function setupAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn && signupBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = "auth.html?mode=login";
        });
        
        signupBtn.addEventListener('click', () => {
            window.location.href = "auth.html?mode=signup";
        });
    }
}

// ===== QUESTION PAGE FUNCTIONS =====
function loadQuestion() {
    const questionDisplay = document.getElementById('question-display');
    const progressBar = document.querySelector('.progress');
    
    // Update progress bar
    const progressPercent = (currentQuestion / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Display current question
    questionDisplay.innerHTML = `
        <p class="question-text">Question ${currentQuestion + 1} of ${questions.length}: ${questions[currentQuestion]}</p>
        <div class="answer-buttons">
            <button class="answer-btn" data-value="1">Strongly Disagree</button>
            <button class="answer-btn" data-value="2">Disagree</button>
            <button class="answer-btn" data-value="3">Neutral</button>
            <button class="answer-btn" data-value="4">Agree</button>
            <button class="answer-btn" data-value="5">Strongly Agree</button>
        </div>
    `;
    
    // Highlight selected answer if exists
    if (answers[currentQuestion] !== undefined) {
        highlightSelectedAnswer(answers[currentQuestion]);
    }
    
    // Update navigation buttons
    updateNavButtons();
}

function setupEventListeners() {
    // Delegate events for answer buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('answer-btn')) {
            const selectedValue = parseInt(e.target.getAttribute('data-value'));
            selectAnswer(selectedValue);
        }
    });
    
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
}

function selectAnswer(value) {
    answers[currentQuestion] = value;
    highlightSelectedAnswer(value);
}

function highlightSelectedAnswer(value) {
    // Remove all selections first
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Highlight the selected one
    const selectedBtn = document.querySelector(`.answer-btn[data-value="${value}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Submit' : 'Next';
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function nextQuestion() {
    if (answers[currentQuestion] === undefined) {
        alert("Please select an answer before continuing.");
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        calculateResults();
    }
}

// ===== RESULT CALCULATION =====
function calculateResults() {
    // Reverse score for negative questions (questions 2,3,5,7,9,11,13 - zero-indexed)
    const reversedIndices = [1, 2, 4, 6, 8, 10, 12];
    const processedAnswers = answers.map((answer, index) => {
        return reversedIndices.includes(index) ? 6 - answer : answer;
    });
    
    const totalScore = processedAnswers.reduce((sum, value) => sum + value, 0);
    const maxPossibleScore = questions.length * 5;
    const percentage = (totalScore / maxPossibleScore) * 100;
    const scaledScore = Math.min(10, Math.max(1, Math.round((percentage / 10) * 10) / 10));
    
    // Save results and redirect
    localStorage.setItem('mentalHealthScore', scaledScore);
    localStorage.setItem('answers', JSON.stringify(answers));
    window.location.href = "result.html";
}

// ===== RESULT PAGE FUNCTIONS =====
function showResults() {
    const score = parseFloat(localStorage.getItem('mentalHealthScore'));
    const answers = JSON.parse(localStorage.getItem('answers')) || [];
    
    if (isNaN(score)) {
        window.location.href = "index.html";
        return;
    }
    
    updateScoreDisplay(score);
    showRecommendations(score);
    setupResultButtons();
}

function updateScoreDisplay(score) {
    const meterBar = document.getElementById('meterBar');
    const scoreNumber = document.getElementById('scoreNumber');
    const resultText = document.getElementById('resultText');
    
    // Calculate percentage for display
    const percentage = (score / 10) * 100;
    meterBar.style.width = `${percentage}%`;
    
    // Set color based on score
    let color, status;
    if (score >= 8) {
        color = '#2ecc71';
        status = "Excellent Mental Health";
    } else if (score >= 6) {
        color = '#f1c40f';
        status = "Good Mental Health";
    } else if (score >= 4) {
        color = '#e67e22';
        status = "Moderate Mental Health";
    } else {
        color = '#e74c3c';
        status = "Needs Improvement";
    }
    
    // Update display
    meterBar.style.backgroundColor = color;
    scoreNumber.textContent = score.toFixed(1);
    scoreNumber.style.color = color;
    resultText.textContent = status;
    resultText.style.backgroundColor = `${color}20`;
}

function showRecommendations(score) {
    const recommendations = document.getElementById('recommendations');
    let recommendationHTML = '<h3>Recommendations</h3><ul>';
    
    if (score >= 8) {
        recommendationHTML += `
            <li>Continue your healthy habits</li>
            <li>Practice gratitude journaling</li>
            <li>Consider mentoring others</li>
        `;
    } else if (score >= 6) {
        recommendationHTML += `
            <li>Try 10-minute daily meditation</li>
            <li>Establish a sleep routine</li>
            <li>Connect with friends weekly</li>
        `;
    } else if (score >= 4) {
        recommendationHTML += `
            <li>Consider talking to a professional</li>
            <li>Start a simple exercise routine</li>
            <li>Practice mindfulness daily</li>
        `;
    } else {
        recommendationHTML += `
            <li>Contact a mental health professional</li>
            <li>Reach out to your support network</li>
            <li>Prioritize self-care activities</li>
        `;
    }
    
    recommendations.innerHTML = recommendationHTML + '</ul>';
}

function setupResultButtons() {
    document.querySelector('.retake-btn').addEventListener('click', () => {
        window.location.href = "index.html";
    });
    
    document.querySelector('.create-account-btn').addEventListener('click', () => {
        window.location.href = "auth.html?mode=signup";
    });
}

// ===== START TEST FUNCTION =====
function startTest() {
    // Reset previous answers
    localStorage.removeItem('answers');
    localStorage.removeItem('mentalHealthScore');
    window.location.href = "questions.html";
}