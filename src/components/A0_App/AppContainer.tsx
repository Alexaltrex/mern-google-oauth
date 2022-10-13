import React, {createContext} from "react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {App} from "./App";
import {RootStore, store} from "../../store/RootStore";
import {HashRouter} from "react-router-dom";

export const StoreContext = createContext<RootStore>({} as RootStore)

export const AppContainer = () => {
    return (
        <StoreContext.Provider value={store}>
            <HashRouter>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID as string}>
                    <App/>
                </GoogleOAuthProvider>
            </HashRouter>

        </StoreContext.Provider>
    )
}
