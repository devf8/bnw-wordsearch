import PuzzleCreator from '../utils/PuzzleCreator';
import { useState, useEffect } from 'react';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';
import {  useNavigate, useParams} from 'react-router-dom';

const Puzzle = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  let sessPuzzles = JSON.parse(sessionStorage.getItem(`puzzles`));
  let maxIdx = sessPuzzles ? sessPuzzles.length-1 : 0;


  let currIdx = sessPuzzles?.indexOf(params.id) !== -1 ? sessPuzzles?.indexOf(params.id) : maxIdx;
  let puzzle = sessPuzzles ? JSON.parse(sessionStorage.getItem(sessPuzzles[currIdx])) : null;


  const [showSolutions, setShowSolutions] = useState(false);
  const [printing, setPrinting] = useState(false);
  
  const cheatText = "Cheating!";
  const cheatHeader = cheatText && cheatText.split('').map((word, w) => <div key={`head${w}`} style={{display:"inline-block"}} className={w % 2 === 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>);

  const goBack = () => {
    navigate('/');
  }

  useEffect(() => {
    if (!puzzle) {
      navigate('/');
      return;
    }

    let unplaced = "";
    puzzle.wordsInfo.forEach((wordInf, w) => {
      if (!wordInf.placed) {
        unplaced += `[${wordInf.display}] `
      }
    });

    if (unplaced) {
      alert(`Some words could not be included in the puzzle. Try regenerating the puzzle or lowering the word/letter counts. Unplaced words: ${unplaced}`);
    }
  }, []);

  const navPuzzle = (nav) => {
    let puzIdx = currIdx;

    puzIdx += nav;

    if (puzIdx < 0) {
      puzIdx = 0;
    } else if (puzIdx > maxIdx) {
      puzIdx = maxIdx;
    }

    navigate(`/puzzle/${sessPuzzles[puzIdx]}`);
  }

  const getLetterClass = (row, col) => {
    if (puzzle.solutions.firstLetters.indexOf(PuzzleCreator.createPos(row,col)) !== -1) {
      return 'PuzzleLetter--First';
    }
    if (puzzle.solutions.middleLetters.indexOf(PuzzleCreator.createPos(row,col)) !== -1) {
      return 'PuzzleLetter--Middle';
    }
    return 'PuzzleLetter--Out';
  }

  const saveAsImage =  () => {
    setPrinting(true);
    var toPrint = document.getElementById('puzzleImage');
    toPrint.classList.replace("PuzzleBody", "PuzzleImage");

    var scale = 2;

    domtoimage.toBlob(toPrint, {
      width: toPrint.clientWidth * scale,
      height: toPrint.clientHeight * scale,
      style: {
        transform: 'scale('+scale+')',
        transformOrigin: 'top left',
      }
      }).then(function (blob) {
        FileSaver.saveAs(blob, `bnwf8-${puzzle.title ? puzzle.title.replace(/[^a-zA-Z0-9]/g, '-') : Date.now()}.png`);
        toPrint.classList.replace("PuzzleImage", "PuzzleBody");
        setPrinting(false);
    });
  }

  return puzzle && <>
    <div>
      <div>
        <button className="PuzzleButton" type="button" onClick={goBack}>
          {`<< Back`}
        </button>
        <button className="PuzzleSave" type="button" onClick={saveAsImage}>
          Download Image
        </button>
        <button className="PuzzleButton" type="button" onClick={(e) => setShowSolutions(!showSolutions)}>
          {showSolutions ? 'Hide' : 'Show'} Solution
        </button>
        <div style={{display:"inline-block"}}>
          <button className={`PuzzleButton ${currIdx === 0 && 'PuzzleButton--Gray'}`} type="button" onClick={(e) => navPuzzle(-1)}>
            {`<`}
          </button>
          <div style={{display:"inline-block"}}>{`${currIdx+1}/${sessPuzzles.length}`}</div>
          <button className={`PuzzleButton ${currIdx === maxIdx && 'PuzzleButton--Gray'}`} type="button" onClick={(e) => navPuzzle(1)}>
            {`>`}
          </button>
        </div>
      </div>
      <div style={{clear:"both"}}></div>
      <div id="puzzleImage" className={'PuzzleBody'}>
        <div className='PuzzleScale'>
          <div id="puzzleTitle" className='PuzzleTitle'>
            {!printing && showSolutions  && cheatHeader ? cheatHeader : puzzle.title}
          </div>
          <div className='PuzzleLayout'>
            <div className="Puzzle">
              {puzzle.puzzle.map((row, r) => {
                return <div key={`row${r}`} className="PuzzleRow">
                  {row.map((col, c) => {
                    let colorClass = '';

                    if (showSolutions) {
                      let foundWordInfo = PuzzleCreator.getWordInfoByPos(puzzle.wordsInfo, PuzzleCreator.createPos(r,c));
                      if (foundWordInfo) {
                        colorClass = `PuzzleLetter--Color${foundWordInfo.color+1}`;
                      } 

                      colorClass += ` ${getLetterClass(r,c)}`
                    }

                    return <div key={`col${c}`} 
                      className={`PuzzleLetterBox ${colorClass} ${puzzle.size === 'large' && 'PuzzleLetterBox--Large'}`}>
                      <div key={`let${c}`} className={`PuzzleLetter`}>
                          {col}
                      </div>
                    </div>
                  })}
                </div>
              })}
            </div>
            <div className={'PuzzleWordsBox'}>
                  <div style={{fontWeight:"bold"}} className="PuzzleWord">
                    {puzzle.wordsInfo.filter((wordInf) => wordInf.placed).length} WORDS
                  </div>
              {puzzle.wordsInfo.map((wordInf, w) => {
                return <div key={`wordinf${w}`} className={"PuzzleWord " + (showSolutions ? ' PuzzleWord--Solution' : '')}>
                  {wordInf.placed && wordInf.display}
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default Puzzle;