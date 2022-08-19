export interface User  {
    username : string;
    token : string;
}

export interface UserDetails {
    displayName: string;
    image: string;
    token: string;
}

export interface UserFormValues {
    username: string;
    password: string;
}