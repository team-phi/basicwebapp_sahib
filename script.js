const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const probabilityText = document.getElementById('probability'); // New line for probability
const restartButton = document.getElementById('restartButton');
const gameHeader = document.getElementById('gameHeader');
let currentPlayer = 'X';
let running = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        const cellA = cells[condition[0]].innerText;
        const cellB = cells[condition[1]].innerText;
        const cellC = cells[condition[2]].innerText;

        if (cellA === '' || cellB === '' || cellC === '') {
            continue;
        }

        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `${currentPlayer} Wins!`;
        confetti({ // Trigger confetti effect
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        running = false;
        cells.forEach(cell => cell.removeEventListener('click', cellClicked)); // Disable further clicks
        return;
    }

    if (![...cells].some(cell => cell.innerText === '')) {
        statusText.innerText = `Draw!`;
        running = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.innerText = `${currentPlayer}'s turn`;
    updateProbability(); // Update probability after each turn
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-cell-index');

    if (this.innerText !== '' || !running) {
        return;
    }

    this.innerText = currentPlayer;
    this.classList.add('taken');
    checkForWinner();
}

function restartGame() {
    currentPlayer = 'X';
    statusText.innerText = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('taken');
        cell.addEventListener('click', cellClicked); // Re-enable clicks on cells
    });
    running = true;
    updateGameHeader();
    updateProbability(); // Update probability on game restart
}

function updateGameHeader() {
    const welcomeMessages = [
        "Welcome to my game",
        "Ready for another round?",
        "Let's play Tic Tac Toe!",
        "Another game, another fun!",
        "Tic Tac Toe Time!"
    ];

    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    gameHeader.innerText = welcomeMessages[randomIndex];
}

// New function to update winning probability
function updateProbability() {
    let playerXProbability = 50; // Starting probability
    let playerOProbability = 50; // Starting probability

    const playerXCells = [...cells].filter(cell => cell.innerText === 'X').length;
    const playerOCells = [...cells].filter(cell => cell.innerText === 'O').length;
    
    playerXProbability += playerXCells * 5;
    playerOProbability += playerOCells * 5;

    const probabilityDisplay = currentPlayer === 'X' ? playerXProbability : playerOProbability;
    probabilityText.innerText = `Winning Probability: ${probabilityDisplay}%`;
}

cells.forEach(cell => cell.addEventListener('click', cellClicked));
restartButton.addEventListener('click', restartGame);

restartGame();
