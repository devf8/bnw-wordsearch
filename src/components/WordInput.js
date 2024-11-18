import React from 'react';

const WordInput = ({wordVal, words, setWords, wordIdx}) => {
    const removeWord = (wordIdx) => {
        let newWords = [...words];
        newWords.splice(wordIdx, 1);
        setWords(newWords); 
    }
    
    return <>
        <div style={{width:"30px", display:"inline-block"}}>
            {wordIdx + 1}
        </div>
        <input
            className="WordInput"
            type="text" 
            value={wordVal}
            onChange={(e) => {
                let newWords = [...words];
                newWords[wordIdx] = e.target.value.replaceAll(' ', '');
                setWords(newWords);
            }}
        />
        <button className="RemoveWord" type="button" onClick={() => removeWord(wordIdx)}>
            x
        </button>

    </>;
}

export default WordInput;