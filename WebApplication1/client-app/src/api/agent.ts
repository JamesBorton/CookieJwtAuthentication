import axios, { AxiosResponse } from "axios";
import { User } from "../models/user";

//Change this localhost to whatever dotnet is
axios.defaults.baseURL = 'https://localhost:7188/api';
axios.defaults.withCredentials = true;

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
    login: () => requests.post<User>('/Authentication/login', {userName: 'james', password: 'P@ssw0rd'}),
    logout: () => requests.get<User>('/Authentication/logout'),
    userDetails: () => requests.get<User>('/Authentication/userDetails'),
}

const agent = {
    Account
}

export default agent;