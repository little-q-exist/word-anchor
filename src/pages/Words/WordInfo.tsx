import WordCard from '../../components/WordCard';
import type { Route } from './+types/WordInfo';

import wordService from '../../services/words';
import userService from '../../services/users';

import { FloatButton, message } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useEffect, useState } from 'react';
import type { UserLearningData } from '../../types';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const english = params.english;
    const words = await wordService.getBy({ english });
    const word = words[0];
    return { word };
}

const WordInfo = ({ loaderData }: Route.ComponentProps) => {
    const word = loaderData.word;
    const user = useSelector((state: RootState) => state.user);
    const [favorited, setFavorited] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            userService
                .getLearningData(user._id, word._id, ['favorited'])
                .then((data: UserLearningData) => {
                    setFavorited(data.favorited);
                });
        }
    }, [user, word._id]);

    const handleFavorite = async () => {
        if (!user) {
            messageApi.error('Please login!');
            return;
        }
        const { favorited } = await userService.updateFavorite(user._id, word._id);
        setFavorited(favorited);
    };

    return (
        <>
            {contextHolder}
            <div style={{ height: '100%' }}>
                <WordCard word={word} visible={true} />
                <FloatButton.Group>
                    {user && (
                        <FloatButton
                            onClick={handleFavorite}
                            icon={
                                favorited ? (
                                    <StarFilled style={{ color: '#f5dc4d' }} />
                                ) : (
                                    <StarOutlined style={{ color: '#f5dc4d' }} />
                                )
                            }
                        />
                    )}
                    <FloatButton onClick={() => navigate('..', { relative: 'path' })} />
                </FloatButton.Group>
            </div>
        </>
    );
};

export default WordInfo;
