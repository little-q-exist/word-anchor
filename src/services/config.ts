import axios from 'axios';

import { SERVER_URL } from '../constant';

export default () => {
    axios.defaults.baseURL = SERVER_URL;
    axios.interceptors.request.use((config) => {
        const loggedUserJSON = localStorage.getItem('reciteWordAppUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    });
};
