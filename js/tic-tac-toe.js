/**
 * Tic-tac-toe Game for Abhijeet's Portfolio Website
 * Full implementation with AI opponent and scoring
 */

// Game state
let ticTacToe = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameOver: false,
    score: 0,
    moveCount: 0,
    updateScoreCallback: null,
    container: null,
    boardElement: null,
    difficulty: 'medium', // easy, medium, hard
    playerSymbol: 'X',
    aiSymbol: 'O'
};

/**
 * Initialize the Tic-tac-toe game
 * 
 * @param {HTMLElement} container - The container to render the game in
 * @param {Function} updateScore - Callback function to update the score display
 */
function initTicTacToe(container, updateScore) {
    // Store references
    ticTacToe.container = container;
    ticTacToe.updateScoreCallback = updateScore;
    
    // Reset game state
    resetTicTacToeGame();
    
    // Create game interface
    createTicTacToeInterface();
    
    // Start the game
    if (ticTacToe.currentPlayer === ticTacToe.aiSymbol) {
        setTimeout(makeAIMove, 700); // AI goes first with a small delay
    }
}

/**
 * Reset the Tic-tac-toe game state
 */
function resetTicTacToeGame() {
    ticTacToe.board = Array(9).fill(null);
    ticTacToe.currentPlayer = ticTacToe.playerSymbol;
    ticTacToe.gameOver = false;
    ticTacToe.score = 0;
    ticTacToe.moveCount = 0;
    
    // Update score display
    if (ticTacToe.updateScoreCallback) {
        ticTacToe.updateScoreCallback(ticTacToe.score);
    }
}

/**
 * Create the Tic-tac-toe game interface
 */
function createTicTacToeInterface() {
    // Clear container
    ticTacToe.container.innerHTML = '';
    
    // Create game controls
    const gameControls = document.createElement('div');
    gameControls.className = 'ttt-controls';
    gameControls.innerHTML = `
        <div class="ttt-difficulty">
            <label>Difficulty:</label>
            <select id="ttt-difficulty">
                <option value="easy" ${ticTacToe.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                <option value="medium" ${ticTacToe.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="hard" ${ticTacToe.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
            </select>
        </div>
        <div class="ttt-symbols">
            <label>Play as:</label>
            <select id="ttt-symbol">
                <option value="X" ${ticTacToe.playerSymbol === 'X' ? 'selected' : ''}>X (First)</option>
                <option value="O" ${ticTacToe.playerSymbol === 'O' ? 'selected' : ''}>O (Second)</option>
            </select>
        </div>
    `;
    
    // Create game board
    const board = document.createElement('div');
    board.className = 'tic-tac-toe-board';
    ticTacToe.boardElement = board;
    
    // Create cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tic-tac-toe-cell';
        cell.dataset.index = i;
        
        // Add click event
        cell.addEventListener('click', () => handleCellClick(i));
        
        board.appendChild(cell);
    }
    
    // Create status message
    const statusMessage = document.createElement('div');
    statusMessage.id = 'ttt-status';
    statusMessage.className = 'ttt-status';
    statusMessage.textContent = `Your turn (${ticTacToe.playerSymbol})`;
    
    // Add all elements to container
    ticTacToe.container.appendChild(gameControls);
    ticTacToe.container.appendChild(board);
    ticTacToe.container.appendChild(statusMessage);
    
    // Add event listeners for controls
    const difficultySelect = document.getElementById('ttt-difficulty');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', (e) => {
            ticTacToe.difficulty = e.target.value;
            resetTicTacToeGame();
            updateTicTacToeBoard();
        });
    }
    
    const symbolSelect = document.getElementById('ttt-symbol');
    if (symbolSelect) {
        symbolSelect.addEventListener('change', (e) => {
            ticTacToe.playerSymbol = e.target.value;
            ticTacToe.aiSymbol = ticTacToe.playerSymbol === 'X' ? 'O' : 'X';
            resetTicTacToeGame();
            updateTicTacToeBoard();
            
            // If AI goes first
            if (ticTacToe.currentPlayer === ticTacToe.aiSymbol) {
                setTimeout(makeAIMove, 700);
            }
        });
    }
}

/**
 * Handle cell click
 * 
 * @param {number} index - Index of the clicked cell
 */
