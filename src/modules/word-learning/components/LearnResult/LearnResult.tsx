import { Flex, Button, Typography } from 'antd';
import { useNavigate } from 'react-router';
import type { BriefWordWithLearnStatus } from '@modules/word-learning/types';
import LearnResultTable from './LearnResultTable';

interface LearnResultProps {
    briefWords: BriefWordWithLearnStatus[];
}

const LearnResult = ({ briefWords }: LearnResultProps) => {
    const navigate = useNavigate();

    return (
        <Flex vertical gap="middle" style={{ padding: 24, height: '100%' }}>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>Learning Complete!</Typography.Title>
            <LearnResultTable briefWords={briefWords} />
            <Flex justify="center">
                <Button type="primary" onClick={() => navigate('..')} size="large">
                    Finish and Go Back
                </Button>
            </Flex>
        </Flex>
    );
};

export default LearnResult;
