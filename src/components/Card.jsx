import CardInfo from './CardInfo'

const Card = ({ word, visible }) => {
    return (
        <div>
            {word.eng}
            <CardInfo word={word} visible={visible} />
        </div>
    )
}

export default Card