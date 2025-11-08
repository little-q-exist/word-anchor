import words from './word'
import Card from './components/Card'
import ButtonGroup from './components/ButtonGroup'
import { useRef, useState } from 'react'
import Button from './components/Button'

const App = () => {
    const [index, setIndex] = useState(0)

    /* 
        当信息隐藏时，展示“知道”和“不知道”按钮
        当信息显示时，展示“下一个”按钮
    */
    const [shouldShowInfo, setShouldShowInfo] = useState(false)

    const visibilityRef = useRef(null)

    const handleNextClick = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    const handleKnown = () => {
        visibilityRef.current.toggleVisibility()
        setShouldShowInfo(true)
    }

    const handleUnknown = () => {
        visibilityRef.current.toggleVisibility()
        setShouldShowInfo(true)
    }

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} ref={visibilityRef} />

            {!shouldShowInfo && (<ButtonGroup handleKnown={handleKnown} handleUnknown={handleUnknown} />)}
            {shouldShowInfo && (<Button label={'Next'} onClick={() => {
                handleNextClick()
                setShouldShowInfo(false)
                visibilityRef.current.toggleVisibility()
            }} />)}
        </div>
    )
}

export default App