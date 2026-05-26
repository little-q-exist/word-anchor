import { Button, ConfigProvider, Flex, Progress, Result, Skeleton } from 'antd';
import type { ThemeConfig } from 'antd';
import {
    isRouteErrorResponse,
    Link,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigation,
} from 'react-router';
import type { Route } from './+types/root';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './features/userSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const themeConfig: ThemeConfig = {
    token: {
        fontSize: 14,
        fontSizeHeading1: 32,
        fontSizeHeading2: 24,
        fontSizeHeading3: 18,
        lineHeight: 1.6,
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        colorPrimary: '#1677ff',
        colorSuccess: '#22c55e',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#1677ff',
        colorLink: '#1677ff',
        colorTextBase: '#1a1a2e',
        colorBgLayout: '#f5f7fa',
        colorBgContainer: '#ffffff',
        colorBorder: '#e5e7eb',
        colorSplit: '#f0f0f0',
        colorText: '#1a1a2e',
        colorTextSecondary: '#6b7280',
        colorTextTertiary: '#9ca3af',
        borderRadius: 12,
        borderRadiusSM: 8,
        borderRadiusXS: 6,
        padding: 16,
        paddingXS: 4,
        paddingSM: 8,
        paddingMD: 12,
        paddingLG: 16,
        paddingXL: 20,
        paddingXXL: 24,
        controlHeight: 36,
        controlHeightLG: 48,
        controlHeightSM: 28,
        motionDurationFast: '150ms',
        motionDurationMid: '200ms',
        motionDurationSlow: '250ms',
        motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        motionEaseOut: 'cubic-bezier(0.08, 0.52, 0.52, 1)',
        lineWidth: 1,
    },
    components: {
        Button: {
            controlHeightLG: 48,
            fontSizeLG: 16,
            borderRadius: 8,
        },
        Card: {
            borderRadiusLG: 12,
            paddingLG: 20,
        },
        Input: {
            borderRadius: 8,
            controlHeight: 36,
        },
        Modal: {
            borderRadiusLG: 16,
        },
        Tag: {
            borderRadiusSM: 6,
        },
    },
};

export function Layout({ children }: { children: React.ReactNode }) {
    const htmlStyle = {
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    };
    const bodyStyle = { ...htmlStyle, backgroundColor: themeConfig.token?.colorBgLayout as string };

    return (
        <html lang="en" style={htmlStyle}>
            <head>
                <title>recite-word</title>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>{`
                    *:focus-visible { outline: 2px solid #1677ff; outline-offset: 2px; }
                    h1, h2, h3 { text-wrap: balance; }
                    p { text-wrap: pretty; }
                    .vocabulary-table-row { transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1); }
                    .vocabulary-table-row:hover { transform: translateY(-1px); }
                `}</style>
            </head>
            <body style={bodyStyle}>
                <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export function HydrateFallback() {
    return (
        <Flex justify="center" align="center" style={{ height: '100%' }}>
            <Skeleton active style={{ width: 300 }} />
        </Flex>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    if (isRouteErrorResponse(error)) {
        return (
            <>
                <Result
                    status="error"
                    title={`${error.status} ${error.statusText}`}
                    subTitle={`${error.data}`}
                    extra={[
                        <Button type="default" key="home">
                            <Link to="/">Go Back</Link>
                        </Button>,
                    ]}
                ></Result>
            </>
        );
    } else if (error instanceof Error) {
        return (
            <Result
                status="error"
                title="Application Error"
                subTitle={error.message}
                extra={[
                    <Button type="primary" key="reload" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>,
                ]}
            />
        );
    } else {
        return (
            <Result status="error" title="Unknown Error" subTitle="An unexpected error occurred." />
        );
    }
}

const queryClient = new QueryClient();

const App = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(login());
    }, [dispatch]);

    return (
        <QueryClientProvider client={queryClient}>
            {navigation.state === 'loading' && (
                <Flex
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                    }}
                >
                    <Progress percent={100} showInfo={false} size={2} style={{ margin: 0 }} />
                </Flex>
            )}
            <Outlet />
        </QueryClientProvider>
    );
};

export default App;
