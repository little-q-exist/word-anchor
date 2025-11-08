import words from './word'
import Card from './components/Card'
import Button from './components/Button'
import { useState } from 'react'

const App = () => {
    const [index, setIndex] = useState(0)

    const handleButtonClick = () => {
        const nextIndex = (index + 1) % words.length
        setIndex(nextIndex)
    }

    return (
        <div>
            <div>Recite Word App</div>

            <Card word={words[index]} />

            <Button label={'Next'} onClick={handleButtonClick} />
        </div>
    )
}

export default App