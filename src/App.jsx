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

    const handleKnown = async () => {
        const word = words[index]
        const familiarity = word.familiarity >= 3 ? 3 : word.familiarity + 1
        const mastered = familiarity === 3 ? true : false
        const updatedWord = { ...word, familiarity, mastered }
        const newWord = await wordServices.update(updatedWord)
        setWords(words.map((word) => word.english === newWord.english ? newWord : word))
        setShouldShowInfo(true)
    }

    const handleUnknown = async () => {
        const word = words[index]
        const mastered = false
        const updatedWord = { ...word, familiarity: 0, mastered }
        const newWord = await wordServices.update(updatedWord)
        setWords(words.map((word) => word.english === newWord.english ? newWord : word))
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