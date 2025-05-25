// DOM elements
const problemsTable = document.getElementById('problems-table');
const problemsList = document.querySelector('.problems-list');
const problemView = document.querySelector('.problem-view');
const problemTitle = document.getElementById('problem-title');
const problemDifficulty = document.getElementById('problem-difficulty');
const problemDescription = document.getElementById('problem-description');
const backToListBtn = document.getElementById('back-to-list');
const runCodeBtn = document.getElementById('run-code');
const submitCodeBtn = document.getElementById('submit-code');
const languageSelect = document.getElementById('language-select');
const testCaseResults = document.getElementById('test-case-results');

// Current state
let currentProblem = null;
let problems = [];

// Initialize the app
async function init() {
    try {
        const response = await fetch('problems.json');
        const data = await response.json();
        problems = data.problems;
        renderProblemsList();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading problems:', error);
        alert('Ошибка загрузки задач. Пожалуйста, обновите страницу.');
    }
}

// Render problems list
function renderProblemsList() {
    problemsTable.innerHTML = '';
    
    problems.forEach(problem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${problem.id}</td>
            <td><span class="problem-title">${problem.title}</span></td>
            <td><span class="difficulty ${problem.difficulty}">${problem.difficulty}</span></td>
            <td>${problem.acceptance}</td>
        `;
        
        row.querySelector('.problem-title').addEventListener('click', () => {
            showProblem(problem);
        });
        
        problemsTable.appendChild(row);
    });
}

// Show problem view
function showProblem(problem) {
    currentProblem = problem;
    
    // Update problem info
    problemTitle.textContent = problem.title;
    problemDifficulty.textContent = problem.difficulty;
    problemDifficulty.className = `difficulty ${problem.difficulty}`;
    problemDescription.innerHTML = problem.description;
    
    // Set default code based on selected language
    updateCodeEditor();
    
    // Show problem view and hide list
    problemsList.style.display = 'none';
    problemView.style.display = 'block';
}

// Update code editor with default code for selected language
function updateCodeEditor() {
    if (!currentProblem) return;
    
    const language = languageSelect.value;
    const defaultCode = currentProblem.defaultCode[language] || '';
    
    if (window.codeEditor) {
        window.codeEditor.setValue(defaultCode);
        
        // Set mode based on language
        const mode = language === 'python' ? 'ace/mode/python' : 'ace/mode/javascript';
        window.codeEditor.session.setMode(mode);
    }
}

// Run code against test cases
function runCode() {
    if (!currentProblem) return;
    
    testCaseResults.innerHTML = '';
    const code = window.codeEditor.getValue();
    const language = languageSelect.value;
    
    try {
        currentProblem.testCases.forEach((testCase, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'test-case';
            
            // Try to execute the code (this is a simplified approach)
            // In a real app, you would use a more secure method like a sandbox
            try {
                let userFunction;
                
                if (language === 'javascript') {
                    // Create a function from the code
                    userFunction = new Function('return ' + code)();
                } else {
                    // For demo purposes, we'll just show Python code without executing
                    resultDiv.innerHTML = `
                        <h4>Test Case ${index + 1}</h4>
                        <p><strong>Input:</strong> ${JSON.stringify(testCase.input)}</p>
                        <p><strong>Expected Output:</strong> ${JSON.stringify(testCase.output)}</p>
                        <p><strong>Note:</strong> Python execution is not supported in this demo</p>
                    `;
                    resultDiv.classList.add('failed');
                    testCaseResults.appendChild(resultDiv);
                    return;
                }
                
                // Execute the function with test case input
                const result = userFunction(...testCase.input);
                const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.output);
                
                resultDiv.innerHTML = `
                    <h4>Test Case ${index + 1}</h4>
                    <p><strong>Input:</strong> ${JSON.stringify(testCase.input)}</p>
                    <p><strong>Expected Output:</strong> ${JSON.stringify(testCase.output)}</p>
                    <p><strong>Your Output:</strong> ${JSON.stringify(result)}</p>
                `;
                
                if (isCorrect) {
                    resultDiv.classList.add('passed');
                } else {
                    resultDiv.classList.add('failed');
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <h4>Test Case ${index + 1}</h4>
                    <p><strong>Input:</strong> ${JSON.stringify(testCase.input)}</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                `;
                resultDiv.classList.add('failed');
            }
            
            testCaseResults.appendChild(resultDiv);
        });
    } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'test-case failed';
        errorDiv.textContent = `Error: ${error.message}`;
        testCaseResults.appendChild(errorDiv);
    }
}

// Submit code (in a real app, this would send to a server)
function submitCode() {
    runCode();
    // In a real app, you would also check against hidden test cases
    alert('Submission complete! Check test case results.');
}

// Setup event listeners
function setupEventListeners() {
    backToListBtn.addEventListener('click', () => {
        problemsList.style.display = 'block';
        problemView.style.display = 'none';
    });
    
    runCodeBtn.addEventListener('click', runCode);
    submitCodeBtn.addEventListener('click', submitCode);
    
    languageSelect.addEventListener('change', updateCodeEditor);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 