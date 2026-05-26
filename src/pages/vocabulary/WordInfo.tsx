import WordCards from '@/modules/word-core/components/WordCards/WordCards';

import wordService from '@modules/word-core/services/words';

import WordSideButtonGroup from '@/modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Flex, Skeleton, Result, Button, theme } from 'antd';

const WordInfo = () => {
    const { token } = theme.useToken();
    const { id } = useParams() as { id: string };

    const {
        data: word,
        isError,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ['wordInfo', id],
        queryFn: () => wordService.getById(id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return (
            <Result
                status="error"
                title="Failed to load word information"
                subTitle="The word could not be retrieved. Please try again."
                extra={[
                    <Button type="primary" key="retry" onClick={() => refetch()}>
                        Try Again
                    </Button>,
                ]}
            />
        );
    }

    return (
        <Flex style={{ height: '100%', padding: token.paddingXXL }} vertical>
            {isPending ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <>
                    <WordCards word={word} visible={true} key={word._id} />
                    <WordSideButtonGroup
                        wordId={word._id}
                        returnOption={{ showReturn: true, to: '..' }}
                    />
                </>
            )}
        </Flex>
    );
};

export default WordInfo;
