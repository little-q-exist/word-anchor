import { useCallback } from 'react';
import { Statistic, Card, Row, Col, Typography, Spin } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import userService from '../shared/services/users';
import { useQuery } from '@tanstack/react-query';

const { Title } = Typography;

const Profile = () => {
    const user = useSelector((state: RootState) => state.user);
    const fetchUserStats = useCallback(() => {
        if (!user || !user._id) {
            throw new Error('User ID is missing');
        }
        return userService.getUserStats(user._id);
    }, [user]);

    const { data, isError, isPending } = useQuery({
        queryKey: ['userStats', user?._id],
        queryFn: fetchUserStats,
        enabled: !!user?._id,
    });

    if (isError) {
        return <div style={{ padding: '24px' }}>some error occurred</div>;
    }

    return (
        <Spin spinning={isPending}>
            <div style={{ padding: '24px' }}>
                <Title level={2}>我</Title>
                <Row gutter={16} style={{ marginTop: '24px' }}>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="今日学习/复习单词数"
                                value={data?.todayCount || 0}
                                suffix=" 个"
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="累计学习单词数"
                                value={data?.totalCount || 0}
                                suffix=" 个"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Spin>
    );
};

export default Profile;
