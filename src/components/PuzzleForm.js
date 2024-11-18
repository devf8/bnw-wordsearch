import {  useState, useReducer } from 'react';
import WordInput from './WordInput';
import PuzzleCreator from '../utils/PuzzleCreator';
import {Link, useNavigate} from 'react-router-dom';

const PuzzleForm = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [words, setWords] = useState([]);
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(15);
    const [wordCount, setWordCount] = useState(0);
    const [puzzleSize, setPuzzleSize] = useState('medium');
    const [wordArea, setWordArea] = useState("");
    const [diagonalChecked, setdiagonalChecked] = useState(true);

    const header = "Welcome to bent n wiggly word search generator by F8"

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    function addNewWord() {
        setWords([...words, '']);
    }        

    const sortAlphabetical = () => {
        let newWords = [...words];

        newWords = newWords.filter(elem => elem);
        newWords = newWords.sort();

        setWordArea(newWords.join('\n'));
        setWords(newWords); 
    }

    const createPuzzle = () => {
      let puzzle = PuzzleCreator.createPuzzle(title, words, rows, cols, puzzleSize, diagonalChecked);

      if (puzzle.exhaustedTrigger) {
          console.log('~~~ something is wrong');
          alert('Something went wrong with generating your puzzle. Try reducing word/letter count or increasing puzzle size.');
      } else if (puzzle.message) {
        alert(puzzle.message);
      } else {
        navigate('/puzzle', { state: { puzzle: puzzle.puzzle }});
      }
    }

    const onChangePuzzleSize = (event) => {
        setPuzzleSize(event.target.value);
    }
 
  return <>
    <div className="WordSearchApp">
      <div className="HeaderContainer">
        {header.split(' ').map((letter, l) => {
          return <><div className={l % 2 == 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{letter}</div></>
        })}
      </div>

      <div className="HomeForm">
        <div>
          <div>            
            <div className="HomeForm__Label"><b>Puzzle Title</b></div>
              <input
                  className="HomeForm__Input"
                  type="text" 
                  value={title}
                  placeholder='Input Title'
                  onChange={(e) => setTitle(e.target.value)}
              />
          </div>


          <div className="HomeFormRadioGroup">
            <div><b>Puzzle Size:</b></div>
            <div className="HomeFormRadio">
              <input
                type="radio"
                value="small"
                checked={puzzleSize === "small"}
                onChange={onChangePuzzleSize}
              />
              <div>small [12x12] 15-ish words</div>
            </div>        

            <div className="HomeFormRadio">
              <input
                type="radio"
                value="medium"
                checked={puzzleSize === "medium"}
                onChange={onChangePuzzleSize}
              />
              <div>medium [20x15] 25-ish words</div>
            </div>  

            
            <div className="HomeFormRadio">
              <input
                type="radio"
                value="large"
                checked={puzzleSize === "large"}
                onChange={onChangePuzzleSize}
              />
              <div>large [23x18] 35-ish words</div>
            </div>  
          </div>

          <div className="HomeForm__Checkbox">   
            <label>
                <input
                    type="checkbox"
                    checked={diagonalChecked}
                    onChange={(e) => {
                        setdiagonalChecked(!diagonalChecked);
                    }}
                    />
                    Diagonal routes (recommended)
            </label>
          </div>

        </div>

        <div style={{marginTop:"15px"}}>
          <div className="HomeForm__Label">Words:</div>

          <div>
            <button className="WordButton" style={{backgroundColor:"#287bbf"}} type="button" onClick={sortAlphabetical}>
              * Sort Alphabetical
            </button>

            <button className="WordButton" style={{backgroundColor:"#bf2899"}} type="button" onClick={createPuzzle}>
              ~ Done! Create Puzzle
            </button>
      

            <div style={{paddingTop:"8px"}}>
                Word Count: {words.filter(elem => elem).length}
            </div>

            <div style={{paddingTop:"8px"}}>
                Letter Count: {words.join('').replaceAll(' ', '').length}
            </div>

            <div className="HomeForm__WordsBox">
              <label>
                <textarea className="HomeForm__WordInput" style={{resize:"none"}} rows={25} cols={35} value={wordArea} onChange={(e) => {
                    setWordArea(e.target.value);
                    setWords(e.target.value.split('\n'));
                }}/>
              </label>

              {/* {words.map((word, idx) => 
                  <div key={idx}>
                      <WordInput wordVal={word} words={words} setWords={setWords} wordIdx={idx}></WordInput>
                  </div>
              )}
              <button className="WordButton"  type="button" onClick={addNewWord}>
                  + Add Word
              </button> */}
             
            </div>
          </div>

        </div>
      </div> {/*end homeform */}
    </div>
  </>;
};

export default PuzzleForm;