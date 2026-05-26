import { useCallback } from 'react';
import { Statistic, Card, Row, Col, Typography, Skeleton, Result, Button, theme } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import userService from '@modules/word-learning/services/users';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/layout/ProtectedRoute/ProtectedRoute';

const { Title } = Typography;

const Profile = () => {
    const { token } = theme.useToken();
    const user = useSelector((state: RootState) => state.user);
    const fetchUserStats = useCallback(() => {
        if (!user || !user._id) {
            throw new Error('User ID is missing');
        }
        return userService.getUserStats(user._id);
    }, [user]);

    const { data, isError, isPending, refetch } = useQuery({
        queryKey: ['userStats', user?._id],
        queryFn: fetchUserStats,
        enabled: !!user?._id,
    });

    if (isError) {
        return (
            <ProtectedRoute>
                <div style={{ padding: token.paddingXXL }}>
                    <Result
                        status="error"
                        title="Failed to load profile"
                        subTitle="Unable to retrieve your learning statistics."
                        extra={[
                            <Button type="primary" key="retry" onClick={() => refetch()}>
                                Try Again
                            </Button>,
                        ]}
                    />
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            {isPending ? (
                <div style={{ padding: token.paddingXXL }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            ) : (
                <div style={{ padding: token.paddingXXL }}>
                    <Title level={2}>{user?.username ?? ''}</Title>
                    <Row gutter={16} style={{ marginTop: token.paddingXXL }}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Today's words"
                                    value={data?.todayCount || 0}
                                    suffix=" words"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total words learned"
                                    value={data?.totalCount || 0}
                                    suffix=" words"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </ProtectedRoute>
    );
};

export default Profile;
