import Button from './Button'

const ButtonGroup = ({ handleKnown, handleUnknown }) => {
    return (
        <div>
            <Button label={'Known'} onClick={handleKnown} />
            <Button label={'Unknown'} onClick={handleUnknown} />
        </div>
    )
}

export default ButtonGroup