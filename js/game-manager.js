/**
 * Game Manager JavaScript for Abhijeet's Portfolio Website
 * Handles game initialization, scoring, and integration with analytics
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize game functionality
    initGames();
});

/**
 * Initialize games functionality
 */
function initGames() {
    const gameCards = document.querySelectorAll('.game-card');
    const gameArea = document.getElementById('game-area');
    const gameContainer = document.getElementById('game-container');
    const currentGameTitle = document.getElementById('current-game-title');
    const closeGameBtn = document.getElementById('close-game');
    const restartGameBtn = document.getElementById('restart-game');
    const gameScore = document.getElementById('game-score');
    
    // Current game state
    let currentGame = null;
    
    // Game objects
    const games = {
        'tic-tac-toe': {
            title: 'Tic-tac-toe',
            init: initTicTacToe,
            restart: restartTicTacToe,
            destroy: destroyTicTacToe
        },
        'tetris': {
            title: 'Tetris',
            init: placeholderInit,
            restart: placeholderRestart,
            destroy: placeholderDestroy
        },
        'snake': {
            title: 'Snake',
            init: placeholderInit,
            restart: placeholderRestart,
            destroy: placeholderDestroy
        },
        'flappy-bird': {
            title: 'Flappy Bird',
            init: placeholderInit,
            restart: placeholderRestart,
            destroy: placeholderDestroy
        },
        'tower-building': {
            title: 'Tower Building',
            init: placeholderInit,
            restart: placeholderRestart,
            destroy: placeholderDestroy
        },
        'puzzle': {
            title: '8-Puzzle',
            init: placeholderInit,
            restart: placeholderRestart,
            destroy: placeholderDestroy
        }
    };
    
    // Add click event to game cards
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            const game = games[gameType];
            
            if (game) {
                // Set current game
                currentGame = gameType;
                
                // Show game area
                gameArea.classList.remove('hidden');
                
                // Set game title
                currentGameTitle.textContent = game.title;
                
                // Reset score
                gameScore.textContent = 'Score: 0';
                
                // Clear game container
                gameContainer.innerHTML = '';
                
                // Initialize game
                game.init(gameContainer, updateScore);
                
                // Update leaderboard if function exists
                if (typeof updateLeaderboardDisplay === 'function') {
                    updateLeaderboardDisplay(gameType);
                }
            }
        });
    });
    
    // Close game
    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', function() {
            if (currentGame && games[currentGame]) {
                // Destroy current game
                games[currentGame].destroy();
                
                // Hide game area
                gameArea.classList.add('hidden');
                
                // Reset current game
                currentGame = null;
            }
        });
    }
    
    // Restart game
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', function() {
            if (currentGame && games[currentGame]) {
                // Restart current game
                games[currentGame].restart();
                
                // Reset score
                gameScore.textContent = 'Score: 0';
            }
        });
    }
    
    // Update score function
    function updateScore(score) {
        if (gameScore) {
            gameScore.textContent = `Score: ${score}`;
            
            // Track game play in Firebase if function exists
            if (typeof trackGamePlay === 'function' && currentGame) {
                trackGamePlay(currentGame, score);
            }
        }
    }
    
    // Placeholder functions for other games
    function placeholderInit(container, updateScore) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>${currentGameTitle.textContent}</h3>
                <p>This game is currently under development and will be available soon.</p>
                <p>Try the Tic-tac-toe game to see a fully implemented example.</p>
                <button id="placeholder-score-btn" class="restart-game">Generate Random Score</button>
            </div>
        `;
        
        const scoreBtn = document.getElementById('placeholder-score-btn');
        if (scoreBtn) {
            scoreBtn.addEventListener('click', function() {
                const randomScore = Math.floor(Math.random() * 500) + 50;
                updateScore(randomScore);
            });
        }
    }
    
    function placeholderRestart() {
        if (currentGame) {
            const container = document.getElementById('game-container');
            placeholderInit(container, updateScore);
        }
    }
    
    function placeholderDestroy() {
        // Nothing to clean up for placeholders
    }
}

/**
 * Utility function to get a random integer between min and max
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}