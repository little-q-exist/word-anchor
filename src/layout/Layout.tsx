import { Avatar, Flex, Layout, Menu, type MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import type { RootState } from '../store';
import { logout } from '../features/userSlice';
import Title from 'antd/es/typography/Title';
import { BookOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const BackgroundLayout = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const loginItem: MenuItem = { label: <NavLink to={`/login`}>LOGIN</NavLink>, key: '/login' };

    const userItem: MenuItem = {
        label: (
            <Avatar style={{ backgroundColor: '#1677ff' }}>
                {user ? user.username.slice(0, 3) : 'User'}
            </Avatar>
        ),
        key: 'user',
        children: [
            {
                label: <NavLink to="/profile">Profile</NavLink>,
                key: '/profile',
            },
            {
                label: <a>Settings</a>,
                key: '/settings',
            },
            { type: 'divider' },
            {
                label: <a onClick={() => dispatch(logout())}>Logout</a>,
                key: 'logout',
            },
        ],
    };

    const menuItems: MenuItem[] = [
        ...(user
            ? [
                  { label: <NavLink to={`/learn`}>LEARN</NavLink>, key: '/learn' },
                  { label: <NavLink to={'/review'}>REVIEW</NavLink>, key: '/review' },
              ]
            : []),
        { label: <NavLink to="/words">WORDS</NavLink>, key: '/words' },
        user ? userItem : loginItem,
    ];

    return (
        <Layout style={{ height: '100%' }}>
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
                <Link to="..">
                    <Flex align="center" gap={'small'}>
                        <BookOutlined style={{ fontSize: '1.5rem' }} />
                        <Title level={1} style={{ fontSize: '1.5rem', margin: 0 }}>
                            WordAnchor
                        </Title>
                    </Flex>
                </Link>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
                    selectedKeys={[location.pathname]}
                />
            </Header>
            <Content style={{ padding: '0 1.5rem' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default BackgroundLayout;
