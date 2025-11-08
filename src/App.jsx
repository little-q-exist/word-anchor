import words from './word'
import Card from './components/Card'
import ButtonGroup from './components/ButtonGroup'
import { useRef, useState } from 'react'

const App = () => {
    const [index, setIndex] = useState(0)
    const [shouldShowInfo, setShouldShowInfo] = useState(false)

    const visibilityRef = useRef(null)

    const handleKnown = () => {
        visibilityRef.current.toggleVisibility()
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    const handleUnknown = () => {
        visibilityRef.current.toggleVisibility()
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} ref={visibilityRef} />

            <ButtonGroup handleKnown={handleKnown} handleUnknown={handleUnknown} />
        </div>
    )
}

export default App