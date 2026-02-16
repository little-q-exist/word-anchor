import { Layout, Menu, type MenuProps } from 'antd';
import { Link, Outlet } from 'react-router';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    { label: <Link to={`/learn`}>LEARN</Link>, key: 'learn' },
    { label: <Link to={`/login`}>LOGIN</Link>, key: 'login' },
];

const BackgroundLayout = () => {
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