function handleCellClick(index) {
    // Ignore if game is over or cell is already occupied or not player's turn
    if (ticTacToe.gameOver || 
        ticTacToe.board[index] !== null || 
        ticTacToe.currentPlayer !== ticTacToe.playerSymbol) {
        return;
    }
    
    // Make player move
    makeMove(index);
    
    // Check game state
    checkGameState();
    
    // AI move if game is not over
    if (!ticTacToe.gameOver) {
        // Update status message
        updateStatusMessage(`AI is thinking...`);
        
        // Make AI move after a short delay
        setTimeout(makeAIMove, 700);
    }
}

/**
 * Make a move
 * 
 * @param {number} index - Index of the cell to make a move in
 */
function makeMove(index) {
    // Update board state
    ticTacToe.board[index] = ticTacToe.currentPlayer;
    ticTacToe.moveCount++;
    
    // Update board display
    updateTicTacToeBoard();
    
    // Switch player
    ticTacToe.currentPlayer = ticTacToe.currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Update the Tic-tac-toe board display
 */
function updateTicTacToeBoard() {
    // Update each cell
    const cells = ticTacToe.boardElement.querySelectorAll('.tic-tac-toe-cell');
    
    cells.forEach((cell, index) => {
        const value = ticTacToe.board[index];
        
        // Clear cell
        cell.textContent = '';
        cell.classList.remove('cell-x', 'cell-o');
        
        // Set cell content and class
        if (value === 'X') {
            cell.textContent = 'X';
            cell.classList.add('cell-x');
        } else if (value === 'O') {
            cell.textContent = 'O';
            cell.classList.add('cell-o');
        }
    });
}

/**
 * Check game state for win, draw, or continue
 */
function checkGameState() {
    // Check for winner
    const winner = getWinner();
    
    if (winner) {
        ticTacToe.gameOver = true;
        
        // Update score if player wins
        if (winner === ticTacToe.playerSymbol) {
            // Calculate score based on moves and difficulty
            const difficultyMultiplier = {
                'easy': 1,
                'medium': 2,
                'hard': 3
            };
            
            const baseScore = 100;
            const moveBonus = Math.max(0, 9 - ticTacToe.moveCount) * 10;
            const difficultyBonus = difficultyMultiplier[ticTacToe.difficulty] * 50;
            
            ticTacToe.score = baseScore + moveBonus + difficultyBonus;
            
            // Update score display
            if (ticTacToe.updateScoreCallback) {
                ticTacToe.updateScoreCallback(ticTacToe.score);
            }
            
            // Update status message
            updateStatusMessage(`You win! Score: ${ticTacToe.score}`);
        } else {
            // AI wins
            updateStatusMessage(`AI wins!`);
        }
        
        // Highlight winning cells
        highlightWinningCells();
        
    } else if (ticTacToe.moveCount === 9) {
        // Draw
        ticTacToe.gameOver = true;
        
        // Add small score for draw
        ticTacToe.score = 25;
        
        // Update score display
        if (ticTacToe.updateScoreCallback) {
            ticTacToe.updateScoreCallback(ticTacToe.score);
        }
        
        // Update status message
        updateStatusMessage(`Game ended in a draw! Score: ${ticTacToe.score}`);
    } else {
        // Game continues
        updateStatusMessage(`${ticTacToe.currentPlayer === ticTacToe.playerSymbol ? 'Your' : 'AI\'s'} turn (${ticTacToe.currentPlayer})`);
    }
}

/**
 * Update the status message
 * 
 * @param {string} message - Message to display
 */
function updateStatusMessage(message) {
    const statusElement = document.getElementById('ttt-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

/**
 * Get winner of the game
 * 
 * @returns {string|null} Winner symbol ('X' or 'O') or null if no winner
 */
function getWinner() {
    // Winning patterns
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Check each pattern
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (ticTacToe.board[a] && 
            ticTacToe.board[a] === ticTacToe.board[b] && 
            ticTacToe.board[a] === ticTacToe.board[c]) {
            return ticTacToe.board[a];
        }
    }
    
    return null;
}

/**
 * Highlight winning cells
 */
function highlightWinningCells() {
    // Winning patterns
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Find winning pattern
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (ticTacToe.board[a] && 
            ticTacToe.board[a] === ticTacToe.board[b] && 
            ticTacToe.board[a] === ticTacToe.board[c]) {
            
            // Highlight winning cells
            const cells = ticTacToe.boardElement.querySelectorAll('.tic-tac-toe-cell');
            cells[a].classList.add('winning-cell');
            cells[b].classList.add('winning-cell');
            cells[c].classList.add('winning-cell');
            
            return;
        }
    }
}

/**
 * Make AI move
 */
function makeAIMove() {
    if (ticTacToe.gameOver || ticTacToe.currentPlayer !== ticTacToe.aiSymbol) {
        return;
    }
    
    let move;
    
    // Choose move based on difficulty
    switch (ticTacToe.difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            // 70% chance of optimal move, 30% chance of random move
            move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
        default:
            move = getRandomMove();
    }
    
    // Make move
    if (move !== null) {
        makeMove(move);
        checkGameState();
    }
}

/**
 * Get random valid move
 * 
 * @returns {number|null} Index of random empty cell or null if no empty cells
 */
function getRandomMove() {
    // Get empty cells
    const emptyCells = ticTacToe.board
        .map((cell, index) => cell === null ? index : null)
        .filter(index => index !== null);
    
    // Return random empty cell or null if no empty cells
    return emptyCells.length > 0 
        ? emptyCells[Math.floor(Math.random() * emptyCells.length)] 
        : null;
}

/**
 * Get best move using minimax algorithm
 * 
 * @returns {number} Index of best move
 */
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;
    
    // Try each empty cell
    for (let i = 0; i < 9; i++) {
        if (ticTacToe.board[i] === null) {
            // Make move
            ticTacToe.board[i] = ticTacToe.aiSymbol;
            
            // Calculate score
            const score = minimax(ticTacToe.board, 0, false);
            
            // Undo move
            ticTacToe.board[i] = null;
            
            // Update best score and move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

/**
 * Minimax algorithm for finding optimal move
 * 
 * @param {Array} board - Current board state
 * @param {number} depth - Current depth in the game tree
 * @param {boolean} isMaximizing - Whether current player is maximizing
 * @returns {number} Score of the board position
 */
function minimax(board, depth, isMaximizing) {
    // Check for terminal state
    const winner = getWinnerFromBoard(board);
    
    if (winner === ticTacToe.aiSymbol) {
        return 10 - depth; // AI wins, prioritize quicker wins
    } else if (winner === ticTacToe.playerSymbol) {
        return depth - 10; // Player wins, prioritize delaying loss
    } else if (isBoardFull(board)) {
        return 0; // Draw
    }
    
    if (isMaximizing) {
        // AI's turn (maximizing)
        let bestScore = -Infinity;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                // Make move
                board[i] = ticTacToe.aiSymbol;
                
                // Calculate score
                const score = minimax(board, depth + 1, false);
                
                // Undo move
                board[i] = null;
                
                // Update best score
                bestScore = Math.max(score, bestScore);
            }
        }
        
        return bestScore;
    } else {
        // Player's turn (minimizing)
        let bestScore = Infinity;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                // Make move
                board[i] = ticTacToe.playerSymbol;
                
                // Calculate score
                const score = minimax(board, depth + 1, true);
                
                // Undo move
                board[i] = null;
                
                // Update best score
                bestScore = Math.min(score, bestScore);
            }
        }
        
        return bestScore;
    }
}

