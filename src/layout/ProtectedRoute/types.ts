type requiredRole = 'user';

export type ProtectedRouteConfig = { requiredRole: requiredRole } & (
    | {
          mustLogin: true;
      }
    | { mustNotLogin: true }
);
