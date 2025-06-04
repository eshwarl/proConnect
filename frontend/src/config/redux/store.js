import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
/***
 * steps for statemanagement
 * submit action
 * handle action in its reducer
 * regester here -> Reducer
 */
export  const store=configureStore({
    reducer:{
        auth:authReducer,
        postReducer:postReducer,
    }

})
