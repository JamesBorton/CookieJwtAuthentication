import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import { UserDetails } from '../../models/user';

export default observer(function AuthenticationTest() {

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [authAttempt, setAuthAttempt] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Nothing attempted yet.');

    async function login() {
        try {
            const user = await agent.Account.login({username: "james", password: "P@ssw0rd!"});
            console.log(user);
            if(user !== null) {
                getUserDetails();
            }
        } catch {
            setMessage('Wrong credentials.');
        }
    }
    function logout() {
        agent.Account.logout();
        setMessage('You have logged out.');
     }
     async function getUserDetails() {
        try {
            const details = await agent.Account.userDetails();
            if(details !== null) {
                console.log('details', details);
                setUserDetails(details);
                setMessage('You are logged in.');
            }
        }
        catch {
            setMessage('You are not logged in.');
        }
     }
     useEffect(() => {
        if(userDetails == null && authAttempt == false) {
            console.log('Use effect called');
            setAuthAttempt(true);
            getUserDetails();
        }
    }, []);

    return (
        <>
        <p>{message}</p>
        <button onClick={login}>
            Login
        </button>
        <button onClick={logout}>
            Logout
        </button>
        <button onClick={getUserDetails}>
            getUserDetails
        </button>
        </>
    )
})