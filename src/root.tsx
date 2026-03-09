import { Button, Flex, Result, Spin } from 'antd';
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

export function Layout({ children }: { children: React.ReactNode }) {
    const resetStyle = {
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
    };

    return (
        <html lang="en" style={resetStyle}>
            <head>
                <title>recite-word</title>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style={resetStyle}>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export function HydrateFallback() {
    return (
        <Flex justify="center" align="center" vertical style={{ height: '100%' }}>
            <Spin />
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
                            <Link to="..">Go Back</Link>
                        </Button>,
                    ]}
                ></Result>
            </>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
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
            <Spin spinning={navigation.state === 'loading'} fullscreen />
            <Outlet />
        </QueryClientProvider>
    );
};

export default App;
