import Button from './Button'
import { useState } from 'react'

const Togglable = ({ buttonlabel, children }) => {
    const [visible, setVisible] = useState(true)

    const ToggleVisibility = () => {
        setVisible(!visible)
    }

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div>
            <div style={showWhenVisible}>
                {children}
                <Button onClick={ToggleVisibility} label={'hide'} />
            </div>
            <div style={hideWhenVisible}>
                <Button onClick={ToggleVisibility} label={buttonlabel} />
            </div>
        </div>
    )
}

export default Togglable