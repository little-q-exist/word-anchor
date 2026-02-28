import { StarFilled, StarOutlined, LeftOutlined } from '@ant-design/icons';
import { FloatButton, message } from 'antd';
import type { RootState } from '../../store';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { UserLearningData } from '../../types';

import userService from '../../services/users';

interface WordSideButtonGroupInterface {
    wordId: string;
    showReturn?: boolean;
}

const WordSideButtonGroup = ({ wordId, showReturn = false }: WordSideButtonGroupInterface) => {
    const user = useSelector((state: RootState) => state.user);
    const [favorited, setFavorited] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            userService
                .getLearningData(user._id, wordId, ['favorited'])
                .then((data: UserLearningData) => {
                    if (data) {
                        setFavorited(data.favorited);
                    }
                });
        }
    }, [user, wordId]);

    const handleFavorite = async () => {
        if (!user) {
            messageApi.error('Please login!');
            return;
        }
        setFavorited(!favorited);
        try {
            const updatedData = await userService.updateFavorite(user._id, wordId);
            if (favorited !== updatedData.favorited) {
                setFavorited(updatedData.favorited);
            }
        } catch (error: unknown) {
            console.error(error);
            messageApi.error('NetWork error');
            setFavorited(!favorited);
        }
    };

    const handleReturn = () => {
        navigate('..', { relative: 'path' });
    };

    return (
        <>
            {contextHolder}
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
                {showReturn && <FloatButton onClick={handleReturn} icon={<LeftOutlined />} />}
            </FloatButton.Group>
        </>
    );
};

export default WordSideButtonGroup;
