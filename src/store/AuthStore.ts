import {action, makeObservable, observable} from "mobx";
import {IInfoType} from "../types/types";

export class AuthStore {
    auth: boolean = false
    userInfo: IInfoType | null = null

    constructor() {
        makeObservable(this,
            {
                auth: observable,
                userInfo: observable,
                setAuth: action.bound,
                setUserInfo: action.bound,
            }
        )
    }

    setAuth(auth: boolean) {
        this.auth = auth
    }

    setUserInfo(userInfo: IInfoType | null) {
        this.userInfo = userInfo
    }

}
