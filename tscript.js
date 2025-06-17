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
const showSolutionBtn = document.getElementById('show-solution');
const solutionView = document.querySelector('.solution-view');
const solutionCode = document.getElementById('solution-code');
const solutionTabs = document.querySelectorAll('.solution-tab');

// Current state
let currentProblem = null;
let problems = [];
let currentSolutionLang = 'python';

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
    
    // Reset solution view
    solutionView.style.display = 'none';
    showSolutionBtn.textContent = 'Решение';
    
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
async function runCode() {
    if (!currentProblem) return;
    
    testCaseResults.innerHTML = '';
    const code = window.codeEditor.getValue();
    const language = languageSelect.value;
    
    try {
        for (const testCase of currentProblem.testCases) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'test-case';
            
            try {
                let result;
                
                if (language === 'javascript') {
                    // Create a function from the code
                    const userFunction = new Function('return ' + code)();
                    result = userFunction(...testCase.input);
                } else if (language === 'python') {
                    // Execute Python code using Pyodide
                    if (!window.pyodide) {
                        throw new Error("Pyodide is not initialized yet. Please wait a moment and try again.");
                    }

                    // Wrap the code in a function to handle input parameters
                    const wrappedCode = `
def solution(*args):
${code.split('\n').map(line => '    ' + line).join('\n')}

result = solution(${testCase.input.map(arg => JSON.stringify(arg)).join(', ')})
`;
                    
                    // Execute the code
                    await window.pyodide.runPythonAsync(wrappedCode);
                    result = window.pyodide.globals.get('result');
                } else {
                    throw new Error(`Language ${language} is not supported yet`);
                }
                
                const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.output);
                
                resultDiv.innerHTML = `
                    <h4>Test Case</h4>
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
                    <h4>Test Case</h4>
                    <p><strong>Input:</strong> ${JSON.stringify(testCase.input)}</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                `;
                resultDiv.classList.add('failed');
            }
            
            testCaseResults.appendChild(resultDiv);
        }
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

// Toggle solution view
function toggleSolution() {
    if (solutionView.style.display === 'none') {
        solutionView.style.display = 'block';
        showSolutionBtn.textContent = 'Скрыть решение';
        updateSolutionCode();
    } else {
        solutionView.style.display = 'none';
        showSolutionBtn.textContent = 'Решение';
    }
}

// Update solution code based on selected language
function updateSolutionCode() {
    if (!currentProblem || !currentProblem.solutions) return;
    
    const solution = currentProblem.solutions[currentSolutionLang];
    if (solution) {
        solutionCode.textContent = solution;
    } else {
        solutionCode.textContent = 'Решение на этом языке пока недоступно';
    }
}

// Switch solution language
function switchSolutionLanguage(lang) {
    currentSolutionLang = lang;
    solutionTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.lang === lang);
    });
    updateSolutionCode();
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
    
    showSolutionBtn.addEventListener('click', toggleSolution);
    
    solutionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchSolutionLanguage(tab.dataset.lang);
        });
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 