import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, route } from '@react-router/dev/routes';

export default [
    layout('layout/Layout.tsx', [
        index('pages/Home.tsx'),
        route('login', 'pages/Login.tsx'),
        route('register', 'pages/Register.tsx'),
        route('words', 'pages/Words/Words.tsx'),
        route('learn', 'pages/Learn.tsx'),
        route('words/:english', 'pages/Words/WordInfo.tsx'),
        route('review', 'pages/Review.tsx'),
    ]),
] satisfies RouteConfig;
