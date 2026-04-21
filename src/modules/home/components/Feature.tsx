import { Col, Flex, Row, Typography } from 'antd';
import { RocketOutlined, ReadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface FeatureProps {
    isLoggedIn: boolean;
}

const Feature = ({ isLoggedIn }: FeatureProps) => {
    return (
        !isLoggedIn && (
            <div
                style={{
                    borderTop: '1px solid #f0f0f0',
                    padding: '3rem 2rem',
                    background: '#fafafa',
                    zIndex: 1,
                }}
            >
                <Row
                    gutter={[48, 24]}
                    justify="center"
                    style={{ maxWidth: 1200, margin: '0 auto' }}
                >
                    <Col xs={24} sm={8}>
                        <Flex gap="middle" align="flex-start">
                            <RocketOutlined
                                style={{ fontSize: '1.5rem', color: '#1677ff', marginTop: 4 }}
                            />
                            <div>
                                <Text strong style={{ fontSize: '1.1rem', display: 'block' }}>
                                    Scientific Method
                                </Text>
                                <Text type="secondary">
                                    Spaced repetition for long-term retention.
                                </Text>
                            </div>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Flex gap="middle" align="flex-start">
                            <ReadOutlined
                                style={{ fontSize: '1.5rem', color: '#1677ff', marginTop: 4 }}
                            />
                            <div>
                                <Text strong style={{ fontSize: '1.1rem', display: 'block' }}>
                                    Focused Context
                                </Text>
                                <Text type="secondary">
                                    Learn words within meaningful sentences.
                                </Text>
                            </div>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Flex gap="middle" align="flex-start">
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: '2px solid #1677ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 4,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: '#1677ff',
                                    }}
                                />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: '1.1rem', display: 'block' }}>
                                    Minimal Design
                                </Text>
                                <Text type="secondary">
                                    Zero distractions, total focus on words.
                                </Text>
                            </div>
                        </Flex>
                    </Col>
                </Row>
            </div>
        )
    );
};

export default Feature;
