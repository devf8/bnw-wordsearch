import { useState } from 'react';
import PuzzleCreator from '../utils/PuzzleCreator';
import { useNavigate } from 'react-router-dom';

const PuzzleForm = () => {
    const navigate = useNavigate();
    const sessState = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : null;

    const defaultForm = {
      title: '',
      words: [],
      puzzleSize: 'medium',
      wordArea: '',
      diagonalChecked: true,
      sortChecked: true,
      formDone: false,
      puzzle: {}
    }
    
    const [state, setState] = useState({
      title: sessState?.title ? sessState.title : '',
      words: sessState?.words ? sessState.words : [],
      puzzleSize: sessState?.puzzleSize ? sessState.puzzleSize : 'medium',
      wordArea: sessState?.wordArea ? sessState.wordArea : '',
      diagonalChecked: sessState?.diagonalChecked === false ? false : true,
      sortChecked: sessState?.sortChecked === false ? false : true,
      formDone: false,
      puzzle: sessState?.puzzle ? sessState.puzzle : {}
    });

    const header = "bent n wiggly word search generator by F8";

    const resetForm = () => {
      let newState = {
        ...defaultForm,
        // words: state.words,
        // wordArea: state.wordArea,
        puzzle: {...state.puzzle},
      };

      setState(newState);

      sessionStorage.setItem('state', JSON.stringify(newState));
    }   

    const sortAlphabetical = () => {
        let newWords = cleanWordsInput(state.words);
        newWords = newWords.sort();
        setState({
          ...state,
          wordArea: newWords.join('\n'),
          words: newWords
        });
    }

    //remove empty, trim, and set to uppercase
    const cleanWordsInput = (words) => {
      let newWords = [...words];
      newWords = newWords.filter(elem => PuzzleCreator.cleanWord(elem) !== '');
      newWords.forEach((word, w) => {
        newWords[w] = word.toUpperCase().trim();
      });
      return newWords;
    }

    const createPuzzle = () => {
      const { title, words, puzzleSize, diagonalChecked, sortChecked } = {...state};
      const createPuzzle = PuzzleCreator.createPuzzle(title, words, undefined, undefined, puzzleSize, diagonalChecked, sortChecked, undefined);
      if (createPuzzle.exhaustedTrigger) {
          console.log('!!! something is wrong');
          alert('Something went wrong with generating your puzzle. Try reducing word/letter counts or increasing puzzle size.');
      } else if (createPuzzle.message) {
        alert(createPuzzle.message);
      } else {
        let doneState = {...state, formDone: true, puzzle: createPuzzle.puzzle};
        setState(doneState);

        let sessPuzzles = sessionStorage.getItem('puzzles') ? JSON.parse(sessionStorage.getItem('puzzles')) : [];
        let puzzleNav = `bnwf8-${Date.now()}`;
        sessPuzzles.push(puzzleNav);

        sessionStorage.setItem('state', JSON.stringify(doneState));
        sessionStorage.setItem('puzzles', JSON.stringify(sessPuzzles));
        sessionStorage.setItem(puzzleNav, JSON.stringify(createPuzzle.puzzle));

        setTimeout(() => {
          navigate(`/puzzle/${puzzleNav}`);
        }, 800); 
      }
  
    }

    const onChangePuzzleSize = (e) => {
        setState({...state, puzzleSize: e.target.value})
    }
 
  return <>
    <div className="WordSearchApp">
      <div className="HeaderContainer">
        {header.split(' ').map((word, w) => {
          return <div key={`homeheader${w}`} className={w % 2 === 0 ? 'HeaderLetter' : 'HeaderLetter2'}>{word}</div>
        })}
      </div>
      <div className="FormContainer">

        <div className="HomeForm" style={{textAlign:"center"}}>
          <div >
            <div>
              <button className="WordButton" style={{backgroundColor:"#287bbf", float:"right"}} type="button" onClick={resetForm}>
                reset
              </button>
              <div style={{clear:"both"}}/>
              <div className="HomeForm__Label"><b>Puzzle Title:</b></div>
                <input
                    className="HomeForm__Input"
                    type="text" 
                    value={state.title}
                    placeholder='Input Title'
                    maxLength={40}
                    onChange={(e) => setState({...state, title: e.target.value})}
                />


              <div className="HomeFormRadioGroup">
                <div><b>Puzzle Size:</b></div>
                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="small"
                      checked={state.puzzleSize === "small"}
                      onChange={onChangePuzzleSize}
                    />
                    small [12x12] 10-ish words
                  </label>
                </div>        

                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="medium"
                      checked={state.puzzleSize === "medium"}
                      onChange={onChangePuzzleSize}
                    />
                      medium [18x18] 20-ish words 
                  </label>
                </div>  
                
                <div className="HomeFormRadio">
                  <label>
                    <input
                      type="radio"
                      value="large"
                      checked={state.puzzleSize === "large"}
                      onChange={onChangePuzzleSize}
                    />
                    large [23x20]30-ish words
                  </label>
                </div>  
              </div>

              <div><b>Puzzle Output:</b></div>
              <div className="HomeForm__Checkbox">   
                <label>
                    <input
                        type="checkbox"
                        checked={state.diagonalChecked}
                        onChange={(e) => {
                            setState({...state, diagonalChecked: !state.diagonalChecked});
                        }}
                        />
                        Diagonal routes (recommended)
                </label>
              </div>

              <div className="HomeForm__Checkbox">   
                <label>
                    <input
                        type="checkbox"
                        checked={state.sortChecked}
                        onChange={(e) => setState({...state, sortChecked: !state.sortChecked})}
                        />
                        Sort Alphabetical
                </label>
              </div>

            </div>

            <div style={{marginTop:"8px"}}>
              <div className="HomeForm__Label">Word Entries:</div>

              <div>
                <button className="WordButton" style={{backgroundColor:"#287bbf"}} type="button" onClick={sortAlphabetical}>
                  * Sort Entries
                </button>

                <button className={'WordButton' + (state.formDone ? ' Go' : '')} style={{backgroundColor:"#bf2899"}} type="button" onClick={createPuzzle}>
                  ~ Done! Create Puzzle
                </button>

                <div style={{paddingTop:"8px"}}>
                  [Words: {state.words.filter(elem => elem).length}]  [Letters: {PuzzleCreator.cleanWord(state.words.join('')).length}]
                </div>
        
                <div className="HomeForm__WordsBox">
                  <label>
                    <textarea 
                      className="HomeForm__WordInput" 
                      maxLength={4000}
                      style={{resize:"none"}} placeholder="input one word entry per line" rows={16} cols={35} value={state.wordArea} onChange={(e) => {
                        setState({
                          ...state, 
                          wordArea: e.target.value, 
                          words: e.target.value.split('\n')
                        });
                    }}/>
                  </label>
                </div>
              </div>

            </div>
          </div> {/*end homeform */}
        </div>

        <div className="HomeForm--Guide">
          <div><b>Guidelines</b></div>         
          <div>
            <ul>
              <br/>
              <li>
                <a className='HomeLink' href="/bnwf8-cheesy-peasy.png" rel="noreferrer" target="_blank">What is a bent and wiggly word search puzzle? Click this to see a sample solved puzzle.</a>
              </li>
              <br/>
              <li>Word entry length: 2-16 chars</li>
              <li>Spaces and these special characters ('",-!?) 
                are supported.</li>
              <br/>
              <li>Image download feature is formatted to work best with A5 paper size.</li>
              <br/>
              <li><a className="HomeLink" href="https://github.com/devf8/bnw-wordsearch" rel="noreferrer" target="_blank">github</a></li>
              <br/>
            </ul>
          </div> 
        </div>
      </div>
    </div>
  </>;
};

export default PuzzleForm;