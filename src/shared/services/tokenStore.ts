const USER_TOKEN_KEY = 'reciteWordUser';

export const getAccessTokenUser = () => {
    return localStorage.getItem(USER_TOKEN_KEY);
};

export const setAccessTokenUser = (user: string) => {
    localStorage.setItem(USER_TOKEN_KEY, user);
};

export const removeAccessTokenUser = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
};
