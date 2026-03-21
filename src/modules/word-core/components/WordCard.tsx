import { Card } from 'antd';
import { cardStyle } from '../styles/cardStyle';
import { centerStyle } from '../../../shared/styles/centerStyle';

interface WordCardProps {
    children: React.ReactNode;
    centerContent?: boolean;
}

const WordCard = ({ children, centerContent }: WordCardProps) => {
    return (
        <Card
            style={{
                ...cardStyle,
                ...(centerContent ? centerStyle : {}),
            }}
            styles={{
                body: {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: 0,
                },
            }}
            variant="borderless"
        >
            {children}
        </Card>
    );
};

export default WordCard;
