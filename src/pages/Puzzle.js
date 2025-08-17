import PuzzleCreator from '../utils/PuzzleCreator';
import { useState, useEffect, useRef } from 'react';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';
import { useNavigate, useParams} from 'react-router-dom';

const Puzzle = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  let sessPuzzles = JSON.parse(sessionStorage.getItem(`puzzles`));
  let maxIdx = sessPuzzles ? sessPuzzles.length-1 : 0;

  let currIdx = sessPuzzles?.indexOf(params.id) !== -1 ? sessPuzzles?.indexOf(params.id) : maxIdx;
  let puzzle = sessPuzzles ? JSON.parse(sessionStorage.getItem(sessPuzzles[currIdx])) : null;

  const [showSolutions, setShowSolutions] = useState(false);
  const [printing, setPrinting] = useState(false);

  // hmmm. height of headers. needs to work with file-saver.
  const PRINTING_Y_OFFSET = 85;
  const [printingOffset, setPrintingOffset] = useState(0);
  
  const cheatText = "Cheating!";
  const cheatHeader = cheatText && cheatText.split('').map((word, w) => <div key={`head${w}`} style={{display:"inline-block"}} className={w % 2 === 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>);

  //div references for solution line points
  const letterPosRefs = useRef(new Map());

  // for browser resizing - force rerender solutions
  const [dimensions, setDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
  });

  const handleResize = () => {
      setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
      });
  };

  useEffect(() => {
      window.addEventListener('resize', handleResize);

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);
  // ==========

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
    } else {
      setShowSolutions(false);
    }

    navigate(`/puzzle/${sessPuzzles[puzIdx]}`);
  }

  const saveAsImage = () => {
    setPrinting(true);
    setPrintingOffset(PRINTING_Y_OFFSET);

    var toPrint = document.getElementById('puzzleImage');
    toPrint.classList.replace("PuzzleBody", "PuzzleImage");

    var scale = 2.5;
    domtoimage.toBlob(toPrint, {
      width: toPrint.clientWidth * scale,
      height: toPrint.clientHeight * scale,
      style: {
        transform: 'scale('+scale+')',
        transformOrigin: 'top left',
      }
      }).then(function (blob) {
        FileSaver.saveAs(blob, `bnwf8-${puzzle.title ? puzzle.title.replace(/[^a-zA-Z0-9]/g, '-') : Date.now()}` + `${showSolutions ? '-solution' : ''}` + `.png`);
        toPrint.classList.replace("PuzzleImage", "PuzzleBody");
        setPrinting(false);
        setPrintingOffset(0);
    });
  }

  return puzzle && <>
    <div>
      <div className="PuzzleControls">
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
              { puzzle.puzzle.map((row, r) => {
                  return <div key={`row${r}`} className="PuzzleRow">
                    {row.map((col, c) => {
                      return <div key={`col${c}`} 
                        className={`PuzzleLetterBox ${puzzle.size === 'large' && 'PuzzleLetterBox--Large'}`}>
                        <div key={`${col.id}`} 
                          ref={el => el ? letterPosRefs.current.set(col.id, el) : letterPosRefs.current.delete(col.id)}
                          className={`PuzzleLetter`}>
                            {col.letter}
                        </div>
                      </div>
                    })}
                  </div>
                })
              }
            </div>

            <div className={'PuzzleWordsBox'}>
              <div style={{fontWeight:'bold'}} className="PuzzleWord">
                {puzzle.wordsInfo.filter((wordInf) => wordInf.placed).length} WORDS
              </div>
              {puzzle.wordsInfo.map((wordInf, w) => {
                return <div key={`wordinf${w}`} className={"PuzzleWord " + (showSolutions ? ' PuzzleWord--Solution' : '')}>
                  {wordInf.placed && wordInf.display}
                </div>
              })}
            </div>

            { showSolutions && <>
              <div className='SolutionsLayout'>
                {puzzle.wordsInfo.map((wordInf, wIdx) => {
                  let sol = '';
                  let firstPtX = '';
                  let firstPtY = '';

                  wordInf.placement.forEach((placement, spIdx) => {

                      const point = letterPosRefs.current.get(placement).getBoundingClientRect();

                        let ptX = (point.left + point.width / 2);
                        let ptY = (point.top + point.height / 2) - printingOffset;

                      sol += `${ptX},${ptY} `;

                      if (spIdx === 0) {
                        firstPtX = ptX;
                        firstPtY = ptY;
                      }
                  });

                  return <>
                    <svg
                      key={`sol_${wIdx}`}
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        pointerEvents: 'none',
                      }}
                    >
                      <polyline 
                        points={sol} 
                        className={`SolutionLine SolutionLine--Color${wordInf.color} ${puzzle.size === 'large' ? 'SolutionLine--Large' : ''} ${!printing && 'SolutionLine--Mobile'}`}
                      />
                      <circle cx={firstPtX} cy={firstPtY} className={`SolutionFirst ${!printing && 'SolutionFirst--Mobile'}`} />
                    </svg>
                  </>
                })}
              </div>
            </>
          }
          </div>

        </div>
        
      </div>

    </div>
          {<>
        <div className={`PrintingOverlay ${printing ? 'PrintingOverlay--Show' : ''}`} >
          <div className='PrintingMessage'>
            Generating Image...
          </div>
        </div>
      </>}
  </>;
};

export default Puzzle;