import { Button, Result, Skeleton } from 'antd';
import { isRouteErrorResponse, Link, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { Route } from './+types/root';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './features/userSlice';

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
    return <Skeleton active />;
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

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let loggedInUser = null;
        const loggedUserJSON = localStorage.getItem('loggedReciteAppUser');
        if (loggedUserJSON) {
            loggedInUser = JSON.parse(loggedUserJSON);
            dispatch(setUser(loggedInUser));
        }
    }, [dispatch]);

    return <Outlet />;
};

export default App;
