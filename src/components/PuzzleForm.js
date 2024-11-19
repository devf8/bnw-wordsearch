import {  useState, useReducer } from 'react';
import WordInput from './WordInput';
import PuzzleCreator from '../utils/PuzzleCreator';
import {useNavigate} from 'react-router-dom';

const PuzzleForm = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [words, setWords] = useState([]);
    const [rows, setRows] = useState(20);
    const [cols, setCols] = useState(15);
    const [puzzleSize, setPuzzleSize] = useState('medium');
    const [wordArea, setWordArea] = useState("");
    const [diagonalChecked, setdiagonalChecked] = useState(true);
    const [sortChecked, setSortChecked] = useState(true);
    const [formDone, setFormDone] = useState(false);

    const header = "Welcome to bent n wiggly word search generator by F8"

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
      let puzzle = PuzzleCreator.createPuzzle(title, words, rows, cols, puzzleSize, diagonalChecked, sortChecked);
      if (puzzle.exhaustedTrigger) {
          console.log('~~~ something is wrong');
          alert('Something went wrong with generating your puzzle. Try reducing word/letter count or increasing puzzle size.');
      } else if (puzzle.message) {
        alert(puzzle.message);
      } else {
        setFormDone(true);
        setTimeout(() => {
          navigate('/puzzle', { state: { puzzle: puzzle.puzzle }});
        }, 800); 
      }
    }

    const onChangePuzzleSize = (event) => {
        setPuzzleSize(event.target.value);
    }
 
  return <>
    <div className="WordSearchApp">
      <div className="HeaderContainer">
        {header.split(' ').map((word, w) => {
          return <><div className={w % 2 == 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div></>
        })}
      </div>
      <div className="FormContainer">

        <div className="HomeForm" style={{textAlign:"center"}}>
          <div >
            <div>
              <div>            
                <div className="HomeForm__Label"><b>Puzzle Title</b></div>
                  <input
                      className="HomeForm__Input"
                      type="text" 
                      value={title}
                      placeholder='Input Title'
                      maxLength={40}
                      onChange={(e) => setTitle(e.target.value)}
                  />
              </div>


              <div className="HomeFormRadioGroup">
                <div><b>Puzzle Size:</b></div>
                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="small"
                      checked={puzzleSize === "small"}
                      onChange={onChangePuzzleSize}
                    />
                    small [12x12] 15-ish words
                  </label>
                </div>        

                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="medium"
                      checked={puzzleSize === "medium"}
                      onChange={onChangePuzzleSize}
                    />
                      medium [20x15] 25-ish words 
                  </label>
                </div>  
                
                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="large"
                      checked={puzzleSize === "large"}
                      onChange={onChangePuzzleSize}
                    />
                    large [23x18] 35-ish words
                  </label>
                </div>  
              </div>

              <div><b>Puzzle Output:</b></div>
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

              <div className="HomeForm__Checkbox">   
                <label>
                    <input
                        type="checkbox"
                        checked={sortChecked}
                        onChange={(e) => setSortChecked(!sortChecked)}
                        />
                        Sort Alphabetical
                </label>
              </div>

            </div>

            <div style={{marginTop:"15px"}}>
              <div className="HomeForm__Label">Word Entries:</div>

              <div>
                <button className="WordButton" style={{backgroundColor:"#287bbf"}} type="button" onClick={sortAlphabetical}>
                  * Sort Alphabetical
                </button>

                <button className={'WordButton' + (formDone ? ' Go' : '')} style={{backgroundColor:"#bf2899"}} type="button" onClick={createPuzzle}>
                  ~ Done! Create Puzzle
                </button>

                <div style={{paddingTop:"8px"}}>
                  [Word Count: {words.filter(elem => elem).length}]  [Letter Count: {words.join('').replaceAll(' ', '').length}]
                </div>
        
                <div className="HomeForm__WordsBox">
                  <label>
                    <textarea 
                      className="HomeForm__WordInput" 
                      maxLength={4000}
                      style={{resize:"none"}} placeholder="input one word per line" rows={20} cols={35} value={wordArea} onChange={(e) => {
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

        <div className="HomeForm--Guide">
          <div><b>Guidelines</b></div>         
          <div>
            <ul>
              <li>Max word length: 16 chars</li>
              <li>Spaces are supported.<br/>ex: "HELLO WORLD"</li>
              <li>Press "s" in the puzzle page to view solution.</li>
              <br/>
              <br/>
              <br/>
              <li>
                <a style={{color:"white"}} href="https://www.google.com/search?sca_esv=7b9c9567d754e81c&sxsrf=ADLYWIIbxQUgIto1uLiFm-4Qw4j1H7tUtg:1731996967971&q=bent+and+wiggly+word+puzzle&udm=2&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWd8nbOJfsBGGB5IQQO6L3JzEq8sk6FPCPzvp42tv1tXpZ0Yh36BuFvbp7Lfibs4RlbU4hnt0VM3lOmluQvbDEyUsli9dg2Rr8QJ5d_eC1yq8JW0KDmK3E2qdv1nVyyp4RYuJEZmFpna7uaEhQOWyi1bOysx5Q3qTX9cNA8VlL125VSHsWPCJX-2bj8IBlquy98k8BiA&sa=X&ved=2ahUKEwiLnpzA3-eJAxXzk1YBHbi-CsEQtKgLegQIGBAB&biw=1552&bih=719&dpr=1.65">What is a bent and wiggly word search puzzle?</a>
                <br/>
                Try generating a puzzle with only one long word, then show the solution to see a demo
              </li>
              <br/>
              <li><a style={{color:"white"}} href="https://github.com/fadimaranan/bnw-wordsearch">github project</a></li>
            </ul>
          </div> 
        </div>
      </div>
    </div>
  </>;
};

export default PuzzleForm;