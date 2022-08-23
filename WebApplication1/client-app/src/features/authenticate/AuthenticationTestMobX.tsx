import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';
import { UserDetails } from '../../models/user';
import { useStore } from '../../stores/store';

export default observer(function AuthenticationTestMobX() {
    const {userStore} = useStore();
    const [authAttempt, setAuthAttempt] = useState(false);

     useEffect(() => {
        if(userStore.userDetails == null && userStore.attempted == false) {
            console.log('Use effect called');
            setAuthAttempt(true);
            userStore.getUser();
        }
    }, []);

    return (
        <>
        {userStore.userDetails !== null && 
        <>
        <p>Display Name: {userStore.userDetails.displayName}</p>
        <p>Token: {userStore.userDetails.token}</p>
        <p>Image: {userStore.userDetails.image}</p>
        </>
        }
        <button onClick={() => userStore.login({username: 'admin', password: 'P@ssw0rd'})}>
            Login
        </button>
        <button onClick={userStore.logout}>
            Logout
        </button>
        <button onClick={userStore.getUser}>
            getUserDetails
        </button>
        </>
    )
})