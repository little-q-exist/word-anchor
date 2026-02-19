import { Avatar, Button, Layout, Menu, type MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router';
import type { RootState } from '../store';
import { logout } from '../features/userSlice';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const BackgroundLayout = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const loginItem: MenuItem = { label: <Link to={`/login`}>LOGIN</Link>, key: 'login' };

    const userItem: MenuItem = {
        label: (
            <Avatar style={{ backgroundColor: '#1677ff' }}>{user ? user.username : 'User'}</Avatar>
        ),
        key: 'user',
        children: [
            {
                label: <Button onClick={() => dispatch(logout())}>Logout</Button>,
                key: 'logout',
            },
        ],
    };

    const menuItems: MenuItem[] = [
        { label: <Link to={`/learn`}>LEARN</Link>, key: 'learn' },
        user ? userItem : loginItem,
    ];

    return (
        <Layout style={{ height: '100%' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        backgroundColor: 'grey',
                        borderRadius: '5px',
                        width: '5rem',
                        margin: '.7rem 1rem',
                        display: 'block',
                    }}
                >
                    LOGO
                </div>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    theme="dark"
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ margin: '0 1.5rem' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default BackgroundLayout;
