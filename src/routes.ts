import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, prefix, route } from '@react-router/dev/routes';

export default [
    layout('layout/Layout.tsx', [
        index('pages/Home.tsx'),
        route('login', 'pages/Login.tsx'),
        route('register', 'pages/Register.tsx'),
        ...prefix('words', [
            index('pages/Words/Words.tsx'),
            route(':id', 'pages/Words/WordInfo.tsx'),
        ]),
        route('learn', 'pages/Learn.tsx'),
        route('review', 'pages/Review.tsx'),
        route('profile', 'pages/Profile.tsx'),
    ]),
] satisfies RouteConfig;
