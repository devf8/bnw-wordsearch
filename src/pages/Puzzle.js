import {useLocation} from 'react-router-dom';
import PuzzleCreator from '../utils/PuzzleCreator';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const Puzzle = (props) => {
  // const { state } = props.location;
  const { state } = useLocation();
  const puzzle = state.puzzle ;
  const [showSolutions, setShowSolutions] = useState(false);
  const [printing, setPrinting] = useState(false);
  const cheatText = "Cheating!";

  // console.log(puzzle);
  const cheatHeader = cheatText.split('').map((word, w) => <div style={{display:"inline-block"}} className={w % 2 == 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>);

  const getLetterClass = (row, col) => {
    if (puzzle.solutions.firstLetters.indexOf(PuzzleCreator.createPos(row,col)) !== -1) {
      return 'PuzzleLetter--First';
    }
    if (puzzle.solutions.middleLetters.indexOf(PuzzleCreator.createPos(row,col)) !== -1) {
      return 'PuzzleLetter--Middle';
    }
    return 'PuzzleLetter--Out';
  }

  const saveAsImage = async () => {
    setPrinting(true);

    const toPrint = document.getElementById('puzzleImage');
    toPrint.classList.replace("PuzzleBody", "PuzzleImage");

    const canvas = await html2canvas(toPrint);
    const data = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = data;
    link.download = `${puzzle.title ? puzzle.title.replace(/[^a-zA-Z0-9]/g, '-') : 'bnwf8-' + Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toPrint.classList.replace("PuzzleImage", "PuzzleBody");
    setPrinting(false);
  }

  return <>
    <div>
      <button className="PuzzleSave" type="button" onClick={saveAsImage}>
        Save Image
      </button>
      <button className="PuzzleSolution" type="button" onClick={(e) => setShowSolutions(!showSolutions)}>
        Show Solution
      </button>
      <div style={{clear:"both"}}></div>
      <div id="puzzleImage" className='PuzzleBody'>
        <div id="puzzleTitle" className='PuzzleTitle'>
          {!printing && showSolutions ? cheatHeader : puzzle.title}
        </div>
        <div className='PuzzleLayout'>
          <div className="Puzzle">
            {puzzle.puzzle.map((row, r) => {
              return <div className="PuzzleRow">
                {row.map((col, c) => {
                  return <>
                    <div className={'PuzzleLetter ' + (showSolutions && getLetterClass(r,c))}>
                      {col}
                    </div>
                  </>
                })}
              </div>
            })}
          </div>
          <div className="PuzzleWordsBox">
                <div style={{fontWeight:"bold"}} className="PuzzleWord">
                  {/* check how many placed */}
                  {puzzle.wordsInfo.filter((wordInf) => wordInf.placed).length} WORDS
                </div>
            {puzzle.wordsInfo.map((wordInf, w) => {
              return <>
                <div className={"PuzzleWord " + (showSolutions ? ' PuzzleWord--Solution' : '')}>
                  {wordInf.placed && wordInf.display}
                </div>
              </>
            })}
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default Puzzle;