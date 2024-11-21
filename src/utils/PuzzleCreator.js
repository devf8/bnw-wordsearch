
const createPuzzle = (title, words, rows = 18, cols = 18, puzzleSize = null, diagonal = true, sortAlphabetical = true, mixWords = false) => {
    if (words.length < 1) {
        return {
            message: "Please add words."
        }
    }

    let open = ' ';
    let letterPool = [];
    let minWordLength = 2;
    let maxWordLength = 16;
    let message = null;
    let colors = 11;
    let debug = true;

    if (puzzleSize !== null) {
        switch (puzzleSize) {
            case 'small': 
                rows = 12;
                cols = 12;
                break;
            case 'medium':
                rows = 18;
                cols = 18;
                break;
            case 'large':
                rows = 23;
                cols = 20;
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

    let maxedWords = "";
    let colorCount = 0;

    letterPool = cleanWord(words.join(''));

    if (totalLetters < letterPool.length) {
        return {
            message: "Too many letters. Maximum letter count for this puzzle size is: " + totalLetters
        }
    }
    
    words = words.filter(elem => cleanWord(elem) !== '');
  
    //clean and keep base arrangement
    words.forEach((word, w) => {
        let upWord = word.toUpperCase().trim();
        words[w] = upWord;
 
        let cleaned = cleanWord(word);

        if (cleaned.length < minWordLength || cleaned.length > maxWordLength) {
            maxedWords += `[${upWord}] `;
        }

        if (maxedWords !== '') {
            return;
        }

        if (colorCount === colors) {
            colorCount = 0;
        }

        wordsInfo.push({
            display: upWord,
            baseOrder: w,
            word: cleaned,
            placement: [],
            placed: false,
            color: colorCount
        });

        colorCount++;
    });

    if (maxedWords !== '') {
        return {message: `Some words are not within required length ${minWordLength}-${maxWordLength}: ${maxedWords}`};
    }

    //sort by length for generating puzzle
    wordsInfo.sort((a, b) => b.display.length - a.display.length);

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
        let wordAvailStarts = [...availableStarts];
        let wordPlaced = false;

        while (wordAvailStarts.length > 0) {
            let startPoint = genRand(wordAvailStarts.length);
            startPoint = parsePos(wordAvailStarts[startPoint]);

            let row = startPoint[0];
            let col = startPoint[1];

            let letterHistory = [];
            wordPlaced = false;

            if (wordAvailStarts.indexOf(createPos(row,col)) !== -1) {
                wordAvailStarts.splice(wordAvailStarts.indexOf(createPos(row,col)), 1);
            }

            let prevPos = null;

            //each letter of word
            for (let  j= 0; j < word.length; j++) {
                let tempRow = row;
                let tempCol = col;
                let caseAttempt = [1,3,5,7];
                let multiplier = 2;
                
                if (diagonal) {
                    caseAttempt = caseAttempt.concat([0,2,4,6]);
                    multiplier = 1;
                }

                let maxCases = caseAttempt.length;
                let letterPlaced = false;

                while (caseAttempt.length > 0) {
                    //first letter. dont search
                    if (j === 0) {
                        if (wordSearch[tempRow][tempCol] === open
                            || (mixWords 
                                && wordSearch[tempRow][tempCol] === word[j])) {
                            letterPlaced = true;
                            break;
                        } else {
                            //try another start point
                            break;
                        }
                    }

                    let nextStep = genRand(100);
        
                    //make pathing less crunchy
                    if (nextStep < 20) {
                        prevPos = addToCase(maxCases, prevPos, -1*multiplier);
                    } else if (nextStep < 40) {
                        prevPos = addToCase(maxCases, prevPos, +1*multiplier);
                    } else if (nextStep < 70) {
                        prevPos = caseAttempt[genRand(caseAttempt.length)];
                    } 

                    //make nextCase from prevPos
                    let nextCase = caseAttempt.indexOf(prevPos) !== -1 ? caseAttempt.indexOf(prevPos) : genRand(caseAttempt.length);

                    nextCase = genRand(caseAttempt.length);
        
                    let nextPos = caseAttempt[nextCase];
                    caseAttempt.splice(nextCase, 1);

                    tempRow = row;
                    tempCol = col;

                    switch (nextPos) {
                        case 0: // up-left
                            if (inHistory(letterHistory, row-1,col) && inHistory(letterHistory, row, col-1)) {
                                break;
                            }
                            tempRow--;
                            tempCol--;
                            break;
                        case 1: // up
                            tempRow--;
                            break;
                        case 2: // up right
                            if (inHistory(letterHistory, row-1,col) && inHistory(letterHistory, row, col+1)) {
                                break;
                            }
                            tempRow--;
                            tempCol++;
                            break;
                        case 3: // right
                            tempCol++;
                            break;
                           
                        case 4: // down-right
                            if (inHistory(letterHistory, row,col+1) && inHistory(letterHistory, row+1, col)) {
                                break;
                            }
                            tempRow++;
                            tempCol++;
                            break;
                        case 5: // down
                            tempRow++;
                            break;
                        case 6: // down-left
                            if (inHistory(letterHistory, row+1,col) && inHistory(letterHistory, row, col-1)) {
                                break;
                            }
                            tempRow++;
                            tempCol--;
                            break;
                        case 7: // left
                            tempCol--;
                            break;
                    }

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
                        prevPos = nextPos;

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
            if (letterHistory.length === word.length) {
                letterHistory.forEach((letterPos, idx) => {
                    let pos = parsePos(letterPos);
                    wordSearch[pos[0]][pos[1]] = word[idx];

                    if (idx === 0) {
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
            debug && console.log(`~~~ Word ${word} (${word.length}) placed. iterations: ${iterations}`);
        } else {
            debug && console.log(`!!! Word ${word} (${word.length}) is UNPLACED. iterations: ${iterations}`);
        }
    }) //end words.forEach;

    //fill open
    if (true) {
        wordSearch.forEach((row, i) => {
            row.forEach((col, j) => {
                if (wordSearch[i][j] === open) {
                    let randLetter = genRand(letterPool.length);
                    wordSearch[i][j] = letterPool[randLetter];
                }
            })
        });
    }

    if (sortAlphabetical) {
        wordsInfo.sort((a, b) => a.display.localeCompare(b.display));
    } else {
        wordsInfo.sort((a, b) => a.baseOrder - b.baseOrder);
    }

    return {
        exhaustedTrigger,
        message,
        puzzle: {
            title: title,
            size: puzzleSize,
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

// number from 0 to (maxrange - 1)
const genRand = (maxRange) => {
    return Math.floor(Math.random() * maxRange);
}

const addToCase = (maxCase, currCase, toAdd) => {
    currCase += toAdd;

    if (currCase < 0) {
        currCase = maxCase - currCase
    }

    if (currCase > maxCase) {
        currCase = currCase - maxCase
    }

    return currCase;
}

const cleanWord = (word, removeSpaces = true) => {
    let clean = word.replaceAll(/[ '",!?-]/g, '').trim().toUpperCase();

    if (removeSpaces) {
        return clean.replaceAll(' ', '');
    }

    return clean;
}

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

const getWordInfoByPos = (wordsInfo, toFind) => {
    let getWordInfo = false;

    wordsInfo.forEach((wordInf) => {
        if (wordInf.placement.indexOf(toFind) !== -1 ) {
            getWordInfo = wordInf;
            return;
        }
    })

    return getWordInfo;
}

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
    cleanWord,
    createPuzzle,
    createPos,
    parsePos,
    getWordInfoByPos
};