/**
 * Get winner from board state
 * 
 * @param {Array} board - Board state to check
 * @returns {string|null} Winner symbol ('X' or 'O') or null if no winner
 */
function getWinnerFromBoard(board) {
    // Winning patterns
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Check each pattern
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (board[a] && 
            board[a] === board[b] && 
            board[a] === board[c]) {
            return board[a];
        }
    }
    
    return null;
}

/**
 * Check if board is full
 * 
 * @param {Array} board - Board state to check
 * @returns {boolean} Whether board is full
 */
function isBoardFull(board) {
    return board.every(cell => cell !== null);
}

/**
 * Restart Tic-tac-toe game
 */
function restartTicTacToe() {
    resetTicTacToeGame();
    updateTicTacToeBoard();
    
    // Update status message
    updateStatusMessage(`Your turn (${ticTacToe.playerSymbol})`);
    
    // AI goes first if player is O
    if (ticTacToe.currentPlayer === ticTacToe.aiSymbol) {
        setTimeout(makeAIMove, 700);
    }
}

/**
 * Clean up Tic-tac-toe game
 */
function destroyTicTacToe() {
    // Reset game state
    ticTacToe = {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        gameOver: false,
        score: 0,
        moveCount: 0,
        updateScoreCallback: null,
        container: null,
        boardElement: null,
        difficulty: 'medium',
        playerSymbol: 'X',
        aiSymbol: 'O'
    };
}

// Export functions for game-manager.js
window.initTicTacToe = initTicTacToe;
window.restartTicTacToe = restartTicTacToe;
window.destroyTicTacToe = destroyTicTacToe;