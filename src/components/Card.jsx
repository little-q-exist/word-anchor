import CardInfo from './CardInfo'
import Togglable from './Togglable'

const Card = ({ word }) => {
    return (
        <div>
            {word.eng}
            <Togglable buttonlabel={'show translation'}>
                <CardInfo word={word} />
            </Togglable>
        </div>
    )
}

export default Card