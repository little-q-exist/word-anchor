import Button from './Button'
import { useImperativeHandle, useState } from 'react'

const Togglable = ({ children, ref }) => {
    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility: toggleVisibility,
        }
    })

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div>
            <div style={showWhenVisible}>
                {children}
            </div>
        </div>
    )
}

export default Togglable