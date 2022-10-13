import React, {useEffect} from 'react';
import style from "./App.module.scss"
import {authApi} from "../../api/auth.api";
import {Header} from "../A1_Header/Header";
import {useStore} from "../../store/useStore";
import {observer} from "mobx-react-lite";

export const App = observer(() => {
    const {authStore: {setUserInfo}} = useStore();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await authApi.userInfo();
                setUserInfo(response.data)
            } catch (e: any) {
                console.log(e)
            }
        }
        getUserInfo().then(r => {
        })
    }, [])

    return (
        <div className={style.app}>
            <Header/>
            <main className={style.main}>
                <h2>Аутентификация и авторизация через Google OAuth 2.0</h2>
                <p>
                    <span>Предустановка. </span>
                    {
                        `
                        Фронт и бэк взаимодействую с новым Google Identity Services SDK, а не с устаревшим GAPI.
                        Для этого на фронте используется библиотека @react-oauth/google, в бэке - google-auth-library. 
                        Используется flow: 'auth-code'.
                        Для взаимодействия фронта с google нужно зарегистрировать фронт-приложение на https://console.cloud.google.com
                        (создать новый проект, прописать в нем uri фронт-приложения, получить Client ID и Client secret).
                        Для фронта из учетной записи на Google Cloud нужен Client ID, для бэка - Client ID и Client secret.                       
                        `
                    }
                </p>

                <p>
                    <span>Регистрация </span>
                    {
                        `
                    (registration, sign-up): На фронте юзер входит в свой профиль google, в ответ получает code, 
                    который посылается post-запросом "auth/registration-by-google" в бэк. 
                    Бек с помощью code, CLIENT_ID и CLIENT_SECRET делает запрос в google, получает токены, 
                    среди которых есть id_token с информацией о профиле google. Этот токен верифицируется, 
                    получаются данные профиля (sub, name, email, picture) и на основе них создается запись в 
                    базе данных пользователей (userDB) с id = sub.                  
                        `
                    }
                </p>

                <p>
                    <span>Логин </span>
                    {
                        `
                        (login, sign-in): Аналогично действиями при регистрации, 
                        юзер входит в свой профиль google, в ответ получает code, 
                        который посылается post-запросом "auth/login-by-google" в бэк.
                        Бек с помощью code, CLIENT_ID и CLIENT_SECRET делает запрос в google, получает токены, 
                        среди которых есть id_token с информацией о профиле google. Этот токен верифицируется, 
                        получаются данные профиля (sub, name, email, picture). 
                        На основе этих данных (id = sub) ищется запись в userDB (проверка на существование).
                        Далее создаются токены доступа и обновления, с помощью которых происходит авторизованное взаимодействие фронта с бэком.
                        Токен обновления добавляется в httpOnly куку ответа, токен доступа - в тело ответа. 
                        `
                    }
                </p>

                <p>
                    <span>Авторизованный запрос на серер: </span>
                    {
                        `
                         В заголовок авторизованного запроса на сервер добавляется токен доступа, который верифицируется на беке (срок действия)
                         и на основе этого возвращается ошибка или обрабатывается запрос. При истечении срока действия токена доступа, 
                         отправляется запрос на обновление, на беке верифицируется токен обновления (из куки заголовка) 
                         и создается новый токен доступа, который возвращается на фронт и изначавльный запрос осуществляется с новым токеном доступа.
                        `
                    }
                </p>

                <p>
                    <span>Выход </span>
                    {
                        `
                        (logout): токен доступа на на фронте уничтожается, в бэк посылается запрос на "auth/logout", 
                        получив который бэк удаляет токен обновления из заголовков.
                        `
                    }
                </p>

                <p>
                    <span>Запрос на обновление токена доступа: </span>
                    {
                        `
                            Фронт посылает запрос на 'auth/refresh' на беке верифицируется токен обновления (из куки заголовка) 
                         и создается новый токен доступа, который возвращается на фронт.
                        `
                    }
                </p>

            </main>
        </div>
    );
})

