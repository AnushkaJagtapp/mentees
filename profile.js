// Add to result.html
<button id="viewProfile">View Your Profile</button>

// New profile.js
const tasks = {
  healthy: [
    "Practice gratitude journaling",
    "Connect with a friend this week",
    "Try a new hobby"
  ],
  moderate: [
    "15-minute daily meditation",
    "Establish sleep routine",
    "Limit screen time before bed"
  ],
  needsHelp: [
    "Contact a mental health professional",
    "Reach out to support networks",
    "Prioritize self-care activities"
  ]
};

document.getElementById('viewProfile').addEventListener('click', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const score = parseFloat(localStorage.getItem('mentalHealthScore'));
  
  let recommendedTasks = [];
  if (score >= 7) recommendedTasks = tasks.healthy;
  else if (score >= 5) recommendedTasks = tasks.moderate;
  else recommendedTasks = tasks.needsHelp;

  user.tests.push({ 
    date: new Date().toLocaleDateString(),
    score,
    tasks: recommendedTasks 
  });

  localStorage.setItem('currentUser', JSON.stringify(user));
  displayProfile(user);
});

function displayProfile(user) {
  const latestTest = user.tests[user.tests.length - 1];
  const profileHTML = `
    <h2>Your Mental Health Profile</h2>
    <div class="test-history">
      ${user.tests.map(test => `
        <div class="test-entry">
          <p>Date: ${test.date}</p>
          <p>Score: ${test.score}/10</p>
          <h3>Recommended Tasks:</h3>
          <ul>
            ${test.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('profileContainer').innerHTML = profileHTML;
}