import { useState } from 'react';
import WordInput from './WordInput';
import PuzzleCreator from '../utils/PuzzleCreator';
const PuzzleForm = () => {
    
    const [title, setTitle] = useState("");
    const [words, setWords] = useState([]);
    const [wordCount, setWordCount] = useState(0);

    function addNewWord() {
        setWords([...words, '']);
        console.log(words);
    }        

    const sortAlphabetical = () => {
        let newWords = [...words];
        newWords = newWords.filter(elem => elem);
        newWords = newWords.sort();
        setWords(newWords); 
    }

    const createPuzzle = () => {
        console.log(PuzzleCreator.createPuzzle(words));
    }
 
    return <div className="WordSearchApp">
        <div className="HomeHeader">
            Welcome to bent n wiggly word search creator
        </div>
        <div className="HomeForm">
        <form>
            <label className="HomeForm__Label">Puzzle Title</label>
            <input
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{marginTop:"20px"}}>
            <div className="HomeForm__Label">Words:</div>
            <div>
                {/* <button className="WordButton" type="button" onClick={addNewWord}>
                + Add Word
                </button> */}
                <button className="WordButton" style={{backgroundColor:"#287bbf"}} type="button" onClick={sortAlphabetical}>
                * Sort Alphabetical
                </button>
                <button className="WordButton" style={{backgroundColor:"#bf2899"}} type="button" onClick={createPuzzle}>
                ~ Done! Create Puzzle
                </button>
                <div style={{paddingTop:"10px"}}>
                Word Count: {words.filter(elem => elem).length}
                </div>
                <div className="HomeForm__WordsBox">
                {words.map((word, idx) => 
                    <div key={idx}>
                        <WordInput wordVal={word} words={words} setWords={setWords} wordIdx={idx}></WordInput>
                    </div>
                )}
                <button className="WordButton"  type="button" onClick={addNewWord}>
                    + Add Word
                </button>
                {/* {words[words.length-1] !== '' && <WordInput wordVal={''} words={words} setWords={setWords} wordIdx={words.length}></WordInput>} */}
                </div>
            </div>
            </div>
        </form>
        </div>
    </div>;
};

export default PuzzleForm;