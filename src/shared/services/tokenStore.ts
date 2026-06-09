export const getAccessToken = () => {
    return localStorage.getItem('reciteWordAccessToken');
};

export const setAccessToken = (token: string) => {
    localStorage.setItem('reciteWordAccessToken', token);
};

export const removeAccessToken = () => {
    localStorage.removeItem('reciteWordAccessToken');
};
