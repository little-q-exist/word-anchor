import INIT_words from './word'
import Card from './components/Card'
import ButtonGroup from './components/ButtonGroup'
import { useState } from 'react'
import Button from './components/Button'

const App = () => {
    const [index, setIndex] = useState(0)
    const [words, setWords] = useState(INIT_words)

    /* 
        当信息隐藏时，展示“知道”和“不知道”按钮
        当信息显示时，展示“下一个”按钮
    */
    const [shouldShowInfo, setShouldShowInfo] = useState(false)

    const handleNextClick = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
        setShouldShowInfo(false)
    }

    const handleKnown = () => {
        const word = words[index]
        const updatedWord = { ...word, master: word.master + 1 }
        setWords(words.map((word) => word.eng === updatedWord.eng ? updatedWord : word))
        setShouldShowInfo(true)
    }

    const handleUnknown = () => {
        const word = words[index]
        const updatedWord = { ...word, master: 0 }
        setWords(words.map((word) => word.eng === updatedWord.eng ? updatedWord : word))
        setShouldShowInfo(true)
    }

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} visible={shouldShowInfo} />

            {!shouldShowInfo && (<ButtonGroup handleKnown={handleKnown} handleUnknown={handleUnknown} />)}
            {shouldShowInfo && (<Button label={'Next'} onClick={handleNextClick} />)}
        </div>
    )
}

export default App