const CardInfo = ({ word, visible }) => {
    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div style={showWhenVisible}>
            <div>{word.ch}</div>
            <div>master degree: {word.master}</div>
        </div>
    )
}

export default CardInfo