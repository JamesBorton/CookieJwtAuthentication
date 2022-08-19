import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { User, UserDetails, UserFormValues } from "../models/user";

//Change this localhost to whatever dotnet is
axios.defaults.baseURL = 'https://localhost:7188/api';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(async response => {
    return response;
}, (error: Error | AxiosError) => {
    if (axios.isAxiosError(error))  {
        // Access to config, request, and response
        const { status } = error.response!;
    switch (status) {
        case 400:
            toast.error('Error');
            break;
        case 401:
            toast.error('Session expired - please login again');
            break;
        case 404:
            toast.error('Not found!');
            break;
        case 500:
            toast.error('Server error!');
            break;
      } 
    }
    else {
        toast.error('General error!');
      }
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url, {
        withCredentials: true
      }).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body, {
        withCredentials: true
      }).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body, {
        withCredentials: true
      }).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url, {
        withCredentials: true
      }).then(responseBody),
}

const Account = {
    login: (form: UserFormValues) => requests.post<UserDetails>('/Authentication/login', form),
    logout: () => requests.get<User>('/Authentication/logout'),
    userDetails: () => requests.get<UserDetails>('/Authentication/userDetails'),
}

const agent = {
    Account
}

export default agent;