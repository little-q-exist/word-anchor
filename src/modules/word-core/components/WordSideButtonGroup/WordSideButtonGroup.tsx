import { LeftOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useNavigate } from 'react-router';
import FavouriteSideButton from './FavouriteSideButton';

interface WordSideButtonGroupInterface {
    wordId: string;
    returnOption?:
        | {
              showReturn: true;
              to: string;
          }
        | { showReturn: false };
}

const WordSideButtonGroup = ({
    wordId,
    returnOption = { showReturn: false },
}: WordSideButtonGroupInterface) => {
    const navigate = useNavigate();

    const handleReturn = () => {
        if (returnOption.showReturn) {
            navigate(returnOption.to, { relative: 'path', replace: true });
        }
    };

    return (
        <>
            <FloatButton.Group>
                <FavouriteSideButton wordId={wordId} />
                {returnOption.showReturn && (
                    <FloatButton onClick={handleReturn} icon={<LeftOutlined />} />
                )}
            </FloatButton.Group>
        </>
    );
};

export default WordSideButtonGroup;
