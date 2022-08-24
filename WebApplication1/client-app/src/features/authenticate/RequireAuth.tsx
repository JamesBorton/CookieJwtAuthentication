import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../../stores/store";
import React from 'react';

export default observer(function RequireAuth({ children }: { children: JSX.Element }) {
    const {userStore} = useStore();
    
    let location = useLocation();
    console.log(userStore.userDetails);
    
    if (userStore.userDetails == null) {
        console.log('user details is null');
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  })