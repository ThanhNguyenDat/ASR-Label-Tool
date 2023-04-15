import axios from 'axios';

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const APIUtils = axios.create({
    baseURL: "http://0.0.0.0:8000",
    headers: {
        'Content-Type': 'Application/json',
    },
    withCredentials: true,
})

APIUtils.interceptors.request.use(
    config => {
        // handle token here...
        config.headers['Authorization'] = `Bearer ${getCookie('access_token')}`
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// APIUtils.interceptors.response.use(
//     returnedValue => {

//     }
// )

const responseHandler = (returnedValue) => {
    try {
        if (returnedValue.error_code == 0) { // api request data
            const { data } = returnedValue; // data: key of api
            return data
        } else { // return template
            return returnedValue
        }
    } catch (error) {
        throw error
    }
}

export const get = async (path, data={}) => {
    try {
        const response = await APIUtils.get(path, data);
        return responseHandler(response.data); // data of axios config
    } catch (error) {
        throw error;
    }
}

export const post = async (path, data={}) => {
    try {
        const response = await APIUtils.post(path, data);
        return responseHandler(response.data);
    } catch (error) {
        throw error;
    }
}


export default APIUtils;