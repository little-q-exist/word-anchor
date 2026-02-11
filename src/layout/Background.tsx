import { Layout, Menu, type MenuProps } from 'antd';
import { Link, Outlet } from 'react-router';

const { Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    { label: <Link to={`/learn`}>LEARN</Link>, key: 'learn' },
    { label: <Link to={`/login`}>LOGIN</Link>, key: 'login' },
];

const Background = () => {
    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        backgroundColor: 'grey',
                        borderRadius: '2px',
                        width: '1rem',
                        display: 'block',
                    }}
                >
                    hhh
                </div>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    theme="dark"
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Layout>
                <Content style={{margin: '0 1rem'}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Background;
