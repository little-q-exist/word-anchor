import words from './word'
import Card from './components/Card'
import ButtonGroup from './components/ButtonGroup'
import { useState } from 'react'

const App = () => {
    const [index, setIndex] = useState(0)

    const handleKnown = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    const handleUnknown = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} />

            <ButtonGroup handleKnown={handleKnown} handleUnknown={handleUnknown} />
        </div>
    )
}

export default App