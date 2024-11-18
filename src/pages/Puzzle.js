import {useLocation} from 'react-router-dom';

const Puzzle = (props) => {
  // const { state } = props.location;
  const { state } = useLocation();
  const puzzle = state.puzzle ;

  return <>
    <div className='PuzzleTitle'>{puzzle.title}</div>
    <div className='PuzzleLayout'>
      <div className="Puzzle">
        {puzzle.puzzle.map((row, r) => {
          return <div className="PuzzleRow">
            {row.map((col, c) => {
              return <><div className="PuzzleLetter">{col}</div></>
            })}
          </div>
        })}
      </div>
      <div className="PuzzleWordsBox">
        {puzzle.wordsInfo.map((wordInf, w) => {
          return <>
            <div className="PuzzleWord">{wordInf.placed && wordInf.display}</div>
          </>
        })}
      </div>
    </div>


    <div></div>

  </>;
};

export default Puzzle;