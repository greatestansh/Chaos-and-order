// function to store all the valid lines in our 6*6 board
const getValidLines=()=>{

    // all these index calculations assume our board is a 1D array of size 36
    const lines = [];

    for (let row = 0; row < 6; row++) {
        lines.push([0, 1, 2, 3, 4, 5].map(column => row * 6 + column));
    } // Stores lines along Rows

    for (let column = 0; column < 6; column++) {
        lines.push([0, 1, 2, 3, 4, 5].map(row => row * 6 + column));
    } // Stores lines along Columns
    
    // Main Diagonals
    lines.push([0, 7, 14, 21, 28, 35], [1, 8, 15, 22, 29], [2, 9, 16, 23], [6, 13, 20, 27, 34], [12, 19, 26, 33]);
    // Anti-Diagonals
    lines.push([5, 10, 15, 20, 25, 30], [4, 9, 14, 19, 24], [3, 8, 13, 18], [11, 16, 21, 26, 31], [17, 22, 27, 32]);
    return lines;
};

let winningLines=getValidLines();

export const scanBoardPatterns = (board) => {
    const patterns = { X: { straight4: 0, straight5: 0 }, O: { straight4: 0, straight5: 0 } };

    winningLines.forEach(lineIndices => {
        let currentPiece = null;
        let streak = 0;
        const lineValues = lineIndices.map(index => board[index]);

        const tallyStreak = (piece, length) => {
            if (!piece) return;
            if (length === 4) patterns[piece].straight4 += 1;
            if (length >= 5) patterns[piece].straight5 += 1; 
        };

        for (let i = 0; i < lineValues.length; i++) {
            const piece = lineValues[i];
            if (piece !== null && piece === currentPiece) {
                streak++;
            } else {
                tallyStreak(currentPiece, streak);
                currentPiece = piece;
                streak = piece !== null ? 1 : 0;
            }
        }
        tallyStreak(currentPiece, streak);
    });

    return patterns;
};
