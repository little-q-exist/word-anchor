const CardInfo = ({ word }) => {
    return (
        <div>
            <div>{word.ch}</div>
            <div>master degree: {word.master}</div>
        </div>
    )
}

export default CardInfo