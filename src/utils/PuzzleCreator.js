
const createPuzzle = (title, words, rows = 20, cols = 15, puzzleSize = null, diagonal = true, sortAlphabetical = true) => {
    if (words.length < 1) {
        return {
            message: "Please add words."
        }
    }

    let open = ' ';
    let letterPool = [];
    let mixWords = true;
    let maxWordLength = 12;
    let message = null;

    if (puzzleSize !== null) {
        switch (puzzleSize) {
            case 'small': 
                rows = 12;
                cols = 12;
                break;
            case 'medium':
                rows = 20;
                cols = 15;
                break;
            case 'large':
                rows = 23;
                cols = 18;
                break;
        }
    }

    let rowCount = rows;
    let colCount = cols;
    let exhaustedTrigger = false;
    let wordSearch = createMatrix(rowCount, colCount, open);
    let wordsInfo = [];
    let totalLetters = rowCount * colCount;
    let solutions = {
        firstLetters: [],
        middleLetters: []
    };

    if (sortAlphabetical) {
        words.sort();
    }

    let maxedWords = "";

    words.forEach((word, w) => {
        let upWord = word.toUpperCase();

        if (upWord.trim().length > maxWordLength) {
            maxedWords += `"${upWord}" `;
        }

        words[w] = upWord;

        wordsInfo.push({
            key: w,
            display: upWord.trim(),
            word: upWord.replaceAll(' ', ''),
            placement: [],
            placed: false
        });
    });

    if (maxedWords !== '') {
        return {message: `Some words are above max length ${maxWordLength}: ${maxedWords}`};
    }

    letterPool = words.join('').replaceAll(' ','');

    if (totalLetters < letterPool.length) {
        return {
            message: "Too many letters. Maximum letter count for this size is: " + totalLetters
        }
    }

    let availableStarts = [];

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            availableStarts.push(createPos(r,c));
        }
    }

    const overBounds = (row, col) => { 
        if (row < 0 || row >= rowCount ) {
            return true;
        }
        if (col < 0 || col >= colCount) {
            return true;
        }
        return false;
    };

    //each word
    wordsInfo.forEach((wordInf, wordIdx) => {
        let word = wordInf.word;
        let exhausted = 0;
        let iterations = 1;
        let wordHistory = [];
        let wordAvailStarts = [...availableStarts];
        let wordPlaced = false;

        while (wordAvailStarts.length > 0) {

            let startPoint = Math.floor(Math.random() * wordAvailStarts.length);
            startPoint = parsePos(wordAvailStarts[startPoint]);
            let row = startPoint[0];
            let col = startPoint[1];

            let letterHistory = [];
            wordPlaced = false;

            if (wordAvailStarts.indexOf(createPos(row,col)) !== -1) {
                wordAvailStarts.splice(wordAvailStarts.indexOf(createPos(row,col)), 1);
            }

            //each letter of word
            for (let  j= 0; j < word.length; j++) {
                let tempRow = row;
                let tempCol = col;
                let caseAttempt = [0,1,2,3];
                if (diagonal) {
                    caseAttempt = caseAttempt.concat([4,5,6,7]);
                }
                let letterPlaced = false;          

                while (caseAttempt.length > 0) {
                    //first letter. dont search
                    if (j == 0) {
                        if (wordSearch[tempRow][tempCol] == open
                            || (mixWords 
                                && wordSearch[tempRow][tempCol] == word[j])) {
                            letterPlaced = true;
                            break;
                        } else {
                            //try another start point
                            break;
                        }
                    }

                    //one of the 8 possible next steps
                    let caseIdx = Math.floor(Math.random() * caseAttempt.length);
                    let nextPos = caseAttempt[caseIdx];

                    tempRow = row;
                    tempCol = col;

                    switch (nextPos) {
                        case 0:
                            tempRow--;
                            break;
                        case 1:
                            tempCol++;
                            break;
                        case 2:
                            tempRow++;
                            break;
                        case 3:
                            tempCol--;
                            break;
                        case 4:
                            if (inHistory(letterHistory, row-1,col) && inHistory(letterHistory, row, col-1)) {
                                break;
                            }
                            tempRow--;
                            tempCol--;
                            break;
                        case 5:
                            if (inHistory(letterHistory, row-1,col) && inHistory(letterHistory, row, col+1)) {
                                break;
                            }
                            tempRow--;
                            tempCol++;
                            break;
                        case 6:
                            if (inHistory(letterHistory, row,col-1) && inHistory(letterHistory, row+1, col)) {
                                break;
                            }
                            tempRow++;
                            tempCol--;
                            break;
                        case 7:
                            if (inHistory(letterHistory, row+1,col) && inHistory(letterHistory, row, col+1)) {
                                break;
                            }
                            tempRow++;
                            tempCol++;
                            break;
                    }

                    caseAttempt.splice(caseIdx, 1);

                    // if new row and col are overbounds, continue iteration.
                    if (overBounds(tempRow, tempCol)) {
                        continue;
                    }

                    if (
                        //if currPos is open & currPos not in letterHistory yet
                        (
                            letterHistory.indexOf(createPos(tempRow,tempCol)) === -1
                            && (wordSearch[tempRow][tempCol] === open 
                                || (mixWords && wordSearch[tempRow][tempCol] === word[j]))
                        )
                    ) {
                        letterPlaced = true;
                        break;
                    }
            
                } //end while (caseAttempt.length > 0)

                if (letterPlaced) {
                    row = tempRow;
                    col = tempCol;
        
                    letterHistory.push(createPos(row,col));
                } else {
                    break;
                }

            } //end  for (let j = 0; j < word.length; j++)

            //place word
            if (letterHistory.length == word.length) {
                letterHistory.forEach((letterPos, idx) => {
                    let pos = parsePos(letterPos);
                    wordSearch[pos[0]][pos[1]] = word[idx];

                    if (idx == 0) {
                        solutions.firstLetters.push(letterPos);

                        //do not mix first letters
                        if (mixWords && availableStarts.indexOf(letterPos) !== -1) {
                            availableStarts.splice(availableStarts.indexOf(letterPos), 1);
                        }
                    } else {
                        solutions.middleLetters.push(letterPos);
                    }

                    //do only when no mixWords
                    if (!mixWords && availableStarts.indexOf(letterPos) !== -1) {
                        availableStarts.splice(availableStarts.indexOf(letterPos), 1);
                    }
                });

                wordsInfo[wordIdx].placed = true;
                wordsInfo[wordIdx].placement = [...letterHistory];

                wordPlaced = true;
                break;
            } 

            exhausted++;
            iterations++;
            if(exhausted > 5000) {
                exhaustedTrigger = true;
                break;
            };
        } // end while wordAvailStarts.length > 0

        if (wordPlaced) {
            console.log(`~~~ Word ${word} (${word.length}) placed. iterations: ${iterations}`);
        } else {
            console.log(`~~~ Word ${word} (${word.length}) is unplaced. iterations: ${iterations}`);
        }
    }) //end words.forEach;

    //fill open
    if (true) {
        wordSearch.forEach((row, i) => {
            row.forEach((col, j) => {
                if (wordSearch[i][j] === open) {
                    let randLetter = Math.floor(Math.random() * letterPool.length);
                    wordSearch[i][j] = letterPool[randLetter];
                }
            })
        });
    }

    return {
        exhaustedTrigger,
        message,
        puzzle: {
            title: title,
            rows: rows,
            cols: cols,
            words: words,
            wordsInfo: wordsInfo,
            totalSize: totalLetters,
            totalLetters: letterPool.length,
            puzzle: wordSearch, 
            solutions: solutions
        }
        
    }
};

const createPos = (row, col) => { 
    return row + ',' + col;
};

/**
 * return array of 2 strings based on format. sample "12,3" first is row and second is col
 */
const parsePos = (pos) => {
    var intArr = pos.split(',').map(Number); 
    return intArr;
};

const inHistory = (history, row, col) => { 
    let current = createPos(row, col);
    if (true) {
        return history.indexOf(current) !== -1
    }
};

const createMatrix = (rows, cols, fill) => { 
    let newMatrix = [];
    //create matrix
    for (let i = 0; i < rows; i++) {
        let newRow = [];
        for (let j = 0; j < cols; j++) {
            newRow.push(fill);
        }
        newMatrix.push(newRow);
    }

    return newMatrix;
};



export default {
  createPuzzle,
  createPos,
  parsePos
};