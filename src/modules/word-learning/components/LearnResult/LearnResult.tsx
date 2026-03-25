import { Flex, Button } from 'antd';
import { useNavigate } from 'react-router';
import type { BriefWordWithLearnStatus } from '@/types';
import LearnResultTable from './LearnResultTable';

interface LearnResultProps {
    briefWords: BriefWordWithLearnStatus[];
}

const LearnResult = ({ briefWords }: LearnResultProps) => {
    const navigate = useNavigate();

    return (
        <Flex vertical gap="middle" style={{ margin: '1rem 0', height: '100%' }}>
            <h2 style={{ textAlign: 'center' }}>Learning Complete!</h2>
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
