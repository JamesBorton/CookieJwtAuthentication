import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import agent from '../../api/agent';

export default observer(function AuthenticationTest() {

    function login() {
       agent.Account.login();
    }

    function logout() {
        agent.Account.logout();
     }

     function getUserDetails() {
        agent.Account.userDetails();
     }

    return (
        <>
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