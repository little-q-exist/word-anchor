import CardInfo from './CardInfo'

const Card = ({ word, visible }) => {
    if (!word) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>{word.english}</div>
            <div>{word.phonetic}</div>
            <div>familiarity: {word.familiarity}</div>
            <CardInfo word={word} visible={visible} />
        </div>
    )
}

export default Card