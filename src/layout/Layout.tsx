import { Avatar, Layout, Menu, type MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router';
import type { RootState } from '../store';
import { logout } from '../features/userSlice';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const BackgroundLayout = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const loginItem: MenuItem = { label: <Link to={`/login`}>LOGIN</Link>, key: '/login' };

    const userItem: MenuItem = {
        label: (
            <Avatar style={{ backgroundColor: '#1677ff' }}>
                {user ? user.username.slice(0, 3) : 'User'}
            </Avatar>
        ),
        key: 'user',
        children: [
            {
                label: <a>Profile</a>,
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
        { label: <Link to={`/learn`}>LEARN</Link>, key: '/learn' },
        user ? userItem : loginItem,
    ];

    return (
        <Layout style={{ height: '100%' }}>
            <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
                <div
                    style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '5px',
                        width: '5rem',
                        margin: '.7rem 1rem',
                        display: 'block',
                        textAlign: 'center',
                        lineHeight: '32px',
                        color: 'black',
                    }}
                >
                    <Link to="..">LOGO</Link>
                </div>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
                    selectedKeys={[location.pathname]}
                />
            </Header>
            <Content style={{ margin: '0 1.5rem' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default BackgroundLayout;
