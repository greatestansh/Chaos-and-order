import { scanBoardPatterns } from './gameLogic';

// The Heuristic: Scores the board at the depth limit
const evaluateBoard = (board, isOrder) => {
    const patterns = scanBoardPatterns(board);
    
    // Calculate raw score based on patterns
    let orderScore = (patterns.X.straight5 * 10000) + (patterns.O.straight5 * 10000) +
                     (patterns.X.straight4 * 500) + (patterns.O.straight4 * 500);
                     
    // Order wants high scores, Chaos wants low scores (zero streaks)
    return isOrder ? orderScore : -orderScore;
};

// Alpha-Beta Pruning Minimax
export const getBestMove = (board, depth, isOrderRole) => {
    let bestScore = -Infinity;
    let bestMove = { index: -1, piece: 'X' };
    
    // Find empty spots
    const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

    // Hardcap search if too many moves (to prevent freezing)
    const limit = availableMoves.length > 20 ? 2 : depth;

    for (let index of availableMoves) {
        for (let piece of ['X', 'O']) {
            board[index] = piece; 
            let score = minimax(board, limit - 1, -Infinity, Infinity, false, isOrderRole);
            board[index] = null; 

            if (score > bestScore) {
                bestScore = score;
                bestMove = { index, piece };
            }
        }
    }
    return bestMove;
};

const minimax = (board, depth, alpha, beta, isMaximizing, isOrderRole) => {
    const patterns = scanBoardPatterns(board);
    if (depth === 0 || patterns.X.straight5 > 0 || patterns.O.straight5 > 0) {
        return evaluateBoard(board, isOrderRole);
    }

    const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (availableMoves.length === 0) return evaluateBoard(board, isOrderRole);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let index of availableMoves) {
            for (let piece of ['X', 'O']) {
                board[index] = piece;
                let evalScore = minimax(board, depth - 1, alpha, beta, false, isOrderRole);
                board[index] = null;
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let index of availableMoves) {
            for (let piece of ['X', 'O']) {
                board[index] = piece;
                let evalScore = minimax(board, depth - 1, alpha, beta, true, isOrderRole);
                board[index] = null;
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
};