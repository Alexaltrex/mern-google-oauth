import {action, makeObservable, observable} from "mobx";


export class AppStore {
    //auth: boolean = false

    constructor() {
        makeObservable(this,
            {
                //auth: observable,
                //setAuth: action.bound,
            }
        )
    }

    // setAuth(auth: boolean) {
    //     this.auth = auth;
    // }

}
