import wordServices from './services/words'
import Card from './components/Card'
import ButtonGroup from './components/ButtonGroup'
import { useEffect, useState } from 'react'
import Button from './components/Button'

const App = () => {
    const [index, setIndex] = useState(0)
    // TODO: 从服务器获取单词列表
    const [words, setWords] = useState([])
    const [shouldShowInfo, setShouldShowInfo] = useState(false)

    useEffect(() => {
        wordServices.getALL().then((words) => {
            setWords(words)
        })
    }, [])

    const handleNextClick = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
        setShouldShowInfo(false)
    }

    const handleKnown = () => {
        const word = words[index]
        const updatedWord = { ...word, familiarity: word.familiarity + 1 }
        setWords(words.map((word) => word.english === updatedWord.english ? updatedWord : word))
        setShouldShowInfo(true)
    }

    const handleUnknown = () => {
        const word = words[index]
        const updatedWord = { ...word, familiarity: 0 }
        setWords(words.map((word) => word.english === updatedWord.english ? updatedWord : word))
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