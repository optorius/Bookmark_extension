import axios from "axios";


//// @Todo:!
export const API_URL = "http://localhost:5050";

const api_axios = axios.create(
    {
        withCredentials: true,
        baseURL: API_URL
    }
);

api_axios.interceptors.request.use( (config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = "Bearer " + token;
    return config;
})

api_axios.interceptors.response.use( (config) => {
        return config;
    }, async ( error ) => {
    try {
        // все данные для запроса
        const res = error.config;
        if (error.response.status >= 401 && error.config && !error.config._isRetry) {
            res._isRetry = true;
            const url = API_URL + '/refresh'
            const response = await axios.get(url, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            return api_axios.request(res);
        }
    } catch (e) {
        console.log('not auth(interceptor');
    }
    throw error;
});

export default api_axios;