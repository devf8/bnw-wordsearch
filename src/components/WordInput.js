import React from 'react';

class WordInput extends React.Component {
    render() {
        const removeWord = (wordIdx) => {
            let newWords = [...this.props.words];
            newWords.splice(wordIdx, 1);
            this.props.setWords(newWords); 
            console.log('splice idx' );
        }

        return <>
            <div style={{width:"30px", display:"inline-block"}}>
                {this.props.wordIdx + 1}
            </div>
            <input
                className="WordInput"
                type="text" 
                value={this.props.wordVal}
                onChange={(e) => {
                    let newWords = [...this.props.words];
                    newWords[this.props.wordIdx] = e.target.value.replace(' ', '').toUpperCase();
                    this.props.setWords(newWords);
                    console.log(newWords);
                }}
            />
            <button className="RemoveWord" type="button" onClick={() => removeWord(this.props.wordIdx)}>
                x
            </button>

        </>;
    }
}

export default WordInput;