import { StarFilled, StarOutlined } from '@ant-design/icons';
import type { RootState } from '@/store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FloatButton, message } from 'antd';
import { useSelector } from 'react-redux';
import userService from '@/services/users';
import type { UserLearningData } from '@/types';
import type React from 'react';

const iconStyle: React.CSSProperties = {
    color: '#f5dc4d',
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
        queryFn: () => userService.getLearningData(user!._id, wordId, ['favorited']),
        enabled: !!user && !!wordId,
        select: (data: UserLearningData) => data.favorited,
        refetchOnWindowFocus: false,
    });

    const favoritedMutation = useMutation({
        mutationFn: ({ userId }: { userId: string }) => userService.updateFavorite(userId, wordId),
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
            {(!isPending || !isError) && (
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
