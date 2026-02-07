import type { RouteConfig } from '@react-router/dev/routes';
import { route } from '@react-router/dev/routes';

export default [
    route('login', 'page/Login.tsx'),
    route('learn', 'page/Learn.tsx'),
] satisfies RouteConfig;
