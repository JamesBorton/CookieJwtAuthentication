import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserDetails, UserFormValues } from "../models/user";
import { store } from "./store";
import { toast } from "react-toastify";

export default class UserStore {
    isLoggedIn: boolean = false;
    token: string | null = null;
    userDetails: UserDetails | null = null;
    attempted: boolean = false;
    showLoginError: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    login = async (creds: UserFormValues) => {
        try {
            this.setLoginErrorBool(false);
            const user = await agent.Account.login(creds);
            this.setToken(user.token);
            runInAction(() => this.userDetails = user);
            this.getUser();
        } catch (error) {
            this.setLoginErrorBool(true);
            throw error;
        }
    }

    logout = () => {
        agent.Account.logout()
            .then(() => {
                this.setToken(null);
                this.userDetails = null;
            })
            .catch(() => {
                console.log('Error during logout.');
            })
    }

    getUser = async () => {
        try {
            const user = await agent.Account.userDetails();
            this.setToken(user.token);
            runInAction(() => this.userDetails = user);
        } catch (error) {
            console.log(error);
        }
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setLoginErrorBool = (show: boolean) => {
        this.showLoginError = show;
    }

    setAttempted = (attempted: boolean) => {
        this.attempted = attempted;
    }

    setImage = (image: string) => {
        if (this.userDetails) this.userDetails.image = image;
    } 

    setDisplayName = (name: string) => {
        if (this.userDetails) this.userDetails.displayName = name;
    }
}