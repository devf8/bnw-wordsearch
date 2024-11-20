import {useLocation} from 'react-router-dom';
import PuzzleCreator from '../utils/PuzzleCreator';
import { useState, useEffect } from 'react';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';

const Puzzle = (props) => {
  // const { state } = props.location;
  const { state } = useLocation();
  const puzzle = state.puzzle ;
  const [showSolutions, setShowSolutions] = useState(false);
  const [printing, setPrinting] = useState(false);
  const cheatText = "Cheating!";

  // console.log(puzzle);
  const cheatHeader = cheatText && cheatText.split('').map((word, w) => <div style={{display:"inline-block"}} className={w % 2 == 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>);

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

  return <>
    <div>
      <button className="PuzzleSave" type="button" onClick={saveAsImage}>
        Download Image
      </button>
      <button className="PuzzleSolution" type="button" onClick={(e) => setShowSolutions(!showSolutions)}>
        {showSolutions ? 'Hide' : 'Show'} Solution
      </button>
      <div style={{clear:"both"}}></div>
      <div id="puzzleImage" className={'PuzzleBody'}>
        <div className='PuzzleScale'>
          <div id="puzzleTitle" className='PuzzleTitle'>
            {!printing && showSolutions  && cheatHeader ? cheatHeader : puzzle.title}
          </div>
          <div className='PuzzleLayout'>
            <div className="Puzzle">
              {puzzle.puzzle.map((row, r) => {
                return <div className="PuzzleRow">
                  {row.map((col, c) => {
                    let colorClass = '';

                    if (showSolutions) {
                      let foundWordInfo = PuzzleCreator.getWordInfoByPos(puzzle.wordsInfo, PuzzleCreator.createPos(r,c));
                      if (foundWordInfo) {
                        colorClass = `PuzzleLetter--Color${foundWordInfo.color+1}`;
                      } 

                      colorClass += ` ${getLetterClass(r,c)}`
                    }

                    return <>
                      <div key={c} className={`PuzzleLetterBox ${colorClass} ${puzzle.size == 'large' && 'PuzzleLetterBox--Large'}`}>
                        <div className={`PuzzleLetter`}>
                            {col}
                        </div>
                      </div>
                    </>
                  })}
                </div>
              })}
            </div>
            <div className={'PuzzleWordsBox'}>
                  <div style={{fontWeight:"bold"}} className="PuzzleWord">
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
    </div>
  </>;
};

export default Puzzle;