
const createPuzzle = (words) => {

    // words  = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'MAGENTA', 'PURPLE', 'GRAY', 'VIOLET', 'WHITE', 'BLACK', 'PINK', 'CYAN', 'BROWN', 'SCARLET', 'SILVER', 'GOLD', 'AQUAMARINE', 'APRICOT', 'CHEESE'];

    let letterPool = [];
    let mixWords = true;
    let rowCount = 20;
    let colCount = 15;
    let wordSearch = [];

    //create matrix
    for (let i = 0; i < rowCount; i++) {
        let newRow = [];
        for (let j = 0; j < colCount; j++) {
        newRow.push(' ');
        }
        wordSearch.push(newRow);
    }

    letterPool = words.join('');

    //each word
    words.forEach((word, i) => {
        //each letter of word
        let row = Math.floor(Math.random() * rowCount);
        let col = Math.floor(Math.random() * colCount);
        let history = [];
        for (let j = 0; j < word.length; j++) {
            let tempRow = row;
            let tempCol = col;

            let exhausted = 0;
            do {
                //up, down, or stay
                let nextRow = Math.floor(Math.random() * 3);
                //left, right, or stay
                let nextCol = Math.floor(Math.random() * 3);

                //one of the 8 possible next steps
                let nextPos = Math.floor(Math.random() * 8);

                tempRow = row;
                tempCol = col;

                switch (nextPos) {
                    case 0:
                        if (inHistory(history, row-1,col) && inHistory(history, row, col-1)) {
                            break;
                        }
                        tempRow--;
                        tempCol--;
                        break;
                    case 1:
                        tempRow--;
                        break;
                    case 2:
                        if (inHistory(history, row-1,col) && inHistory(history, row, col+1)) {
                            break;
                        }
                        tempRow--;
                        tempCol++;
                        break;
                    case 3:
                        tempCol--;
                        break;
                    case 4:
                        tempCol++;
                        break;
                    case 5:
                        if (inHistory(history, row,col-1) && inHistory(history, row+1, col)) {
                            break;
                        }
                        tempRow++;
                        tempCol--;
                        break;
                    case 6:
                        tempRow++;
                        break;
                    case 7:
                        if (inHistory(history, row+1,col) && inHistory(history, row, col+1)) {
                            break;
                        }
                        tempRow++;
                        tempCol++;
                        break;
                }


                if (tempRow < 0) {
                    tempRow = 0;
                } else if (tempRow >= rowCount)
                {
                    tempRow = rowCount - 1;
                }

                
                if (tempCol < 0) {
                    tempCol = 0;
                } else if (tempCol >= colCount)
                {
                    tempCol = colCount - 1;
                }

                exhausted++;
                if (exhausted > 20) {

                    break;
                }

            } while (wordSearch[tempRow][tempCol] != ' ' 
                || (mixWords
                    && wordSearch[tempRow][tempCol] == word[j] 
                    && history.indexOf(coordFormat(tempRow,tempCol) != -1)
                    && j !== 0));

            row = tempRow;
            col = tempCol;

            wordSearch[row][col] = word[j];

            history.push(coordFormat(tempRow,tempCol));
        }
    });

    if (true) {
        wordSearch.forEach((row, i) => {
            row.forEach((col, j) => {
                if (wordSearch[i][j] == ' ') {
                    let randLetter = Math.floor(Math.random() * letterPool.length);
                    wordSearch[i][j] = letterPool[randLetter];
                }
            })
        });
    }


    return wordSearch;
};

const coordFormat = (row, col) => { 
    return row + ',' + col;
};

const inHistory = (history, row, col) => { 
    let current = coordFormat(row, col);
    if (true) {
        return history.indexOf(current) != -1
    }
};



const helper2 = () => { 

};

export default {
  createPuzzle,
  helper2
};