import { StarFilled, StarOutlined } from '@ant-design/icons';
import type { RootState } from '@/store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FloatButton, message } from 'antd';
import { useSelector } from 'react-redux';
import wordCoreUserService from '@modules/word-core/services/users';
import wordLearningUserService from '@modules/word-learning/services/users';
import type { UserLearningData } from '@modules/word-core/types';
import type React from 'react';

/** Spec: Favourite functional color #f5dc4d */
const FAVOURITE_COLOR = '#f5dc4d';

const iconStyle: React.CSSProperties = {
    color: FAVOURITE_COLOR,
};

interface FavouriteSideButtonInterface {
    wordId: string;
}

const FavouriteSideButton = ({ wordId }: FavouriteSideButtonInterface) => {
    const [messageApi, contextHolder] = message.useMessage();
    const user = useSelector((state: RootState) => state.user);

    const {
        data: isFavorited,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['learningData', user?._id, wordId],
        queryFn: () => wordLearningUserService.getLearningData(user!._id, wordId, ['favorited']),
        enabled: !!user && !!wordId,
        select: (data: UserLearningData) => {
            if (!data) return false;
            return data.favorited;
        },
        refetchOnWindowFocus: false,
    });

    const favoritedMutation = useMutation({
        mutationFn: ({ userId }: { userId: string }) =>
            wordCoreUserService.updateFavorite(userId, wordId),
        onMutate: async (_variables, context) => {
            await context.client.cancelQueries({ queryKey: ['learningData', user?._id, wordId] });
            const previousData = context.client.getQueryData(['learningData', user?._id, wordId]);
            if (previousData) {
                context.client.setQueryData(
                    ['learningData', user?._id, wordId],
                    (old: UserLearningData) => {
                        return { ...old, favorited: !old.favorited };
                    }
                );
            }
            return { previousData };
        },
        onError: (_error, _variables, onMutateResult, context) => {
            if (onMutateResult?.previousData) {
                context.client.setQueryData(
                    ['learningData', user?._id, wordId],
                    onMutateResult.previousData
                );
            }
        },
        onSettled: (_data, _error, _variables, _onMutateResult, context) => {
            context.client.invalidateQueries({ queryKey: ['learningData', user?._id, wordId] });
        },
    });

    const handleFavorite = async () => {
        if (!user) {
            messageApi.error('Please login!');
            return;
        }
        favoritedMutation.mutate({ userId: user._id });
    };
    return (
        <>
            {contextHolder}
            {!isPending && !isError && (
                <FloatButton
                    onClick={handleFavorite}
                    icon={
                        isFavorited ? (
                            <StarFilled style={iconStyle} />
                        ) : (
                            <StarOutlined style={iconStyle} />
                        )
                    }
                />
            )}
        </>
    );
};

export default FavouriteSideButton;
