import WordCards from '@/modules/word-core/components/WordCards/WordCards';
import CenteredSpin from '../../shared/components/CenteredSpin';

import wordService from '../../services/words';

import WordSideButtonGroup from '@/modules/word-core/components/WordSideButtonGroup/WordSideButtonGroup';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const WordInfo = () => {
    const { id } = useParams() as { id: string };

    const {
        data: word,
        isError,
        isPending,
    } = useQuery({
        queryKey: ['wordInfo', id],
        queryFn: () => wordService.getById(id),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    if (isError) {
        return <div>Failed to load word information.</div>;
    }

    return (
        <>
            <div style={{ height: '100%' }}>
                {isPending ? (
                    <CenteredSpin />
                ) : (
                    <>
                        <WordCards word={word} visible={true} key={word._id} />
                        <WordSideButtonGroup
                            wordId={word._id}
                            returnOption={{ showReturn: true, to: '..' }}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default WordInfo;
