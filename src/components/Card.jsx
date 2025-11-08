import { forwardRef } from 'react'
import CardInfo from './CardInfo'
import Togglable from './Togglable'

const Card = forwardRef(({ word }, ref) => {
    return (
        <div>
            {word.eng}
            <Togglable ref={ref} buttonlabel={'show translation'}>
                <CardInfo word={word} />
            </Togglable>
        </div>
    )
})

export default Card