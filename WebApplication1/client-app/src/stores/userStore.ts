import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserDetails, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    isLoggedIn: boolean = false;
    token: string | null = null;
    userDetails: UserDetails | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            this.setToken(user.token);
            runInAction(() => this.userDetails = user);
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        this.setToken(null);
        this.userDetails = null;
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

    setImage = (image: string) => {
        if (this.userDetails) this.userDetails.image = image;
    } 

    setDisplayName = (name: string) => {
        if (this.userDetails) this.userDetails.displayName = name;
    }
}