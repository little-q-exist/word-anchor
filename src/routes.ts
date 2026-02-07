import type { RouteConfig } from '@react-router/dev/routes';
import { layout, route } from '@react-router/dev/routes';

export default [
    layout('layout/Background.tsx', [
        route('login', 'pages/Login.tsx'),
        route('learn', 'pages/Learn.tsx'),
    ]),
] satisfies RouteConfig;
