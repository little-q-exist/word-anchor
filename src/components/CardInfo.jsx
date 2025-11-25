const CardInfo = ({ word, visible }) => {
    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div style={showWhenVisible}>
            {word.definitions.map((definition, index) => (
                <div key={index}>
                    <div>{definition.partOfSpeech}</div>
                    <div>{definition.meaning}</div>
                </div>
            ))}
        </div>
    )
}

export default CardInfo