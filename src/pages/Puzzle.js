import {useLocation} from 'react-router-dom';
import PuzzleCreator from '../utils/PuzzleCreator';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const Puzzle = (props) => {
  // const { state } = props.location;
  const { state } = useLocation();
  const puzzle = state.puzzle ;
  const [showSolutions, setShowSolutions] = useState(false);
  const [print, setPrint] = useState(false);
  const cheatHeader = "Cheating!";
  // console.log(puzzle);
  const puzzleHeader = 
    !print && showSolutions && cheatHeader
    ? cheatHeader.split('').map((word, w) => <div style={{display:"inline-block"}} className={w % 2 == 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>) 
    : puzzle.title;


  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 's' || e.key === 'S') {
        setShowSolutions(!showSolutions);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showSolutions]);

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
    setPrint(true);
    console.log('saving');
    const toPrint = document.getElementById('puzzleImage');
    toPrint.classList.replace("PuzzleBody", "PuzzleImage");
    const canvas = await html2canvas(toPrint);
    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');
    link.href = data;
    link.download = `${puzzle.title ? puzzle.title.replace(/[^a-zA-Z0-9]/g, '-') : `bnw-${Date.now()}`}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toPrint.classList.replace("PuzzleImage", "PuzzleBody");
    setPrint(false);
  }

  return <>
    <div>
      <button className="PuzzleSave" type="button" onClick={saveAsImage}>
        Save Image
      </button>
      <div style={{clear:"both"}}></div>
      <div id="puzzleImage" className='PuzzleBody'>
        <div className='PuzzleTitle'>
          {puzzleHeader}
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