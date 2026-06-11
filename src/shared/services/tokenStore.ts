const TOKEN_KEY = 'reciteWordAccessToken';

export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
