import React from "react";
import {Link} from "react-router-dom";
import style from "./Header.module.scss";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/useStore";
import clsx from "clsx";
import {authApi} from "../../api/auth.api";
import {useGoogleLogin} from "@react-oauth/google";
import {getLocalStorage, removeLocalStorage, setLocalStorage} from "../../localStorage/localStorage";

export const Header = observer(() => {
    const {authStore: {userInfo, auth, setAuth, setUserInfo}} = useStore();

    // registration
    const onRegistrationSuccess = async (code: string) => {
        const tokens = await authApi.registrationByGoogle(code);
    }
    const registration = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await onRegistrationSuccess(tokenResponse.code);
        },
        onError: (errorResponse) => console.log(errorResponse),
        flow: 'auth-code'
    });

    // login
    const onLoginSuccess = async (code: string) => {
        try {
            const response = await authApi.loginByGoogle(code);
            //console.log(response.data.accessToken);
            setLocalStorage({accessToken: response.data.accessToken});
            setAuth(true);
            const resp = await authApi.userInfo();
            setUserInfo(resp.data);
        } catch (e: any) {
            console.log(e.message)
        }

    }
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            await onLoginSuccess(tokenResponse.code);
        },
        onError: (errorResponse) => console.log(errorResponse),
        flow: 'auth-code'
    });

    const logout = async () => {
        try {
            setAuth(false);
            setUserInfo(null);
            removeLocalStorage();
            await authApi.logout();
        } catch (e: any) {
            console.log(e.message)
        }
    }

    const localStorage = getLocalStorage();

    return (
        <header className={style.header}>
            <Link to="/"
                  className={style.logo}
            >
                OAuth 2.0 + OpenID
            </Link>

            <div className={style.right}>

                <nav className={style.links}>

                    {/*    {*/}
                    {/*        (auth ? links : notAuthLinks).map(({label, to}, index) => (*/}
                    {/*            <Link to={to}*/}
                    {/*                  key={index}*/}
                    {/*                  className={style.link}*/}
                    {/*            >*/}
                    {/*                {label}*/}
                    {/*            </Link>*/}
                    {/*        ))*/}
                    {/*    }*/}

                    <button className={clsx(style.link, style.btn)}
                            onClick={() => registration()}
                    >
                        Sign-up with Google
                    </button>

                    <button className={clsx(style.link, style.btn)}
                            onClick={() => login()}
                    >
                        Sign-in with Google
                    </button>

                    {
                        localStorage &&
                        <button className={clsx(style.link, style.btn)}
                                onClick={() => logout()}
                        >
                            Logout
                        </button>
                    }
                </nav>

                {
                    userInfo &&
                    <div className={style.userInfo}>
                        {userInfo.picture && <img src={userInfo.picture} alt=""/>}
                        <div className={style.texts}>
                            <p>{userInfo.login}</p>
                            <p>{userInfo.email}</p>
                        </div>

                    </div>
                }
            </div>

        </header>
    )
})
